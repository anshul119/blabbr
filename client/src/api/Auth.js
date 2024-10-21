import axios from 'axios';
import { store } from '../store/store';

const ApiCleint = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/`,
});

// Add a request interceptor
ApiCleint.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Get token from Redux store
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
ApiCleint.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      store.dispatch({ type: 'auth/logout' }); // Dispatch logout action
      // Redirect to login page
      window.location.href = '/login'; // Use window.location for navigation outside of React components
    }
    return Promise.reject(error);
  }
);

export default ApiCleint;
