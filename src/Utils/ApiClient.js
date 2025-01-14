import axios from 'axios';

const api_client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true // Include cookies with requests
});

export default api_client;