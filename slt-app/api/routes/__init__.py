from .auth import auth
from .token import token
from .analysis import analysis

def init_app(app):
    with app.app_context():
        app.register_blueprint(auth, url_prefix="/auth")
        app.register_blueprint(tokens, url_prefix="/tokens")
        app.register_blueprint(analysis, url_prefix="/analysis")
