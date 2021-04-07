import axios from 'axios';

export async function analyze(imageSrc: any): Promise<any> {
  try {
    const res = await axios.post('/api/analysis/analyze');
    if (res) {
      return res;
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
