# RemoraAdvanced.py - Enhanced AI with recommendation engine
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import traceback
import hashlib, datetime, json, os, requests, time
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import qrcode
from io import BytesIO
import base64
try:
    import remora_gemini as gemini
except Exception:
    gemini = None

# -------- Blockchain Classes --------
class Block:
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.timestamp = str(datetime.datetime.now())
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = (
            str(self.index) +
            self.timestamp +
            json.dumps(self.data, sort_keys=True, default=str) +
            self.previous_hash
        )
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, {"message": "Genesis Block"}, "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        latest_block = self.get_latest_block()
        new_block = Block(
            index=latest_block.index + 1,
            data=data,
            previous_hash=latest_block.hash
        )
        self.chain.append(new_block)
        return new_block

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            if current.hash != current.calculate_hash() or current.previous_hash != previous.hash:
                return False
        return True

# -------- Recommendation Engine --------
class RecommendationEngine:
    """Generates actionable recommendations based on SKU risk factors"""
    
    @staticmethod
    def get_recommendations(data, risk_score, feature_importance=None):
        """
        Generate recommendations based on input features and risk level.
        
        Args:
            data: original input dict
            risk_score: probability (0-1) that SKU is high-risk
            feature_importance: dict of feature -> importance score (optional)
        
        Returns:
            list of recommendation dicts with priority
        """
        recommendations = []
        
        monthly_sales = data.get("monthly_sales", 0)
        stock_level = data.get("stock_level", 0)
        lead_time_days = data.get("lead_time_days", 0)
        price = data.get("price", 0)
        supplier_reliability = data.get("supplier_reliability", 0.7)
        demand_variance = data.get("demand_variance", 0.3)
        historical_stockouts = data.get("historical_stockouts", 0)
        
        # Safety stock ratio (days of sales in stock)
        if monthly_sales > 0:
            safety_ratio = (stock_level / monthly_sales) * 30
        else:
            safety_ratio = stock_level
        
        # High risk → strong recommendations
        if risk_score > 0.7:
            priority = "high"
        elif risk_score > 0.4:
            priority = "medium"
        else:
            priority = "low"
        
        # Rule 1: Long lead times with low stock
        if lead_time_days > 30 and safety_ratio < 15:
            increase_pct = int((lead_time_days / 30) * 50)
            recommendations.append({
                "priority": "high",
                "action": f"Increase stock by {increase_pct}%",
                "reason": f"Lead time {lead_time_days}d requires {lead_time_days}-day safety buffer; currently only {safety_ratio:.1f} days in stock",
                "estimated_cost": f"${int(stock_level * increase_pct / 100 * price * 0.5)}"
            })
        
        # Rule 2: High variance demand
        if demand_variance > 0.5:
            recommendations.append({
                "priority": "medium",
                "action": "Implement demand forecasting",
                "reason": f"Demand variance is {demand_variance:.2%} (high volatility); set up ARIMA or ML forecasts",
                "estimated_cost": "Variable"
            })
        
        # Rule 3: Unreliable supplier
        if supplier_reliability < 0.8:
            recommendations.append({
                "priority": "high",
                "action": "Negotiate shorter lead time or find backup supplier",
                "reason": f"Supplier reliability {supplier_reliability:.0%} is below threshold; diversify or enforce SLA",
                "estimated_cost": "Negotiation time"
            })
        
        # Rule 4: High historical stockouts
        if historical_stockouts > 3:
            recommendations.append({
                "priority": "high",
                "action": f"Add safety stock buffer (target: 0 stockouts, currently {historical_stockouts})",
                "reason": f"SKU has {historical_stockouts} stockouts in history; boost minimum order qty",
                "estimated_cost": f"${int(stock_level * 30 * price * 0.1)}"
            })
        
        # Rule 5: Low price elasticity (high volume, low margin)
        if monthly_sales > 500 and price < 50:
            recommendations.append({
                "priority": "medium",
                "action": "Consider slight price increase or bulk discounts",
                "reason": f"High volume ({monthly_sales}u/mo) at low price (${price}); test price elasticity",
                "estimated_cost": "A/B testing"
            })
        
        # Rule 6: Preventive action for medium risk
        if 0.4 < risk_score <= 0.7:
            recommendations.append({
                "priority": "medium",
                "action": "Enable real-time monitoring and alerts",
                "reason": f"Risk score {risk_score:.0%}; set up stock-level alerts at {int(lead_time_days * monthly_sales / 30)} units",
                "estimated_cost": "Low"
            })
        
        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        recommendations.sort(key=lambda x: priority_order.get(x["priority"], 3))
        
        return recommendations[:5]  # Top 5 recommendations

