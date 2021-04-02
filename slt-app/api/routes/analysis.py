import torch

from flask import Blueprint, request, jsonify
from config.keys import model

analysis = Blueprint("analysis", __name__)


@analysis.route("/analyze", methods=["POST"])
def infer():
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409
    # something like this
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]
    image = request.json.get("img")
    try:
        image = image.unsqueeze(0)
        out = model(image)
        _, predicted = torch.max(out, 1)
        prediction = classes[predicted]
        return jsonify({'pred': prediction}), 200
    except:
        return jsonify({'msg': 'something bad happened'}), 500



