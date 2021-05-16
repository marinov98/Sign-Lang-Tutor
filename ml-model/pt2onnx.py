import numpy as np
import torch
import torch.onnx
from sign_language_model import MODEL_TYPES, select_model
import argparse
import os
import onnx
from  onnx_tf.backend import prepare


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument(
      "model_path",
      type=str,
      help="path to pretrained model to load. folder must contain final_model.pth.tar",
  )

  parser.add_argument(
      "model_type",
      type=str,
      help="type of model to train or test",
      choices=MODEL_TYPES,
      default="alexnet",
  )

  parser.add_argument(
      "num_classes", type=int, help="number of classes in the model", default=24
  )

  parser.add_argument("output_path", type=str, help="path to directory to save onnx and tensorflow model")


  parser.add_argument(
    "tf_output_dir",
    type=str,
    help="name of file to save as. defaults to model.onnx",
  )

  parser.add_argument(
    "--onnx_filename",
    type=str,
    help="name of file to save as. defaults to model.onnx",
    default="model.onnx"
  )

  

  args = parser.parse_args()

  MODEL_PATH = os.path.abspath(args.model_path)
  MODEL_TYPE = args.model_type
  NUM_CLASSES = args.num_classes
  OUTPUT_PATH = os.path.abspath(args.output_path)
  OUTPUT_FILENAME = args.onnx_filename
  TF_OUTPUT_DIR = os.path.abspath(args.tf_output_dir)
  FULL_ONNX_OUTPUT_PATH = os.path.join(OUTPUT_PATH,OUTPUT_FILENAME)
  BATCH_SIZE = 1 # random value

  pytorch_model = select_model(MODEL_TYPE, NUM_CLASSES)
  pytorch_model.load_state_dict(torch.load(os.path.join(MODEL_PATH, "final_model.pth.tar"),map_location=torch.device('cpu')))
  pytorch_model.eval()
  # print(pytorch_model)

  #value doesn't matter, shape does
  dummy_input = torch.randn(BATCH_SIZE, 3, 224, 224, requires_grad=True)
  input_names = ["image"]
  output_names = ["logits"]

  print(f"exporting onnx file to {FULL_ONNX_OUTPUT_PATH} ...")
  torch.onnx.export(pytorch_model, 
                    dummy_input, 
                    FULL_ONNX_OUTPUT_PATH, 
                    export_params=True,
                    opset_version=11,
                    do_constant_folding=False,
                    input_names=input_names,
                    output_names=output_names
                    )
  print("done")

  # check that the model is well formed
  print("Checking if onnx model is valid...")
  onnx_model = onnx.load(FULL_ONNX_OUTPUT_PATH)
  try:
    onnx.checker.check_model(onnx_model)
  except onnx.checker.ValidationError as e:
    print('The model is invalid: %s' % e)
  else:
      print('The model is valid!')
  
  # convert to tensorflow model
  print("converting to tensorflow model...")
  tf_model = prepare(onnx_model)
  print(f"saving tf model to {TF_OUTPUT_DIR}")
  tf_model.export_graph(TF_OUTPUT_DIR)
  print("done")


  



if __name__ == "__main__":
  # example command 
  # python pt2onnx.py {path/to/model/weights} {model_type} {num_classes} {output_path} {tf_output_dir}
  main()