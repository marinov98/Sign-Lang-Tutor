import torch
import numpy as np

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config.keys import model, device
from PIL import Image
import base64
from io import BytesIO

analysis = Blueprint("analysis", __name__)


def pil_to_tensor(pic):
    # handle PIL Image
    img = torch.as_tensor(np.asarray(pic, dtype=np.float32).copy())
    img = img.view(pic.size[1], pic.size[0], len(pic.getbands()))
    # put it from HWC to CHW format
    img = img.permute((2, 0, 1))
    return img


# /api/analysis/analyze
@analysis.route("/analyze", methods=["POST"])
# @jwt_required()
def infer():
    if not request.data:
        return jsonify({"msg": "No data found in request!"}), 409
    # define classes
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]
    try:
        # decode image from frontend
        url = request.json.get("img")
        base_str = url.replace("data:image/jpeg;base64,", "")
        decoded_img = base64.b64decode(base_str)
        image = Image.open(BytesIO(decoded_img))

        # use ml model to predict
        img = torch.as_tensor(np.asarray(image))
        img = img.permute((2, 0, 1))
        img.unsqueeze_(0)
        img = img.to(device)

        # img = pil_to_tensor(image).unsqueeze(0).to(device)

        out = model(img)
        confidence, predicted = torch.max(out, 1)
        prediction = classes[predicted]
        return jsonify({"pred": prediction, "confidence": confidence.item()}), 200
    except Exception as e:
        print(e)
        return jsonify({"msg": "something bad happened"}), 500
