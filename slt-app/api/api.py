import os
from flask import Flask
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from config.keys import bcrypt, mongo, db_url, db_name

# load environment
load_dotenv()

def create_app():
    # import configuration and routes
    import routes

    # initialize flask app creation
    app = Flask(__name__)

    if os.getenv("FLASK_ENV") == 'development':
        from flask_cors import CORS
        CORS(app)

    # jwt and bcrypt
    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600 * 6 # 6 hours
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 3600 * 288
    JWTManager(app)
    bcrypt.init_app(app)


    # database
    app.config["MONGO_URI"] = db_url
    app.config["MONGO_DBNAME"] = db_name
    mongo.init_app(app)

    # routes
    routes.init_app(app)

    return app


app = create_app()

if __name__ == '__main__':
    app.run()

