"""
remora_gemini.py

Helper to analyze SKUs using Google Vertex AI / Gemini when configured,
or fall back to a deterministic local analyzer when not.

Functions:
  - analyze_sku(sku_dict) -> dict
  - analyze_skus(list_of_sku_dicts) -> dict

Configuration (environment variables):
  - GEMINI_ENDPOINT: optional Vertex AI endpoint resource name (for PredictionServiceClient)
  - GEMINI_PROJECT, GEMINI_LOCATION, GEMINI_MODEL: alternative to call model via REST

Notes:
  - If `google.cloud.aiplatform` is installed and credentials are available,
    the module will attempt to call the model. Otherwise it returns a local
    mock analysis suitable for demos and offline operation.
"""
from typing import List, Dict, Any
import os, json, time, hashlib

_HAS_AIP = False
_HAS_GOOGLE_AUTH = False
try:
    import google.auth
    from google.auth.transport.requests import Request as GARequest
    _HAS_GOOGLE_AUTH = True
except Exception:
    _HAS_GOOGLE_AUTH = False

try:
    from google.cloud import aiplatform
    from google.cloud.aiplatform.gapic import PredictionServiceClient
    _HAS_AIP = True
except Exception:
    _HAS_AIP = False

import requests


def _build_prompt(sku: Dict[str, Any]) -> str:
    """Create a clear instruction prompt for Gemini to return JSON results."""
    lines = [
        "You are a supply-chain business advisor. Analyze the SKU below and",
        "return a JSON object with the following fields:",
        "- sku: string or null",
        "- risk_score: number between 0 and 1",
        "- recommended_actions: list of objects {priority, action, reason, estimated_cost}",
        "- business_strategy: short text describing 1-2 strategic recommendations",
        "Do not include any explanation outside the JSON. Output must be valid JSON.",
        "SKU DATA:", json.dumps(sku, default=str)
    ]
    return "\n".join(lines)