# -------- Initialize Components --------
remora_chain = Blockchain()
recommendation_engine = RecommendationEngine()

# Try to load model; if not found, use simple heuristic
try:
    model = joblib.load("remora_sku_risk_model.pkl")
    print("✓ Loaded remora_sku_risk_model.pkl")
except FileNotFoundError:
    print("⚠ Model not found. Using heuristic-based risk prediction.")
    model = None

# Scaler for feature normalization
scaler = StandardScaler()

# -------- Flask App --------
app = Flask(__name__)
# Allow CORS for API routes from any origin (helpful for file:// or local dev)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.before_request
def log_request_info():
    try:
        print(f"[REQ] {request.method} {request.path} from {request.remote_addr}")
    except Exception:
        pass

def heuristic_risk_prediction(features_df):
    """
    Fallback heuristic if model file doesn't exist.
    Returns risk probability (0-1).
    """
    row = features_df.iloc[0]
    
    # Simple rule engine
    risk_score = 0.0
    
    # High lead time + low stock = risky
    if row["lead_time_days"] > 30 and row["stock_level"] < row["monthly_sales"] * 0.5:
        risk_score += 0.4
    
    # High variance demand = risky
    if row["demand_variance"] > 0.5:
        risk_score += 0.25
    
    # Low supplier reliability = risky
    if row["supplier_reliability"] < 0.8:
        risk_score += 0.2
    
    # Many historical stockouts = risky
    if row["historical_stockouts"] > 2:
        risk_score += 0.15
    
    # Cap at 1.0
    return min(risk_score, 1.0)

@app.route('/api/add_sku', methods=['POST'])
def add_sku():
    """
    Enhanced endpoint with more features and recommendations.
    
    Input JSON example:
    {
        "sku": "SKU-123",
        "monthly_sales": 800,
        "stock_level": 200,
        "lead_time_days": 45,
        "price": 150,
        "warehouse": "Manila",
        "product_category": "Electronics",
        "supplier_reliability": 0.85,
        "demand_variance": 0.2,
        "historical_stockouts": 1,
        "action": "Inventory Update"
    }
    """
    data = request.json
    
    # Extract features
    features_dict = {
        "monthly_sales": data.get("monthly_sales", 0),
        "stock_level": data.get("stock_level", 0),
        "lead_time_days": data.get("lead_time_days", 0),
        "price": data.get("price", 0),
        "supplier_reliability": data.get("supplier_reliability", 0.7),
        "demand_variance": data.get("demand_variance", 0.3),
        "historical_stockouts": data.get("historical_stockouts", 0)
    }
    
    # Encode categorical features
    warehouse = data.get("warehouse", "Unknown")
    category = data.get("product_category", "General")
    warehouse_encoded = hash(warehouse) % 10
    category_encoded = hash(category) % 10
    
    features_dict["warehouse_encoded"] = warehouse_encoded
    features_dict["category_encoded"] = category_encoded
    
    # Build feature DataFrame for model
    features_df = pd.DataFrame([features_dict])
    
    # Get risk prediction
    if model is not None:
        try:
            prediction = model.predict(features_df)[0]
            risk_prob = float(model.predict_proba(features_df)[0][1]) if hasattr(model, 'predict_proba') else float(prediction)
        except Exception as e:
            print(f"Model prediction error: {e}, using heuristic")
            risk_prob = heuristic_risk_prediction(features_df)
    else:
        risk_prob = heuristic_risk_prediction(features_df)
    
    high_risk = 1 if risk_prob > 0.5 else 0
    
    # Get feature importance (mock, in production use real SHAP/feature_importance_)
    top_drivers = []
    if "lead_time_days" in features_dict and features_dict["lead_time_days"] > 30:
        top_drivers.append("Long lead time")
    if "stock_level" in features_dict and features_dict["stock_level"] < features_dict["monthly_sales"]:
        top_drivers.append("Low safety stock")
    if features_dict["demand_variance"] > 0.5:
        top_drivers.append("High demand variance")
    if features_dict["supplier_reliability"] < 0.8:
        top_drivers.append("Low supplier reliability")
    
    # Generate recommendations
    recommendations = recommendation_engine.get_recommendations(features_dict, risk_prob)
    
    # Add enhanced data to blockchain
    enhanced_data = {**data, "high_risk": high_risk, "risk_probability": risk_prob}
    new_block = remora_chain.add_block(enhanced_data)
    
    response = {
        "message": "SKU added to blockchain with advanced insights",
        "block_index": new_block.index,
        "block_hash": new_block.hash,
        "high_risk": high_risk,
        "risk_probability": round(risk_prob, 3),
        "risk_percentage": f"{int(risk_prob * 100)}%",
        "top_risk_drivers": top_drivers,
        "recommendations": recommendations
    }
    return jsonify(response)

