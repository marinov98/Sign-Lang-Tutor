from config.keys import mongo, bcrypt
import json
from bson import ObjectId
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt_identity


auth = Blueprint('auth', __name__)


# /api/auth/register
@auth.route('/register', methods = ['POST'])
def register_user():
    if not request.data:
        return jsonify({'msg': 'No data found in request!'}), 409

    users = mongo.db.users
    email = request.json.get('email')

    if email is None:
        return jsonify({'msg': 'Email not found in body!'}), 409

    user = users.find_one({'email': email})

    if user:
        return jsonify({'msg': 'User with this email already exists!'}), 409

    first_name = request.json.get('firstName', 'Not provided')
    last_name = request.json.get('lastName', 'Not provided')
    password = request.json.get('password')

    if password is None:
        return jsonify({'msg': 'Password not found in body!'}), 409


    # create new user
    users.insert({
        'firstName': first_name,
        'lastName': last_name,
        'email': email,
        'password': bcrypt.generate_password_hash(password),
        'lessonsCompleted': 0,
        'stars': 0,
        'dateJoined': datetime.now(),
        'progress' : 'Just started'
    })

    return jsonify({'msg': 'User successfully created!'}), 201


# /api/auth/login
@auth.route('/login', methods = ['POST'])
def login_user():
    if not request.data:
        return jsonify({'msg': 'No data found in request!'}), 409

    users = mongo.db.users
    email = request.json.get('email')
    password = request.json.get('password')
    user = users.find_one({'email': email})

    if not email or not password:
        return jsonify({'msg': 'Blank field(s) detected!'}), 409

    if not user:
        return jsonify({'msg': 'Email and password do not match!'}), 404

    # check password
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'msg': 'Email and password do not match!'}), 404

    # create jwt
    access_token = create_access_token(identity=str(user['_id']))
     
    #  refresh_token = create_refresh_token(identity=email)  #  explicit refreshing
    response = jsonify({'msg': "Login successful!"})
    set_access_cookies(response, access_token) # implicit refreshing
    return response

# /api/auth/user
@auth.route('/user', methods = ['GET','POST'])
@jwt_required()
def get_authenticated_user():
    auth_identity = get_jwt_identity()
    user = mongo.db.users.find_one_or_404({'_id': ObjectId(auth_identity)})
    
    return json.dumps(user,indent=4, default=str), 200

# /api/auth/delete
@auth.route('/delete', methods = ['DELETE'])
@jwt_required()
def delete_user_account():
    auth_identity = get_jwt_identity()
    mongo.db.users.remove({'_id': ObjectId(auth_identity)})
    # TODO: delete user's lessons?
    
    return jsonify({'msg': 'Deletion applied successfully!'}), 200

# /api/auth/logout
@auth.route('/logout', methods = ['POST'])
def logout_user():
    response = jsonify({'msg': 'Logout successful!'})
    unset_jwt_cookies(response)
    return response
