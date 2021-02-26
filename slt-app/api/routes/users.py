from flask import Blueprint
from config.keys import mongo

users = Blueprint('users', __name__)

@users.route('/all', methods = ['GET'])
def get_all_users():
    users = mongo.db.users.find()
    return users, 200
