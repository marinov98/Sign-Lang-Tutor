import torch
import numpy as np
import json
import os

from flask import Blueprint, request, jsonify, send_file, abort
from flask_jwt_extended import jwt_required
from torchvision import transforms
from config.keys import ml

if ml:
    from config.keys import model, device
else:
    model = None

from PIL import Image
import base64
from io import BytesIO
import random

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
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]
    if ml:
        if not request.data:
            return jsonify({"msg": "No data found in request!"}), 409
        # define classes
        try:
            # decode image from frontend
            url = request.json.get("img")
            base_str = url.replace("data:image/jpeg;base64,", "")
            decoded_img = base64.b64decode(base_str)
            image = Image.open(BytesIO(decoded_img))

            transform = transforms.Compose(
                [
                    transforms.ToTensor(),
                    transforms.Normalize(
                        mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225],
                    ),
                ]
            )
            img = transform(image)
            print(img[0, 0, 0])
            img.unsqueeze_(0)
            img = img.to(device)

            out = model(img)
            print(out)
            confidence, predicted = torch.max(out, 1)
            prediction = classes[predicted]
            print(confidence.item())
            return (
                jsonify(
                    {"pred": prediction, "confidence": round(random.uniform(0, 1), 4)}
                ),
                200,
            )
        except Exception as e:
            print(e)
            return jsonify({"msg": "something bad happened"}), 500
    else:
        pred = random.randint(0, 24)
        return (
            jsonify(
                {"pred": classes[pred], "confidence": round(random.uniform(0, 1), 4)}
            ),
            200,
        )

# api/analysis/model/<folder>/<file>
@analysis.route("/model/<folder>/<file>", methods=["GET"])
def serve_model(folder="tfjs_model", file="model.json"):
    try:
        path = os.path.realpath(os.path.join("../ml-model", folder, file))
        if file == "model.json":
            with open(path, 'r') as f:
                j = json.load(f)
            return json.dumps(j), 200
        else:
            return send_file(path, as_attachment=True)
    except FileNotFoundError:
        abort(404)


  
