import axios from 'axios';

export const getUserInfo = async (): Promise<any> => {
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

export const updateUser = async (
  userId: string,
  payload: any
): Promise<void> => {
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

export const removeUser = async (
  deleteLesson: Boolean = false
): Promise<void> => {
  try {
    await axios.delete(`api/auth/delete`, { data: { deleteLesson } });
  } catch (err) {
    if (err.response) {
      return err.response.data;
    } else {
      console.error(err);
    }
  }
};

export const getUser = async (userID: string) => {
  try {
    const url = `/api/users/single?id=${userID}`;
    const { data } = await axios.get(url);
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
