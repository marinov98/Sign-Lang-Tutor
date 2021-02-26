from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from config.keys import mongo, bcrypt
from datetime import datetime


auth = Blueprint('auth', __name__)


# /api/auth/register
@auth.route('/register', methods = ['POST'])
def register_user():
    users = mongo.db.users
    email = request.json.get("email")
    user = users.find_one({'email': email})

    if user:
        return jsonify({'message': "User with this email already exists"}), 409

    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    password = request.json.get("password")


    # create new user
    users.insert({
        'firstName': first_name,
        'lastName': last_name,
        'email': email,
        'password': bcrypt.generate_password_hash(password),
        'lessonsCompleted': 0,
        'stars': 0,
        'dateJoined': datetime.now(),
        'progress' : 'progressed'
    })

    return jsonify({'message': 'User successfully created'}), 201


# /api/auth/login
@auth.route('/login', methods = ['GET'])
def login_user():
    users = mongo.db.users
    email = request.json.get("email")
    password = request.json.get("password")
    user = users.find_one_or_404({'email': email})

    # check password
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'email and password do not match'}), 404

    # create jwt
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200
