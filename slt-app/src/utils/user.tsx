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

export const updateUser = async (userId: string, payload: any) => {
  try {
    await axios.patch(`/api/users/update?id=${userId}`, payload);
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};

export const removeUser = async () => {
  try {
    await axios.delete(`api/auth/delete`);
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};
