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

# /api/users/update or /api/users/update?id=A_USER_ID
@users.route('/update', methods = ['PUT'])
@jwt_required()
def update_user():
    if not request.data:
        return jsonify({'message': 'no data found in request'}), 409

    user_id = request.args.get('id')
    email = request.json.get("email")
    lessons = request.json.get('lessonsCompleted')
    stars = request.json.get('stars')
    progress = request.json.get('progress')

    if not lessons or not stars or not progress:
        return jsonify({'message': 'lessons, stars, or progress data missing!'})

    if user_id:
        user = mongo.db.users.find_one_or_404({'_id': ObjectId(user_id)})
        mongo.db.users.update({'_id': ObjectId(user_id)},
                              {'$set': {'lessonsCompleted': lessons,
                                        'stars': stars,
                                        'progress': progress }})
    elif email:
        user = mongo.db.users.find_one_or_404({'email': email})
        mongo.db.users.update({'email': email},
                              {'$set': {'lessonsCompleted': lessons,
                                        'stars': stars,
                                        'progress': progress }})

    return jsonify({'message': 'user successfully updated!'}), 200



