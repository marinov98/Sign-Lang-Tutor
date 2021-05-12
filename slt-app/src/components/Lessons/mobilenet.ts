import * as tf from '@tensorflow/tfjs';

import { MODEL_CLASSES } from './MODEL_CLASSES';

const MODEL_DIR ='http://127.0.0.1:5000/api/analysis/model';
const MODEL_FILE_URL = 'model.json';
const INPUT_NODE_NAME = 'input_0';
const OUTPUT_NODE_NAME = 'output_0';
const IMAGENET_MEAN = tf.tensor1d([0.485, 0.456, 0.406])
const IMAGENET_STD = tf.tensor1d([0.229, 0.224, 0.225])

export class MobileNet {
  constructor() {}

  async load() {
    this.model = await tf.loadGraphModel(
        MODEL_DIR + MODEL_FILE_URL);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
  
  // convert image 
  normalize(input, mean, std) {
    return tf.cast(input,'float32').div(255.0).sub(mean).div(std)
  }

  /**
   * Infer through MobileNet. This does standard ImageNet pre-processing before
   * inferring through the model. This method returns named activations as well
   * as softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The softmax logits.
   */

  predict(input) {
    const preprocessedInput = tf.transpose(
      this.normalize(input, IMAGENET_MEAN, IMAGENET_STD),[2,0,1]);
    const reshapedInput =
        preprocessedInput.reshape([1, ...preprocessedInput.shape]);
    return this.model.execute(
        {[INPUT_NODE_NAME]: reshapedInput}, OUTPUT_NODE_NAME);
  }

  getTopKClasses(logits, topK) {
    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
                         .sort((a, b) => {
                           return b.value - a.value;
                         })
                         .slice(0, topK);

    return predictionList.map(x => {
      return {label: MODEL_CLASSES[x.index], value: x.value};
    });
  }
}