@app.route('/api/get_chain', methods=['GET'])
def get_chain():
    chain_data = []
    for block in remora_chain.chain:
        chain_data.append({
            "index": block.index,
            "timestamp": block.timestamp,
            "data": block.data,
            "hash": block.hash,
            "previous_hash": block.previous_hash
        })
    return jsonify(chain_data)

@app.route('/api/validate_chain', methods=['GET'])
def validate_chain():
    return jsonify({"valid": remora_chain.is_chain_valid()})

@app.route('/api/generate_qr_sku', methods=['POST'])
def generate_qr_sku():
    """
    Generate a QR code from an SKU hash.
    
    Input JSON:
    {
        "sku": "SKU-123"
    }
    
    Output:
    {
        "sku": "SKU-123",
        "sku_hash": "a1b2c3d4e5f6g7h8...",
        "qr_code_base64": "data:image/png;base64,iVBORw0KGgo...",
        "message": "QR code generated successfully"
    }
    """
    data = request.json
    sku = data.get("sku", "unknown")
    
    # Create SHA-256 hash of the SKU
    sku_hash = hashlib.sha256(sku.encode()).hexdigest()
    
    # Generate QR code from the hash
    qr = qrcode.QRCode(
        version=2,  # Version 2 = 25x25 modules (fits most SKU hashes)
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% recovery
        box_size=10,
        border=4,
    )
    qr.add_data(sku_hash)
    qr.make(fit=True)
    
    # Create image and convert to base64
    img = qr.make_image(fill_color="black", back_color="white")
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    img_base64 = base64.b64encode(img_io.getvalue()).decode()
    
    response = {
        "message": "QR code generated successfully",
        "sku": sku,
        "sku_hash": sku_hash,
        "qr_code_base64": f"data:image/png;base64,{img_base64}"
    }
    return jsonify(response)


@app.route('/api/analyze_skus', methods=['POST'])
def analyze_skus_endpoint():
    data = request.json or {}
    skus = data.get('skus') if isinstance(data.get('skus'), list) else data.get('skus', [])
    if gemini is None:
        return jsonify({"error": "Gemini helper not available", "mock": True}), 200
    try:
        return jsonify(gemini.analyze_skus(skus))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analyze_blockchain', methods=['GET'])
def analyze_blockchain_endpoint():
    # Build a simple snapshot of chain
    chain_snapshot = {
        "length": len(remora_chain.chain),
        "latest_block": remora_chain.get_latest_block().__dict__,
        "valid": remora_chain.is_chain_valid()
    }
    if gemini is None:
        return jsonify({"error": "Gemini helper not available", "mock": True, "snapshot": chain_snapshot}), 200
    try:
        return jsonify(gemini.analyze_blockchain_summary(chain_snapshot))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/optimize_route', methods=['POST'])
def optimize_route_endpoint():
    data = request.json or {}
    stops = data.get('stops') if isinstance(data.get('stops'), list) else data.get('stops', [])
    if gemini is None:
        return jsonify({"error": "Gemini helper not available", "mock": True, "stops_count": len(stops)}), 200
    try:
        return jsonify(gemini.optimize_route(stops))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def geocode_address(address: str):
    """Geocode a single address using Google Maps Geocoding API. Returns dict with lat/lng or None."""
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        return None
    try:
        params = {'address': address, 'key': api_key}
        resp = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=params, timeout=10)
        if resp.status_code != 200:
            return None
        j = resp.json()
        if j.get('status') != 'OK' or not j.get('results'):
            return None
        loc = j['results'][0]['geometry']['location']
        return {'lat': loc['lat'], 'lng': loc['lng'], 'formatted_address': j['results'][0].get('formatted_address')}
    except Exception as e:
        print(f"Geocode error for '{address}': {e}")
        return None


