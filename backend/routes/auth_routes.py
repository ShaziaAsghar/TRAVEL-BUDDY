from flask import Blueprint, request, jsonify
auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    if not data.get("name") or not data.get("email") or len(data.get("password", "")) < 8:
        return jsonify({"error": "Name, valid email and password (8+ characters) are required"}), 400
    # TODO: Hash password and save user using the database model.
    return jsonify({"message": "Registration endpoint is ready; connect the user database model."}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    # TODO: Verify password hash and issue a JWT token.
    return jsonify({"message": "Login endpoint is ready; connect user verification and JWT."}), 200
