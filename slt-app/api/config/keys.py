import os
import torch
import torchvision.models as models
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
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = models.alexnet(num_classes=24)
    PATH = os.path.realpath(os.path.join(os.getcwd(), "../ml-model","final-models", "model_weights","alexnet_model_weights","alexnet_final_model.pth.tar"))
    model.load_state_dict(torch.load(PATH, map_location=device))
    model.eval()
    model = model.to(device)
except:
    print("Check your environment variables")
    raise
