import axios from 'axios';

const api_client = axios.create({
    // baseURL: process.env.API_URL || 'http://localhost:8080',
    baseURL: 'http://localhost:8080',
    withCredentials: true // Include cookies with requests
});


export default api_client;