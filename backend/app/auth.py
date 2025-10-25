from flask import Blueprint, request, jsonify
from app.db import supabase
from gotrue.errors import AuthApiError

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        # Sign up the user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        # Create a corresponding profile in the 'profiles' table
        profile_data = {
            "id": auth_response.user.id,
            "email": email,
            "full_name": full_name,
        }
        supabase.table('profiles').insert(profile_data).execute()

        return jsonify({
            "message": "User registered successfully. Please check your email to verify.",
            "user": auth_response.user.dict(),
            "session": auth_response.session.dict() if auth_response.session else None,
        }), 201

    except AuthApiError as e:
        return jsonify({"message": e.message}), e.status
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    """Logs in an existing user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Fetch user profile
        profile = supabase.table('profiles').select("*").eq('id', auth_response.user.id).single().execute()

        return jsonify({
            "message": "Login successful",
            "user": profile.data,
            "session": auth_response.session.dict(),
        }), 200
    except AuthApiError as e:
        return jsonify({"message": e.message}), e.status
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@auth_bp.route("/profile", methods=["GET", "PUT"])
def profile():
    """Get or update user profile."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]

    try:
        # Get user from token
        user_response = supabase.auth.get_user(token)
        user = user_response.user

        if request.method == "GET":
            profile_data = supabase.table('profiles').select("*").eq('id', user.id).single().execute()
            return jsonify(profile_data.data), 200

        if request.method == "PUT":
            update_data = request.get_json()
            # You can add more fields to update here
            allowed_updates = {"full_name"} 
            data_to_update = {k: v for k, v in update_data.items() if k in allowed_updates}

            if not data_to_update:
                return jsonify({"message": "No valid fields to update"}), 400

            updated_profile = supabase.table('profiles').update(data_to_update).eq('id', user.id).execute()
            return jsonify(updated_profile.data[0]), 200

    except AuthApiError as e:
        return jsonify({"message": e.message}), e.status
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500