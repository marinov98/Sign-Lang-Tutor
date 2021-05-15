from ..config.keys import mongo
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

    user_name = request.json.get("userName") if request.json.get("userName") else "anonymous"

    mongo.db.reviews.insert_one({
        "userId": ObjectId(get_jwt_identity()),
        "userName": user_name,
        "stars": request.json.get("stars"),
        "Content": request.json.get("content", "No description provided"),
        "starsTotal": 5
    })

    return jsonify({"msg": "Review successfully submitted"})
    

# /api/reviews/get/<limit>
@reviews.route("/get/<limit>", methods=["GET"])
def get_all_reviews(limit=50):
    if not limit.isdigit():
        return jsonify({"msg": "Faulty limit!"})

    reviews = mongo.db.reviews.find(limit=int(limit))

    return json.dumps([review for review in reviews], indent=4, default=str), 200

# /api/reviews/user/get
@reviews.route("/user/get", methods=["GET"])
@jwt_required()
def get_user_reviews():
    reviews = mongo.db.reviews.find({"userId": ObjectId(get_jwt_identity())})

    return json.dumps([review for review in reviews], indent=4, default=str), 200

# /api/reviews/delete
@reviews.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_review():
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409

    proper_review_id = ObjectId(request.json.get("reviewId"))
    mongo.db.reviews.find_one_or_404({"_id": proper_review_id})
    mongo.db.reviews.remove({"userId": ObjectId(get_jwt_identity()), "_id": proper_review_id})

    return jsonify({"msg": "Review successfully deleted!"})


