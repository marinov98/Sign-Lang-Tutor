import axios from 'axios';
import { load } from "handtrackjs";

export async function analyze(imageSrc: any): Promise<any> {
  try {
    const res = await axios.post('/api/analysis/analyze', { img: imageSrc });
    if (res) {
      return res.data;
    }
    return null;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
}

export async function handDetect(imageSrc: any): Promise<any> {
  try {
    const model = await load({ scoreThreshold: 0.46 })
    const predictions = await model.detect(imageSrc);
    let hand = false;
    for (const prediction of predictions) {
      if (prediction.label !== "face") {
        hand = true
        break
      }
    }
    
    return hand
  }
  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
}

export async function getTensorFlowModel(): Promise<any> {
  try {
    return await axios('api/analysis/model/tfjs_model/model.json')
  }
  catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
}