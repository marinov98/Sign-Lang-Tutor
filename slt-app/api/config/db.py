from flask_pymongo import PyMongo

def initialize_db(app, db_url, db_name, mongo):
    app.config["MONGO_URI"] = db_url
    app.config["MONGO_DBNAME"] = db_name
    mongo.init_app(app)

