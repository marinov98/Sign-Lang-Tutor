import axios from 'axios';

export const getUserInfo = async () => {
  try {
    const { data } = await axios.get('/api/auth/user');
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};
