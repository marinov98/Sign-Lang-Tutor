from config.keys import mongo
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

reviews = Blueprint("review", __name__)

# /api/reviews/create
@review.route("/create", methods=["POST"])
@jwt_required()
def create_review():
    pass

# /api/reviews/get/<start>/<end>
@review.route("/get/<limit>", methods=["GET"])
@jwt_required()
def get_all_reviews(limit=50)
    pass
