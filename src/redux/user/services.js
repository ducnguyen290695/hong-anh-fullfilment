import Api from 'utils/api';
import API_URL from 'config/apiUrls';

export const createUser = (payload) => {
  return Api.post({
    url: API_URL.USER,
    payload,
  });
};

export const fetchUser = (params) => {
  return Api.get({
    url: API_URL.USER,
    params,
  });
};

export const getUser = ({ id }) => {
  return Api.get({
    url: `${API_URL.USER}/${id}`,
  });
};

export const updateUser = (payload) => {
  const { id } = payload?.user;
  return Api.patch({
    url: `${API_URL.USER}/${id}`,
    payload,
  });
};

export const updateUserStatus = (payload) => {
  const { id, status } = payload;
  return Api.patch({
    url: `${API_URL.USER}/${id}/status`,
    payload: {
      status,
    },
  });
};
