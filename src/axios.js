import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://dev.moydomonline.ru/api/',
});




axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); 


  if (token) {
    config.headers.Authorization = `Token ${token}`; 
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