def _local_analyze_single(sku: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic local fallback analyzer used when Gemini isn't available."""
    monthly = float(sku.get('monthly_sales', 0) or 0)
    stock = float(sku.get('stock_level', 0) or 0)
    lead = float(sku.get('lead_time_days', 0) or 0)
    supplier = float(sku.get('supplier_reliability', 0.8) or 0.8)
    demand_var = float(sku.get('demand_variance', 0.3) or 0.3)
    hist = int(sku.get('historical_stockouts', 0) or 0)

    score = 0.0
    if lead > 30 and stock < max(1, monthly * 0.5):
        score += 0.45
    if demand_var > 0.5:
        score += 0.25
    if supplier < 0.8:
        score += 0.2
    if hist > 2:
        score += 0.15
    score = min(score, 1.0)

    recs = []
    if score > 0.7:
        recs.append({
            'priority': 'high',
            'action': 'Increase reorder quantity and secure expedited shipments',
            'reason': f'Risk score {score:.2f}: long lead time and low inventory',
            'estimated_cost': 'Variable; depends on expedited freight and inventory value'
        })
    if supplier < 0.8:
        recs.append({
            'priority': 'medium',
            'action': 'Audit supplier performance and qualify a backup',
            'reason': f'Supplier reliability {supplier:.2f} below threshold',
            'estimated_cost': 'Moderate (sourcing effort)'
        })
    if monthly > 500 and (sku.get('price') or 0) < 50:
        recs.append({
            'priority': 'low',
            'action': 'Test small price increases or bundle offers',
            'reason': 'High velocity, low margin — optimize price/mix',
            'estimated_cost': 'Low'
        })
    if not recs:
        recs.append({
            'priority': 'low',
            'action': 'Monitor KPIs and set alerts',
            'reason': 'No immediate corrective action recommended',
            'estimated_cost': 'Low'
        })

    strategy = 'Prioritize supply continuity: increase safety stock for slow-moving/high-lead SKUs and diversify suppliers.'
    return {
        'sku': sku.get('sku'),
        'risk_score': round(score, 3),
        'recommended_actions': recs,
        'business_strategy': strategy,
        'source': 'local'
    }


def _call_vertex_rest(prompt: str) -> str:
    """Call Vertex AI text generation model via REST using google-auth for token.
    Requires GEMINI_PROJECT, GEMINI_LOCATION, GEMINI_MODEL env vars and google-auth credentials.
    Returns raw string output from the model.
    """
    project = os.getenv('GEMINI_PROJECT')
    location = os.getenv('GEMINI_LOCATION', 'us-central1')
    model = os.getenv('GEMINI_MODEL')
    if not (project and model and _HAS_GOOGLE_AUTH):
        raise RuntimeError('Vertex REST config missing or google-auth not available')

    # Acquire access token
    creds, _ = google.auth.default()
    creds.refresh(GARequest())
    token = creds.token

    url = f'https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:predict'
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    body = {
        'instances': [{'content': prompt}],
        'parameters': {'maxOutputTokens': 512}
    }
    resp = requests.post(url, headers=headers, json=body, timeout=30)
    resp.raise_for_status()
    j = resp.json()
    # The exact response shape varies; attempt to extract text
    if 'predictions' in j and isinstance(j['predictions'], list) and len(j['predictions']) > 0:
        # predictions may contain 'content' or text fields
        p = j['predictions'][0]
        if isinstance(p, dict):
            return p.get('content') or json.dumps(p)
        return str(p)
    return json.dumps(j)


def _call_vertex_gapic(prompt: str) -> str:
    """Call Vertex AI via PredictionServiceClient if `GEMINI_ENDPOINT` is provided.
    Expects an endpoint resource name like:
      projects/PROJECT/locations/LOCATION/endpoints/ENDPOINT_ID
    Returns raw string output.
    """
    endpoint = os.getenv('GEMINI_ENDPOINT')
    if not endpoint or not _HAS_AIP:
        raise RuntimeError('GEMINI_ENDPOINT not set or aiplatform not installed')
    client = PredictionServiceClient()
    instances = [{'content': prompt}]
    params = {}
    response = client.predict(endpoint=endpoint, instances=instances, parameters=params)
    # response.predictions is a Sequence of Value dicts
    if hasattr(response, 'predictions') and len(response.predictions) > 0:
        first = response.predictions[0]
        if isinstance(first, dict):
            return first.get('content') or json.dumps(first)
        return str(first)
    return ''


def _parse_model_output(text: str) -> Dict[str, Any]:
    """Try to parse JSON out of the model output; if parse fails, wrap text into explanation."""
    if not text:
        return {'error': 'empty response from model'}
    # Try to find a JSON substring
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        # attempt to locate first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end+1])
            except Exception:
                pass
    # fallback: return text as explanation
    return {'explanation': text}


def analyze_sku(sku: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze a single SKU; prefer Gemini call when configured, otherwise local fallback.

    Returns a dict with `sku`, `risk_score`, `recommended_actions`, and `business_strategy`.
    """
    prompt = _build_prompt(sku)
    # Try gapic endpoint first
    if _HAS_AIP and os.getenv('GEMINI_ENDPOINT'):
        try:
            out = _call_vertex_gapic(prompt)
            parsed = _parse_model_output(out)
            parsed.setdefault('source', 'gemini')
            return parsed
        except Exception as e:
            # fall through to other methods
            print('Gapic Gemini call failed:', e)

    # Try REST route if project/model configured
    if _HAS_GOOGLE_AUTH and os.getenv('GEMINI_PROJECT') and os.getenv('GEMINI_MODEL'):
        try:
            out = _call_vertex_rest(prompt)
            parsed = _parse_model_output(out)
            parsed.setdefault('source', 'gemini')
            return parsed
        except Exception as e:
            print('Vertex REST call failed:', e)

    # Final fallback: local deterministic analyzer
    return _local_analyze_single(sku)


def analyze_skus(skus: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Batch analyze SKUs. Returns a dict with `mode` and `output` list."""
    outputs = []
    for s in skus:
        try:
            out = analyze_sku(s)
        except Exception as e:
            out = {'sku': s.get('sku'), 'error': str(e)}
        outputs.append(out)
    return {'mode': 'mixed', 'output': outputs}


if __name__ == '__main__':
    # Quick manual demo when run directly
    demo = {'sku': 'SKU-TEST-1', 'monthly_sales': 800, 'stock_level': 100, 'lead_time_days': 45, 'price': 120}
    print('Analyzing demo SKU (this will use Gemini if configured):')
    print(json.dumps(analyze_sku(demo), indent=2))
import os
from typing import List, Dict, Any

GEMINI_ENABLED = os.getenv("GEMINI_ENABLED", "false").lower() in ("1", "true", "yes")
GEMINI_PROJECT = os.getenv("GEMINI_PROJECT")
GEMINI_LOCATION = os.getenv("GEMINI_LOCATION", "us-central1")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "text-bison@001")


def _mock_response(task: str, data: Any) -> Dict[str, Any]:
    return {
        "mode": "mock",
        "task": task,
        "summary": "Mock response - enable Gemini with GEMINI_ENABLED=1 and set Google credentials.",
        "input_preview": data,
    }


def _call_gemini(prompt: str, max_output_tokens: int = 512) -> str:
    try:
        from google.cloud import aiplatform

        if GEMINI_PROJECT:
            aiplatform.init(project=GEMINI_PROJECT, location=GEMINI_LOCATION)

        try:
            model = aiplatform.TextGenerationModel.from_pretrained(GEMINI_MODEL)
            response = model.predict(prompt, max_output_tokens=max_output_tokens)
            if hasattr(response, "text"):
                return response.text
            return str(response)
        except Exception:
            # fallback to prediction client
            client = aiplatform.gapic.PredictionServiceClient()
            model_name = f"projects/{GEMINI_PROJECT}/locations/{GEMINI_LOCATION}/models/{GEMINI_MODEL}"
            instance = {"content": prompt}
            response = client.predict(endpoint=model_name, instances=[instance])
            if response and hasattr(response, "predictions") and len(response.predictions) > 0:
                return str(response.predictions[0])
            return str(response)
    except Exception as e:
        return f"GEMINI_CALL_ERROR: {e}"


def analyze_skus(skus: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not GEMINI_ENABLED:
        return _mock_response("analyze_skus", {"skus_count": len(skus)})

    prompt = "Analyze these SKUs and identify consolidation, slow-movers, bundling suggestions, and blockchain label ideas. Output JSON.\n\nSKUS:\n"
    for s in skus:
        prompt += f"- {s}\n"

    text = _call_gemini(prompt)
    return {"mode": "gemini", "output": text}


def analyze_blockchain_summary(snapshot: Dict[str, Any]) -> Dict[str, Any]:
    if not GEMINI_ENABLED:
        return _mock_response("analyze_blockchain", snapshot)

    prompt = "Summarize this blockchain snapshot: health, forks, suspicious patterns, and suggestions for integrity. Output JSON.\n\n" + str(snapshot)
    text = _call_gemini(prompt)
    return {"mode": "gemini", "output": text}


def optimize_route(stops: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not GEMINI_ENABLED:
        order = list(range(len(stops)))
        return _mock_response("optimize_route", {"stops_count": len(stops), "order": order})

    prompt = "Optimize these delivery stops and return ordered indices plus short rationale (JSON).\n\nStops:\n"
    for i, s in enumerate(stops):
        prompt += f"{i}: {s}\n"

    text = _call_gemini(prompt)
    return {"mode": "gemini", "output": text}
