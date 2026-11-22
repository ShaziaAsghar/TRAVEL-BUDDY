from flask import Blueprint, request, jsonify
from ai_modules.itinerary.restaurants import find_restaurants

restaurant_bp = Blueprint("restaurants", __name__)


@restaurant_bp.get("")
def list_restaurants():
    destination = request.args.get("destination", "")
    cuisine = request.args.get("cuisine") or None
    try:
        max_price = float(request.args["max_price"]) if request.args.get("max_price") else None
    except ValueError:
        return jsonify({"error": "max_price must be a number"}), 400

    restaurants = find_restaurants(destination, cuisine, max_price)
    all_for_place = find_restaurants(destination)
    return jsonify({
        "destination": destination,
        "restaurants": restaurants,
        "cuisines": sorted({r["cuisine"] for r in all_for_place}),
        "note": "Prices are indicative (PKR per person per meal). Verify before you travel."
    })
