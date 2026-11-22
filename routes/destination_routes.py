from flask import Blueprint, jsonify
destination_bp = Blueprint("destinations", __name__)

SAMPLE_DESTINATIONS = [
    {"id": 1, "name": "Hunza Valley", "region": "Northern Pakistan", "description": "Mountain scenery, forts and local culture.", "interests": ["nature", "mountains", "culture"], "estimated_daily_cost": 8000},
    {"id": 2, "name": "Skardu", "region": "Northern Pakistan", "description": "Lakes, valleys and mountain adventures.", "interests": ["nature", "adventure", "mountains"], "estimated_daily_cost": 9000},
    {"id": 3, "name": "Naran", "region": "Northern Pakistan", "description": "Forests, rivers and alpine landscapes.", "interests": ["nature", "relaxation"], "estimated_daily_cost": 6500},
    {"id": 4, "name": "Lahore", "region": "Punjab", "description": "Historic architecture, food and museums.", "interests": ["culture", "food", "history"], "estimated_daily_cost": 5000}
]

@destination_bp.get("")
def get_destinations():
    return jsonify({"destinations": SAMPLE_DESTINATIONS})
