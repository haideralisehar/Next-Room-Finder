// import axios from 'axios';
// import Cookies from 'js-cookie';

// class ApiClient {
//   constructor() {
//     this.baseURL = 'https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/';
//     this.isRefreshing = false;
//     this.failedQueue = [];
    
//     this.axiosInstance = axios.create({
//       baseURL: this.baseURL,
//       timeout: 60000,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       withCredentials: true,
//     });
    
//     this.setupInterceptors();
//   }
  
//   setupInterceptors = () => {
//     // Request interceptor
//     this.axiosInstance.interceptors.request.use(
//       (config) => {
//         const token = this.getToken();
//         if (token && config.headers) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );
    
//     // Response interceptor
//     this.axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
        
//         // Check if error is 401 and not already retrying
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           if (this.isRefreshing) {
//             // Return a promise that will resolve when the token is refreshed
//             return new Promise((resolve, reject) => {
//               this.failedQueue.push({ resolve, reject });
//             })
//               .then((token) => {
//                 originalRequest.headers.Authorization = `Bearer ${token}`;
//                 return this.axiosInstance(originalRequest);
//               })
//               .catch((err) => {
//                 return Promise.reject(err);
//               });
//           }
          
//           originalRequest._retry = true;
//           this.isRefreshing = true;
          
//           try {
//             const newToken = await this.refreshToken();
//             this.setToken(newToken);
            
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
//             // Process all queued requests with new token
//             this.failedQueue.forEach((request) => request.resolve(newToken));
//             this.failedQueue = [];
            
//             return this.axiosInstance(originalRequest);
//           } catch (refreshError) {
//             this.failedQueue.forEach((request) => request.reject(refreshError));
//             this.failedQueue = [];
            
//             // Clear auth data on refresh failure
//             this.clearAuthData();
            
//             // Redirect to login if not already there
//             if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//               window.location.href = '/login';
//             }
            
//             return Promise.reject(refreshError);
//           } finally {
//             this.isRefreshing = false;
//           }
//         }
        
//         // Handle 404 errors gracefully
//         if (error.response?.status === 404) {
//           console.warn('API endpoint not found:', originalRequest.url);
//           return Promise.reject({
//             ...error,
//             isEndpointMissing: true,
//             message: `Endpoint not found: ${originalRequest.url}`
//           });
//         }
        
//         // Handle network errors
//         if (!error.response) {
//           console.error('Network error:', error.message);
//           return Promise.reject({
//             ...error,
//             isNetworkError: true,
//             message: 'Network error. Please check your connection.'
//           });
//         }
        
//         return Promise.reject(error);
//       }
//     );
//   }
  
//   refreshToken = async () => {
//     try {
//       const response = await fetch(`${this.baseURL}api/Auth/refresh`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`Refresh failed with status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       const token = data.token || data.Token;
      
//       if (!token) {
//         throw new Error('No token in refresh response');
//       }
      
//       return token;
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//       throw error;
//     }
//   }
  
//   // Token management
//   getToken = () => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
//     }
//     return null;
//   }
  
//   setToken = (token) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('authToken', token);
//       sessionStorage.setItem('authToken', token);
//     }
//   }
  
//   clearAuthData = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('authToken');
//       sessionStorage.removeItem('authToken');
//       localStorage.removeItem('userData');
//       sessionStorage.removeItem('userData');
//       Cookies.remove('session');
//     }
//   }
  
//   // API methods
//   get = async (url, config = {}) => {
//     return this.axiosInstance.get(url, config);
//   }
  
//   post = async (url, data = {}, config = {}) => {
//     return this.axiosInstance.post(url, data, config);
//   }
  
//   put = async (url, data = {}, config = {}) => {
//     return this.axiosInstance.put(url, data, config);
//   }
  
//   delete = async (url, config = {}) => {
//     return this.axiosInstance.delete(url, config);
//   }
  
//   // Check authentication status
//   isAuthenticated = () => {
//     return !!this.getToken();
//   }
  
//   // Login method
//   login = async (username, password) => {
//     return this.post('api/Auth/login', { username, password });
//   }
  
//   // Logout method
//   logout = async () => {
//     try {
//       await this.post('api/Auth/logout', {});
//     } catch (error) {
//       // Ignore if logout endpoint doesn't exist
//     }
//     this.clearAuthData();
//   }
// }

// export const apiClient = new ApiClient();

import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This sends cookies automatically
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie (not from local storage)
    const token = Cookies.get('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    })
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status
    })
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.log('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      console.log('Token expired, attempting refresh...')
      
      try {
        // Try to refresh token directly with backend
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/Auth/refresh`,
          {
            method: 'POST',
            credentials: 'include', // This sends the HttpOnly refresh token cookie
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        
        console.log('Refresh response status:', refreshResponse.status)
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          const newToken = data.token || data.Token
          
          console.log('New token received:', newToken ? 'Yes' : 'No')
          
          if (newToken) {
            // Store new access token
            Cookies.set('auth_token', newToken, {
              expires: 1,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            
            // Retry the original request
            return apiClient(originalRequest)
          }
        } else {
          console.error('Refresh failed with status:', refreshResponse.status)
          const errorText = await refreshResponse.text()
          console.error('Refresh error response:', errorText)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
      
      // If refresh failed, clear auth data and redirect
      Cookies.remove('auth_token')
      Cookies.remove('user_data')
      
      // Only redirect if we're in browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired'
      }
    }
    
    return Promise.reject(error)
  }
)

// Helper methods
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
}

export default apiClient