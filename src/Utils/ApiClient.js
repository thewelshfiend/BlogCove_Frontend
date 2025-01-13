import axios from 'axios';

const api_client = axios.create({
    // baseURL: process.env.API_URL || 'http://localhost:8080',
    baseURL: 'https://blogcove-backend.onrender.com',
    withCredentials: true // Include cookies with requests
});


export default api_client;