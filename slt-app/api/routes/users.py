from flask import Blueprint

users = Blueprint('users', __name__)

@users.route('/all', methods = ['GET'])
def get_all_users():
    pass
