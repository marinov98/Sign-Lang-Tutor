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

export const getLessons = async (moduleName: string) => {
  try {
    const { data } = await axios.get(`/api/lessons/user/${moduleName}`);
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

export const getLesson = async (lessonId: string) => {
  try {
    const { data } = await axios.get(`/api/lessons/user/single/${lessonId}`);
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
