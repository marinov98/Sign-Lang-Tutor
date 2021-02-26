from flask_pymongo import PyMongo
from keys import mongo, db_name, db_url

def initialize_db(app):
    app.config["MONGO_URI"] = db_url
    app.config["MONGO_DBNAME"] = db_name
    mongo.init_app(app)

