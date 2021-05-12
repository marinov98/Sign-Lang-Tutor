import * as tf from '@tensorflow/tfjs';
import { Tensor1D } from '@tensorflow/tfjs';

import { MODEL_CLASSES } from './MODEL_CLASSES';


export default class MobileNet {
  private MODEL_URL: string ='http://127.0.0.1:5000/api/analysis/model/';
  private MODEL_DIR: string = "tfjs_model"
  private MODEL_FILE_URL: string = 'model.json';
  private INPUT_NODE_NAME: string = 'input_0';
  private OUTPUT_NODE_NAME: string = 'output_0';
  private IMAGENET_MEAN: Tensor1D = tf.tensor1d([0.485, 0.456, 0.406])
  private IMAGENET_STD: Tensor1D = tf.tensor1d([0.229, 0.224, 0.225])
  private MODEL_CLASSES: any = MODEL_CLASSES
  private model: any;

  constructor(modelDir: string = 'tfjs_model', modelFile: string = 'model.json') {
    this.MODEL_DIR = modelDir;
    this.MODEL_FILE_URL = modelFile;
  }

  public async load(): Promise<void> {
    this.model = await tf.loadGraphModel(
        this.MODEL_URL + this.MODEL_DIR + "/" + this.MODEL_FILE_URL);
  }

  public dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
  }
  
  // convert image 
  public normalize(input: any, mean: Tensor1D, std: Tensor1D): any {
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

  public async predict(input: any): Promise<any> {
    const preprocessedInput = tf.transpose(
      this.normalize(input, this.IMAGENET_MEAN, this.IMAGENET_STD),[2,0,1]
      );

    const reshapedInput = preprocessedInput.expandDims(0);

    return await this.model.executeAsync(reshapedInput)
    // {[this.INPUT_NODE_NAME]: reshapedInput}, this.OUTPUT_NODE_NAME);
  }

  public getTopKClasses(logits: any, topK: number): any[] {
    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList: any[] = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
                         .sort((a, b) => {
                           return b.value - a.value;
                         })
                         .slice(0, topK);

    return predictionList.map(x => {
      return {label: this.MODEL_CLASSES[x.index], value: x.value};
    });
  }
}