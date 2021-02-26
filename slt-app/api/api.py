import os
from flask import Flask
from dotenv import load_dotenv

# load environment
load_dotenv()

def create_app():
    # import configuration and routes
    import routes
    from config.keys import db_url, db_name, mongo
    from config.db import initialize_db

    # initialize flask app creation
    app = Flask(__name__)

    initialize_db(app, db_url, db_name, mongo)
    routes.init_app(app)

    return app


app = create_app()

if __name__ == "__main__":
    app.run()

