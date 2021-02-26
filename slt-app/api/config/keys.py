import os
from flask_pymongo import PyMongo

try:
    db_url = os.getenv('DB_URL')
    db_name = os.getenv('DB_NAME')
    secret = os.getenv('SECRET')
    mongo = PyMongo()
except:
    print("Check your environment variables")
    raise


