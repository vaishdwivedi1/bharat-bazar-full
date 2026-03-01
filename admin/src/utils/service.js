import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

export const GETMethod = async (url, config = {}) => {
  const res = await api.get(url, config);
  return res.data;
};

export const POSTMethod = async (url, data = {}, config = {}) => {
  const res = await api.post(url, data, config);
  return res.data;
};

export const PUTMethod = async (url, data = {}, config = {}) => {
  const res = await api.put(url, data, config);
  return res.data;
};

export const PATCHMethod = async (url, data = {}, config = {}) => {
  const res = await api.patch(url, data, config);
  return res.data;
};

export const DELETEMethod = async (url, config = {}) => {
  const res = await api.delete(url, config);
  return res.data;
};
