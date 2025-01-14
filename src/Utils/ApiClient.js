import axios from 'axios';

const api_client = axios.create({
    baseURL: "https://blogcove.onrender.com/api",
    withCredentials: true // Include cookies with requests
});

export default api_client;