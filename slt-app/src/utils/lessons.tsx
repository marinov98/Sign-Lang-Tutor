import axios from 'axios';
import { createNoSubstitutionTemplateLiteral } from 'typescript';

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

export const updateLesson = async (lessonId: string, payload: any) => {
  try {
    await axios.patch(`/api/lessons/update/${lessonId}`, payload);
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};

export const resetProgress = async () => {
  try {
    await axios.put('/api/lessons/reset');
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};
