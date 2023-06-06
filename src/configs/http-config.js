import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://ws.detectlanguage.com/0.2",
});

// console.log(import.meta.env.VITE_API_KEY);

AxiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
AxiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default AxiosInstance;
