import axios from 'axios';

export const getReviews = async () => {
  try {
    const url: string = 'api/reviews/get/50';
    const { data } = await axios.get(url);
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.log(err);
    }
  }
};

export const createReview = async (review: any): Promise<any> => {
  try {
    const url: string = '/api/reviews/create';
    const { data } = await axios.post(url, review);
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    }
    console.error(err);
  }
};

export const deleteReview = async (_id: any): Promise<any> => {
  try {
    const { data } = await axios.delete('api/reviews/delete', {
      data: { _id }
    });
    console.log(data);
  } catch (err) {
    if (err.response) {
      return err.response.error;
    }
    console.log(err);
  }
};
