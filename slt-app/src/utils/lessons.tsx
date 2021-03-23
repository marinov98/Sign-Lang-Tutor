import axios from 'axios';

export const getModules = async () => {
  try {
    const { data } = await axios.get('/api/lessons/modules');
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

export const getLessons = async () => {
  try {
    const { data } = await axios.get('/api/lessons/user/Alphabet');
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
