import axios from 'axios';
import { TOKEN } from 'config/constants';

const axiosInstance = axios.create({});

axiosInstance.interceptors.response
  .use
  // (response) => response,
  // (error) => {
  //   const { status } = error.response;
  //   if (status === 401) {
  //     localStorage.removeItem(TOKEN);
  //     window.location.href = "/login";
  //   }
  //   return Promise.reject(error.response);
  // }
  ();

export default axiosInstance;
