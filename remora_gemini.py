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
