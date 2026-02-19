import axios from 'axios';
import { API_BASE_URL } from './constants';

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login if not already there
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
