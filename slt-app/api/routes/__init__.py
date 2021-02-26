from .auth import auth
from .token import token
from .analysis import analysis
from .users import users

def init_app(app):
    with app.app_context():
        app.register_blueprint(auth, url_prefix="/auth")
        app.register_blueprint(token, url_prefix="/token")
        app.register_blueprint(analysis, url_prefix="/analysis")
        app.register_blueprint(users, url_prefix="/users")
