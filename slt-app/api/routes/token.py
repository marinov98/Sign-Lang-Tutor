from flask import Blueprint

token = Blueprint('token', __name__)

@token.route("/refresh", methods = ['POST'])
def refresh_token():
    pass
