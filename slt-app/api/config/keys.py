import os
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

# load environment
load_dotenv()

try:
    db_url = os.getenv("DB_URL")
    db_name = os.getenv("DB_NAME")
    secret = os.getenv("SECRET")
    mongo = PyMongo()
    bcrypt = Bcrypt()
    jwt = JWTManager()
except:
    print("Check your environment variables")
    raise
