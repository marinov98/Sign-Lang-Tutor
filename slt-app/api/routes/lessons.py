from flask import Blueprint, jsonify, request
import json
from bson import ObjectId
from config.keys import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity

lessons = Blueprint('lessons', __name__)

# /api/lessons/modules
@lessons.route('/modules', methods = ['GET'])
@jwt_required()
def get_lessons_modules():
    modules = mongo.db.lessons.distinct('module')

    return json.dumps([module for module in modules], indent=4, default=str), 200

# /api/user/<module>
@lessons.route('/user/<module>', methods = ['GET'])
@jwt_required()
def get_user_lessons(module="Alphabet"):
    auth_identity = get_jwt_identity()
    lessons = mongo.db.lessons.find({'module': module,
                                     'userId': ObjectId(auth_identity)})
    return json.dumps([lesson for lesson in lessons], indent=4, default=str), 200

