import json
import os

from flask import Blueprint, request, jsonify, send_file, abort
from flask_jwt_extended import jwt_required

analysis = Blueprint("analysis", __name__)

# api/analysis/model/<folder>/<file>
@analysis.route("/model/<folder>/<file>", methods=["GET"])
def serve_model(folder="tfjs_model", file="model.json"):
    try:
        path = os.path.realpath(os.path.join("ml-model", folder, file))
        if file == "model.json":
            with open(path, 'r') as f:
                j = json.load(f)
            return json.dumps(j), 200
        else:
            return send_file(path, as_attachment=True)
    except FileNotFoundError:
        abort(404)


  