@app.route('/api/optimize_route_addresses', methods=['POST'])
def optimize_route_addresses():
    """Accepts JSON `{ "addresses": ["addr1", "addr2", ...] }`, geocodes them, and calls the route optimizer."""
    data = request.json or {}
    addresses = data.get('addresses')
    if not isinstance(addresses, list):
        return jsonify({"error": "addresses must be a list of strings"}), 400

    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if not api_key:
        # graceful fallback when key missing
        geocoded = []
        for a in addresses:
            geocoded.append({"address": a, "lat": None, "lng": None})
        return jsonify({"error": "GOOGLE_MAPS_API_KEY not set", "mock": True, "stops": geocoded}), 200

    geocoded_stops = []
    for addr in addresses:
        if not isinstance(addr, str) or not addr.strip():
            return jsonify({"error": f"Invalid address: {addr}"}), 400
        g = geocode_address(addr)
        if g is None:
            return jsonify({"error": f"Could not geocode address: {addr}"}), 400
        geocoded_stops.append({"address": g.get('formatted_address') or addr, "lat": g['lat'], "lng": g['lng']})

    # If no API key, return mock
    if not api_key:
        if gemini is None:
            return jsonify({"error": "GOOGLE_MAPS_API_KEY not set", "mock": True, "stops": geocoded_stops}), 200
        try:
            return jsonify(gemini.optimize_route(geocoded_stops))
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Build distance/time matrix using Google Distance Matrix with traffic awareness
    def build_time_matrix(stops):
        coords = [f"{s['lat']},{s['lng']}" for s in stops]
        origins = "|".join(coords)
        destinations = origins
        params = {
            'origins': origins,
            'destinations': destinations,
            'key': api_key,
            'departure_time': int(time.time()),
            'traffic_model': 'best_guess'
        }
        try:
            resp = requests.get('https://maps.googleapis.com/maps/api/distancematrix/json', params=params, timeout=15)
            if resp.status_code != 200:
                print('Distance Matrix HTTP', resp.status_code, resp.text)
                return None
            j = resp.json()
            if j.get('status') != 'OK':
                print('Distance Matrix status', j.get('status'))
                return None
            matrix = []
            rows = j.get('rows', [])
            for i, row in enumerate(rows):
                elems = row.get('elements', [])
                row_times = []
                for e in elems:
                    # prefer duration_in_traffic when available
                    t = None
                    if isinstance(e, dict):
                        if e.get('status') == 'OK':
                            if e.get('duration_in_traffic'):
                                t = e['duration_in_traffic'].get('value')
                            elif e.get('duration'):
                                t = e['duration'].get('value')
                    row_times.append(t if t is not None else float('inf'))
                matrix.append(row_times)
            return matrix
        except Exception as ex:
            print('Distance Matrix error', ex)
            return None

    time_matrix = build_time_matrix(geocoded_stops)
    if time_matrix is None:
        # fallback to gemini optimizer if available
        if gemini is not None:
            try:
                return jsonify(gemini.optimize_route(geocoded_stops))
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        return jsonify({"error": "Could not build time matrix and no optimizer available"}), 500

    # Simple nearest-neighbor greedy TSP using travel time (traffic-aware)
    n = len(geocoded_stops)
    visited = [False] * n
    order = []
    current = 0
    order.append(current)
    visited[current] = True
    total_seconds = 0
    for _ in range(n - 1):
        best = None
        best_time = float('inf')
        for j, v in enumerate(visited):
            if not v:
                t = time_matrix[current][j]
                if t < best_time:
                    best_time = t
                    best = j
        if best is None:
            break
        order.append(best)
        visited[best] = True
        if best_time != float('inf'):
            total_seconds += best_time
        current = best

    ordered_stops = [geocoded_stops[i] for i in order]
    total_minutes = round(total_seconds / 60, 1)

    result = {
        'mode': 'traffic_aware',
        'order': order,
        'ordered_stops': ordered_stops,
        'total_travel_time_seconds': total_seconds,
        'total_travel_time_minutes': total_minutes,
        'time_matrix_sample': time_matrix
    }

    # Optionally augment with Gemini explanation
    if gemini is not None:
        try:
            explanation = gemini.optimize_route(ordered_stops)
            result['gemini_explanation'] = explanation
        except Exception:
            pass

    return jsonify(result)

if __name__ == '__main__':
    print("\n" + "="*60)
    print(" REMORA Advanced SKU Tracker with AI + Recommendations")
    print("="*60)
    print("\nStarting Flask server on http://127.0.0.1:5000")
    print("Open http://127.0.0.1:5000 in your browser")
    print("="*60 + "\n")
    app.run(debug=True)
