
import axios, { AxiosError, AxiosResponse } from "axios";

export const SERVER_URL =
  process.env.NODE_ENV==='production'?process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:5000/api";


const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

// Separate axios instance for refresh token requests to avoid interceptor loops
const refreshApi = axios.create({
  baseURL:  SERVER_URL,
  timeout: 10000,
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

// Token management with reactive updates
let accessToken: string | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let previousToken: string | null = null

// Callback registry for token updates
type TokenUpdateCallback = (
  token: string | null,
  previousToken: string | null
) => Promise<void> | void
let tokenUpdateCallbacks: TokenUpdateCallback[] = []

// Register a callback to be called whenever a new access token is set
export const registerTokenUpdateCallback = (callback: TokenUpdateCallback) => {
  tokenUpdateCallbacks.push(callback)

  // Immediately call with current token if it exists
  if (accessToken) {
    try {
      callback(accessToken, null)
    } catch (error) {
      console.error('Error in immediate token callback:', error)
    }
  }

  // Return an unregister function
  return () => {
    tokenUpdateCallbacks = tokenUpdateCallbacks.filter((cb) => cb !== callback)
  }
}

// Internal function to notify callbacks
const notifyTokenUpdate = async (newToken: string | null, oldToken: string | null) => {
  console.log('Notifying token update:', { newToken: !!newToken, oldToken: !!oldToken })

  const promises = tokenUpdateCallbacks.map(async (callback) => {
    try {
      await callback(newToken, oldToken)
    } catch (error) {
      console.error('Error in token update callback:', error)
    }
  })

  await Promise.allSettled(promises)
}

export const clearToken = () => {
  accessToken = null
}

export const setAccessToken = async (token: string) => {
  const oldToken = accessToken

  // Only notify if token actually changed
  if (oldToken !== token) {
    console.log('Access token changed:', { hadToken: !!oldToken, newToken: !!token })
    previousToken = oldToken
    accessToken = token

    // Notify all registered callbacks about the token update
    await notifyTokenUpdate(token, oldToken)
  }
}

export const getAccessToken = () => accessToken

export const clearTokens = async (): Promise<void> => {
  const oldToken = accessToken

  if (oldToken) {
    console.log('Clearing access token')
    previousToken = oldToken
    accessToken = null

    // Notify callbacks about token clearing
    await notifyTokenUpdate(null, oldToken)
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper function to determine if data is FormData or contains files
const isFormData = (data: any): boolean => {
  return data instanceof FormData
}

const containsFiles = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false

  return Object.values(data).some((value) => {
    if (value instanceof File || value instanceof FileList) return true
    if (Array.isArray(value)) {
      return value.some((item) => item instanceof File)
    }
    return false
  })
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Debug logging
    console.log('Request details:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      baseURL: config.baseURL
    })

    const token = getAccessToken()
    console.log('access token is', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Set Content-Type based on payload for POST and PATCH
    if (['post', 'patch', 'put'].includes(config.method?.toLowerCase() || '')) {
      if (isFormData(config.data)) {
        // Let browser set Content-Type with boundary for FormData
        delete config.headers['Content-Type']
      } else if (containsFiles(config.data)) {
        // Convert to FormData and let browser set Content-Type
        const formData = new FormData()
        Object.entries(config.data).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value)
          } else if (value instanceof FileList) {
            Array.from(value).forEach((file, index) => {
              formData.append(`${key}[${index}]`, file)
            })
          } else if (Array.isArray(value) && value.some((item) => item instanceof File)) {
            value.forEach((file, index) => {
              formData.append(`${key}[${index}]`, file)
            })
          } else if (value !== null && value !== undefined) {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
          }
        })
        config.data = formData
        delete config.headers['Content-Type']
      } else {
        // Regular JSON payload
        config.headers['Content-Type'] = 'application/json'
      }
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response interceptor - Success:', response.status, response.config.url)
    return response
  },
  async (error: AxiosError) => {
    console.log('Response interceptor - Error triggered')
    // console.error('ERROR FROM API:', {
    //  error
    // });

    const originalRequest = error.config as any

    // Check if this is a 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log('Attempting token refresh for 401 error')
      originalRequest._retry = true

      try {
        console.log('Making refresh token request...')
        console.log('Refresh API config:', {
          baseURL: refreshApi.defaults.baseURL,
          withCredentials: refreshApi.defaults.withCredentials,
          url: '/auth/refresh-token'
        })

        const refreshResponse = await refreshApi.get( '/auth/refresh-token', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Refresh token response:', {
          status: refreshResponse.status,
          headers: refreshResponse.headers,
          data: refreshResponse.data
        })

        const { data } = refreshResponse

        if (data.accessToken) {
          console.log('New access token received, retrying original request')
          // Use the async setAccessToken which will trigger user fetch
          await setAccessToken(data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        } else {
          console.warn('No access token in refresh response')
          throw new Error('No access token received from refresh endpoint')
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        clearTokens()

        // Optionally redirect to login
        // if (typeof window !== 'undefined') {
        //   console.log('Redirecting to login page');
        //   window.location.href = '/auth/login';
        // }

        return Promise.reject(refreshError)
      }
    }

    // For all other errors or if token refresh failed
    console.log('Rejecting error:', error.response?.status)
    return Promise.reject(error)
  }
)
// GET
export const getRequest = async <T = any>(url: string, params?: object) => {
   try{
  const response = await api.get<T>(url, { params });
  return response.data;
      } catch(error){
    throw error
  }
};

// POST
export const postRequest = async <T = any>(
  url: string,
  data: object | FormData,
  isFormData = false,
) => {
  try{
  const response = await api.post<T>(url, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
      } catch(error){
    throw error
  }
};

// PUT
export const putRequest = async <T = any>(
  url: string,
  data: object | FormData,
  isFormData = false,
) => {
   try{
  const response = await api.put<T>(url, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
      } catch(error){
    throw error
  }
};

// DELETE
export const deleteRequest = async <T = any>(url: string) => {
   try{
  const response = await api.delete<T>(url);
  return response.data;
    } catch(error){
    throw error
  }
};

export default api;
