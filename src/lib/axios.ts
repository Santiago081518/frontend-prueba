import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      try {
        const parsedStorage = JSON.parse(authStorage);
        const token = parsedStorage.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error al parsear el token de localStorage", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
