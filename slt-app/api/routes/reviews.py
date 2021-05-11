from config.keys import mongo
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
import json

reviews = Blueprint("review", __name__)

# /api/reviews/create
@reviews.route("/create", methods=["POST"])
@jwt_required()
def create_review():
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409

    stars = request.json.get("stars")
    if stars is None:
        return jsonify({"msg": "User did not leave a rating"}), 409

    mongo.db.reviews.insert_one({
        "userId": ObjectId(get_jwt_identity()),
        "stars": request.json.get("stars"),
        "Content": request.json.get("content", "No description provided"),
        "starsTotal": 5
    })

    return jsonify({"msg": "Review successfully submitted"})
    

# /api/reviews/get/<start>/<end>
@reviews.route("/get/<limit>", methods=["GET"])
def get_all_reviews(limit=50):
    if not limit.isdigit():
        return jsonify({"msg": "Faulty limit!"})

    reviews = mongo.db.reviews.find(limit=int(limit))

    return json.dumps([review for review in reviews], indent=4, default=str), 200


