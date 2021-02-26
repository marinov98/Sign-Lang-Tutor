from .auth import auth
from .token import token
from .analysis import analysis
from .users import users
from config.keys import mongo

def init_app(app):
    with app.app_context():
        mongo.init_app(app)
        res = mongo.db.users.create_index("email")
        app.register_blueprint(auth, url_prefix="/api/auth")
        app.register_blueprint(token, url_prefix="/api/token")
        app.register_blueprint(analysis, url_prefix="/api/analysis")
        app.register_blueprint(users, url_prefix="/api/users")
