import axios from "axios";

const API_BASE_URL =
  "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔐 send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REFRESH TOKEN HANDLING
========================= */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
};

/* =========================
   RESPONSE INTERCEPTOR
========================= */

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // if unauthorized & not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh already in progress, queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // 🔄 Refresh token
        await axios.post(
          `${API_BASE_URL}/Auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return apiClient(originalRequest); // retry original

      } catch (refreshError) {
        processQueue(refreshError);

        // ❌ Refresh failed → force logout
        window.location.href = "/authentication/login";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
