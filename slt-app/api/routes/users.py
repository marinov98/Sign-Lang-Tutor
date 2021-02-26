from flask import Blueprint, jsonify
import json
from config.keys import mongo
from flask_jwt_extended import jwt_required

users = Blueprint('users', __name__)

@users.route('/all', methods = ['GET'])
@jwt_required()
def get_all_users():
    all_users = mongo.db.users.find()
    return json.dumps([learner for learner in all_users],indent=4, default=str), 200
