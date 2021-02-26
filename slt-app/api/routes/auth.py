from flask import Blueprint

auth = Blueprint('auth', __name__)


@auth.route('/register', methods = ['POST'])
def register_user():
    pass

@auth.route('/login', methods = ['GET'])
def login_user():
    pass
