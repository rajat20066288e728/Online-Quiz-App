import axios from "axios";

const api = axios.create({
    baseURL: "https://oqa.onrender.com", 
});

export default api;
