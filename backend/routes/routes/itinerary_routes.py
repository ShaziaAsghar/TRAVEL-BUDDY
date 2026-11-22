from flask import Blueprint, request, jsonify
from ai_modules.itinerary.itinerary_generator import generate_itinerary
itinerary_bp = Blueprint("itinerary", __name__)

@itinerary_bp.post("/generate")
def generate():
    data = request.get_json(silent=True) or {}
    try:
        duration = int(data.get("duration", 3))
        budget = float(data.get("budget", 25000))
        if duration < 1 or duration > 30 or budget < 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Duration must be 1–30 days and budget must be non-negative"}), 400
    return jsonify(generate_itinerary(
        destination=data.get("destination") or "Northern Pakistan",
        duration=duration, budget=budget, style=data.get("style", "Nature"),
        query=data.get("query", ""),
        restaurant_ids=[str(i) for i in (data.get("restaurants") or [])][:20]
    ))
