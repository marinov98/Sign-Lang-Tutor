import numpy as np
import torch
import os
from pytorch2keras import pytorch_to_keras
from sign_language_model import MODEL_TYPES, select_model
from tensorflow.python.framework.graph_util import convert_variables_to_constants
from keras import backend as K
import tensorflow as tf
import argparse


def freeze_session(session, keep_var_names=None, output_names=None, clear_devices=True):
    """
    Freezes the state of a session into a pruned computation graph.

    Creates a new computation graph where variable nodes are replaced by
    constants taking their current value in the session. The new graph will be
    pruned so subgraphs that are not necessary to compute the requested
    outputs are removed.
    @param session The TensorFlow session to be frozen.
    @param keep_var_names A list of variable names that should not be frozen,
                          or None to freeze all the variables in the graph.
    @param output_names Names of the relevant graph outputs.
    @param clear_devices Remove the device directives from the graph for better portability.
    @return The frozen graph definition.
    """
    
    graph = session.graph
    with graph.as_default():
        freeze_var_names = \
            list(set(v.op.name for v in tf.global_variables()).difference(keep_var_names or []))
        output_names = output_names or []
        output_names += [v.op.name for v in tf.global_variables()]
        input_graph_def = graph.as_graph_def()
        if clear_devices:
            for node in input_graph_def.node:
                node.device = ""
        frozen_graph = convert_variables_to_constants(session, input_graph_def,
                                                      output_names, freeze_var_names)
        return frozen_graph

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
      "model-path",
      type=str,
      help="path to pretrained model to load. folder must contain final_model.pth.tar"
    )

    parser.add_argument(
          "model-type",
          type=str,
          help="type of model to train or test",
          choices=MODEL_TYPES,
          default="alexnet"
    )

    parser.add_argument(
      "num-classes",
      type=int,
      help="number of classes in the model",
      default=24
    )

    parser.add_argument(
      "output-path",
      type=str,
      help="output path"
    )

    args = parser.parse_args()

    MODEL_PATH  = args.model_path
    MODEL_TYPE  = args.model_type
    NUM_CLASSES = args.num_classes
    OUTPUT_PATH = args.output_path

    model = select_model(MODEL_TYPE, NUM_CLASSES)
    model.load_state_dict(torch.load(os.path.join(MODEL_PATH, "final_model.pth.tar")))

    input_np = np.random.uniform(0, 1, (1, 3, 224, 224))
    input_var = torch.Variable(torch.FloatTensor(input_np))
    # we should specify shape of the input tensor
    k_model = pytorch_to_keras(model, input_var, [(3, 224, 224,)], verbose=True, names='short')
    frozen_graph = freeze_session(K.get_session(), output_names=[out.op.name for out in k_model.outputs]) 

    tf.train.write_graph(frozen_graph, ".", OUTPUT_PATH, as_text=False)
    print([i for i in k_model.outputs])


if __name__ == "__main__":
    main()