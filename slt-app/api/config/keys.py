import os
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

try:
    db_url = os.getenv('DB_URL')
    db_name = os.getenv('DB_NAME')
    secret = os.getenv('SECRET')
    mongo = PyMongo()
    bcrypt = Bcrypt()
except:
    print("Check your environment variables")
    raise


