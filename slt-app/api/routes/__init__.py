from .auth import auth
from .token import token
from .analysis import analysis
from .users import users
from .lessons import lessons
from config.keys import mongo


def init_app(app):
    with app.app_context():
        # create indexes
        mongo.db.users.create_index("email", unique=True)
        mongo.db.lessons.create_index("module")
        mongo.db.lessons.create_index([("module", 1), ("userId", 1)])

        # register all blueprints
        app.register_blueprint(auth, url_prefix="/api/auth")
        app.register_blueprint(token, url_prefix="/api/token")
        app.register_blueprint(analysis, url_prefix="/api/analysis")
        app.register_blueprint(users, url_prefix="/api/users")
        app.register_blueprint(lessons, url_prefix="/api/lessons")
