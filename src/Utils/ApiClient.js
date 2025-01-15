import axios from 'axios';

const api_client = axios.create({
    baseURL: "https://blogcove.onrender.com/api",
    // baseURL: "http://localhost:8080/api",
    withCredentials: true // Include cookies with requests
});

export default api_client;