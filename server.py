import os
from datetime import timezone, timedelta, datetime
from flask import Flask
from api.config.keys import bcrypt, mongo, db_url, db_name, jwt
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    get_jwt,
    get_jwt_identity,
)


def create_app():
    if os.getenv("FLASK_ENV") == "development":
        from flask_cors import CORS

        # initialize flask app creation
        app = Flask(__name__)
        app.config["JWT_COOKIE_SECURE"] = False
        CORS(app, supports_credentials=True, withCredentials=True)
    else:
        app = Flask(__name__, static_folder="./build", static_url_path="/")
        app.config["JWT_COOKIE_SECURE"] = True

    # jwt and bcrypt
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=6)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    jwt.init_app(app)
    bcrypt.init_app(app)

    # database
    app.config["MONGO_URI"] = db_url
    app.config["MONGO_DBNAME"] = db_name
    mongo.init_app(app)

    # routes
    from api.routes import init_app

    init_app(app)

    return app


app = create_app()

if os.getenv("FLASK_ENV") != "development":
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

# implicit method for refreshing tokens
@app.after_request
def refresh_expiring_jwts(response):
    """ Refresh tokens that are within 15 minute(s) of expiring """
    try:
        exp_time = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target = datetime.timestamp(now + timedelta(minutes=15))
        if target > exp_time:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # original response
        return response


if __name__ == "__main__":
    if os.getenv("FLASK_ENV") == "development":
        app.run(host="0.0.0.0", port="5000")
    else:
        app.run(host="0.0.0.0", debug=False, port=int(os.environ.get("PORT", 5000)))
