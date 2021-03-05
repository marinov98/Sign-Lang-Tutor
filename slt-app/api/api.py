import os
from datetime import timezone, timedelta
from flask import Flask
from config.keys import bcrypt, mongo, db_url, db_name, jwt


def create_app():

    # initialize flask app creation
    app = Flask(__name__)

    if os.getenv("FLASK_ENV") == 'development':
        from flask_cors import CORS
        app.config["JWT_COOKIE_SECURE"] = False
        CORS(app)
    else:
        app.config["JWT_COOKIE_SECURE"] = True

    # jwt and bcrypt
    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=5)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=6)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    jwt.init_app(app)
    bcrypt.init_app(app)


    # database
    app.config["MONGO_URI"] = db_url
    app.config["MONGO_DBNAME"] = db_name
    mongo.init_app(app)

    # routes
    import routes
    routes.init_app(app)

    return app


app = create_app()

# implicit method for refreshing tokens
@app.after_request
def refresh_expiring_jwts(response):
    """ Refresh tokens that are within 1 minute(s) of expiring """
    try:
        exp_time = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target = datetime.timestamp(now + timedelta(minutes=1))
        if target > exp_time:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # original response
        return response

if __name__ == '__main__':
    app.run()

