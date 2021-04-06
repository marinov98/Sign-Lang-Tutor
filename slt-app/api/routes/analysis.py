import torch
import numpy as np

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config.keys import model, device
from PIL import Image
from io import BytesIO

analysis = Blueprint("analysis", __name__)

# /api/analysis/analyze
@analysis.route("/analyze", methods=["POST"])
@jwt_required()
def infer():
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409
    # something like this
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]
    image = BytesIO(request.json.get("img"))
    try:
        img = torch.as_tensor(
            np.expand_dims(np.assarray(Image.open(image)), 0)
        ).to(device)
        out = model(img)
        confidence, predicted = torch.max(out, 1)
        prediction = classes[predicted]
        return jsonify({"pred": prediction, "confidence": confidence}), 200
    except Exception as e:
        print(e)
        return jsonify({"msg": "something bad happened"}), 500
