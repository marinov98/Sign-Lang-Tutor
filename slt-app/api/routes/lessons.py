from flask import Blueprint, jsonify, request
import json
from bson import ObjectId
from config.keys import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity

lessons = Blueprint("lessons", __name__)

# /api/lessons/modules
@lessons.route("/modules", methods=["GET"])
@jwt_required()
def get_lessons_modules():
    modules = mongo.db.lessons.distinct("module")

    return json.dumps([module for module in modules], indent=4, default=str), 200

# /api/lessons/user/<module>
@lessons.route("/user/<module>", methods=["GET"])
@jwt_required()
def get_user_lessons(module="Alphabet"):
    auth_identity = get_jwt_identity()
    lessons = mongo.db.lessons.find(
        {"module": module, "userId": ObjectId(auth_identity)}
    )
    return json.dumps([lesson for lesson in lessons], indent=4, default=str), 200

# /api/lessons/user/single/<lessonId>
@lessons.route("/user/single/<lessonId>", methods=["GET"])
@jwt_required()
def get_single_lesson(lessonId):
    lesson = mongo.db.lessons.find_one_or_404({"_id": ObjectId(lessonId)})
    return json.dumps(lesson, indent=4, default=str), 200

# /api/lessons/update/<lessonId>
@lessons.route("/update/<lessonId>", methods=["PUT", "PATCH"])
@jwt_required()
def update_lesson(lessonId):
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409

    if lessonId is None:
        return jsonify({"msg": "No id found in request!"}), 409

    stars = request.json.get("starsAchieved")
    completed = request.json.get("completed")

    if stars is None or completed is None:
        return jsonify({"msg": "starsAchieved, or completed field missing!"})

    proper_id = ObjectId(lessonId)
    lesson = mongo.db.lessons.find_one_or_404({"_id": proper_id})
    if lesson["starsAchieved"] < stars:
        mongo.db.lessons.update(
            {"_id": proper_id},
            {"$set": {"starsAchieved": stars, "completed": completed}},
        )
        return jsonify({"msg": "Lesson successfully updated!"}), 200
    
    return jsonify({"msg": "Lesson did not need updating"}), 200

# /api/lessons/reset
@lessons.route("/reset", methods=["PUT", "PATCH"])
@jwt_required()
def reset_lessons():
    auth_identity = get_jwt_identity()
    proper_id = ObjectId(auth_identity)
    mongo.db.lessons.update_many({"userId": proper_id}, 
                            {"$set": {"starsAchieved": 0, "completed": False}})
    mongo.db.users.update({"_id": proper_id},
                          {"$set": {"lessonsCompleted": 0, "stars": 0, "progress": "Just started"}})

    return jsonify({"msg": "User lessons progress reset"}), 200
    

    return jsonify({"msg": "Lesson did not need updating"}), 200

# /api/lessons/clean
@lessons.route("/clean", methods=["DELETE"])
@jwt_required()
def clean_lessons():
    mongo.db.lessons.remove({"userId": "Nonexistant"})
    return jsonify({"msg": "Lesson documents have been cleaned"}), 200