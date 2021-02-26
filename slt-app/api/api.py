import os
from flask import Flask
from flask_pymongo import PyMongo
from config import activate_env


def create_app():
    activate_env()
    #from . import .models.users, routes
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.getenv("DB_URL")
    mongo = PyMongo(app)

    with app.app_context():
        app.register_blueprint(auth, url_prefix="/auth")
        app.register_blueprint(tokens, url_prefix="/tokens")
        app.register_blueprint(analysis, url_prefix="/analysis")

    return app


app = create_app()

if __name__ == "__main__":
    app.run()

