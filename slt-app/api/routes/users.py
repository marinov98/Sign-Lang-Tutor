from flask import Blueprint, jsonify, request
import json
from bson import ObjectId
from config.keys import mongo
from flask_jwt_extended import jwt_required

users = Blueprint('users', __name__)


# /api/users/all
@users.route('/all', methods = ['GET'])
@jwt_required()
def get_all_users():
    all_users = mongo.db.users.find()
    return json.dumps([learner for learner in all_users],indent=4, default=str), 200

# /api/users/single or /api/users/single?id=A_USER_ID
@users.route('/single', methods = ['GET'])
@jwt_required()
def get_user():
    user_id = request.args.get('id')
    if request.data:
        email = request.json.get("email")

    if user_id:
        user = mongo.db.users.find_one_or_404({'_id': ObjectId(user_id)})
    elif email:
        user = mongo.db.users.find_one_or_404({'email': email})
    else:
        return  jsonify({'message':'no id or email found'}), 404

    if not user:
        return jsonify({'message': 'user not found'}), 404

    return json.dumps(user,indent=4, default=str), 200
