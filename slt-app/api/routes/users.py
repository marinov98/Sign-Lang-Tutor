from flask import Blueprint, jsonify, request
import json
from bson import ObjectId
from config.keys import mongo
from flask_jwt_extended import jwt_required

users = Blueprint('users', __name__)


# /api/users/all
@users.route('/all', methods = ['GET', 'POST'])
@jwt_required()
def get_all_users():
    all_users = mongo.db.users.find()
    return json.dumps([learner for learner in all_users],indent=4, default=str), 200

# /api/users/single or /api/users/single?id=A_USER_ID
@users.route('/single', methods = ['GET', 'POST'])
@jwt_required()
def get_user():
    user_id = request.args.get('id')
    email = None
    if request.data:
        email = request.json.get('email')

    if user_id:
        user = mongo.db.users.find_one_or_404({'_id': ObjectId(user_id)})
    elif email:
        user = mongo.db.users.find_one_or_404({'email': email})
    else:
        return  jsonify({'message':'No id or email found!'}), 404

    if not user:
        return jsonify({'message': 'User not found!'}), 404

    return json.dumps(user,indent=4, default=str), 200


# /api/users/update or /api/users/update?id=A_USER_ID
@users.route('/update', methods = ['PUT', 'PATCH'])
@jwt_required()
def update_user():
    if not request.data:
        return jsonify({'message': 'No data found in request'}), 409

    user_id = request.args.get('id')
    email = request.json.get('email')
    lessons = request.json.get('lessonsCompleted')
    stars = request.json.get('stars')
    progress = request.json.get('progress')

    if lessons is None or stars is None or progress is None:
        return jsonify({'message': 'Lessons, stars, or progress data missing!'})

    if user_id:
        proper_id = ObjectId(user_id)
        user = mongo.db.users.find_one_or_404({'_id': proper_id})
        mongo.db.users.update({'_id': proper_id},
                              {'$set': {'lessonsCompleted': lessons,
                                        'stars': stars,
                                        'progress': progress }})
    elif email:
        user = mongo.db.users.find_one_or_404({'email': email})
        mongo.db.users.update({'email': email},
                              {'$set': {'lessonsCompleted': lessons,
                                        'stars': stars,
                                        'progress': progress }})

    return jsonify({'message': 'User successfully updated!'}), 200

# /api/users/delete or /api/users/delete?id=A_USER_ID
@users.route('/delete', methods = ['DELETE'])
@jwt_required()
def delete_user():
    user_id = request.args.get('id')
    email = None
    if request.data:
        email = request.json.get('email')

    if user_id:
        mongo.db.users.remove({'_id': ObjectId(user_id)})
    elif email:
        mongo.db.users.remove({'email': email})
    else:
        return  jsonify({'message':'No id or email found'}), 404

    return jsonify({'message': 'Deletion applied successfully!'}), 200
