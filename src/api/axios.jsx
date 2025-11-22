import axios from "axios";

const api = axios.create({
    baseURL: "https://oqa.onrender.com/api"
});
export default api;
