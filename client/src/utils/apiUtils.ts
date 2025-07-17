/* eslint-disable  @typescript-eslint/no-explicit-any */
import { routes } from "@/data/routes";
import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

// ✅ Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${SERVER_URL}${routes.auth.refreshToken}`,
          {},
          { withCredentials: true },
        );
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// GET
export const getRequest = async <T = any>(url: string, params?: object) => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

// POST
export const postRequest = async <T = any>(
  url: string,
  data: object | FormData,
  isFormData = false,
) => {
  const response = await api.post<T>(url, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

// PUT
export const putRequest = async <T = any>(
  url: string,
  data: object | FormData,
  isFormData = false,
) => {
  const response = await api.put<T>(url, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

// DELETE
export const deleteRequest = async <T = any>(url: string) => {
  const response = await api.delete<T>(url);
  return response.data;
};

export default api;
