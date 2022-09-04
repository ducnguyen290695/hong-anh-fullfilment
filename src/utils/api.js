import axios from './axios';
import { BASE_URL } from 'config/apiUrls';
import { TOKEN } from 'config/constants';

const getHeaders = () => {
  const token = localStorage.getItem(TOKEN);
  if (token) {
    return {
      Accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    Accept: 'application/json',
    'content-type': 'application/json',
  };
};

function getApi({ url, ...options }) {
  return axios({
    method: 'GET',
    url: url,
    baseURL: BASE_URL,
    headers: { ...getHeaders() },
    ...options,
  });
}

function postApi({ url, payload, ...options }) {
  return axios({
    method: 'POST',
    url: url,
    baseURL: BASE_URL,
    data: payload,
    headers: { ...getHeaders() },
    ...options,
  });
}

function postApiUpload({ url, payload, ...options }) {
  return axios({
    method: 'POST',
    url: url,
    baseURL: BASE_URL,
    data: payload,
    headers: { ...getHeaders(), 'content-type': 'multipart/form-data' },
    ...options,
  });
}

function putApi({ url, payload, ...options }) {
  return axios({
    method: 'PUT',
    url: url,
    baseURL: BASE_URL,
    data: payload,
    headers: { ...getHeaders() },
    ...options,
  });
}

function patchApi({ url, payload, ...options }) {
  return axios({
    method: 'PATCH',
    url: url,
    baseURL: BASE_URL,
    data: payload,
    headers: { ...getHeaders() },
    ...options,
  });
}

function deleteApi({ url, ...options }) {
  return axios({
    method: 'DELETE',
    url: url,
    baseURL: BASE_URL,
    headers: { ...getHeaders() },
    ...options,
  });
}

const Api = {
  get: getApi,
  post: postApi,
  postUpload: postApiUpload,
  put: putApi,
  delete: deleteApi,
  patch: patchApi,
};

export { getHeaders };
export default Api;
