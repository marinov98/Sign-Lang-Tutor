import axios from 'axios';

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
