from datetime import timezone, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, set_access_cookies, get_jwt, create_access_token

token = Blueprint('token', __name__)

# explicit method for refreshing tokens
@token.route("/refresh", methods = ['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


