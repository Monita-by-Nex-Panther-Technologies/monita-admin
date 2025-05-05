'use client';

import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import {rootUrl, base_endpoint } from '@/constants/string';
import { getAccessToken, removeAccessToken, setAccessToken } from './tokenHelpers';



// --- Axios Instances ---
const axiosInstance: AxiosInstance = axios.create({
  baseURL: rootUrl,
  headers: {
    Accept: 'application/json',
    channel: 'ADMIN PANEL',
  },
});

const axiosFormDataInstance: AxiosInstance = axios.create({
  baseURL: rootUrl,
  headers: {
    Accept: 'application/json',
    channel: 'ADMIN PANEL',
    'Content-Type': 'multipart/form-data',
  },
});

// --- Interceptors ---
const addAuthInterceptor = (instance: AxiosInstance) => {
 
instance.interceptors.request.use(async (req) => {

  try {
  const token = getAccessToken();
  if (!token?.refresh_token) return req;

  const decoded = jwtDecode<{ exp: number }>(token.access_token);
  
  const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token.access_token}`;
    return req;
  }
    const response = await axios.post(`${rootUrl}${base_endpoint}/refresh-token/`, {
      token: token.refresh_token,
    });
    const newToken = response.data;
    setAccessToken(newToken);
    req.headers.Authorization = `Bearer ${newToken.access_token}`;
  } catch (err) {
    
    removeAccessToken();
    window.location.pathname = "/signin";
  }

  return req;
});


  instance.interceptors.response.use(
    (response) => {
      if (response?.data?.data) {
        response.data = response.data.data;
      }
      return response;
    },
    (error) => {
      if (error?.response?.status === 401 && error?.response?.data?.message !== 'Permission Denied') {
        removeAccessToken();
        window.location.pathname = "/signin";
      }

      if (error?.response?.data?.data) {
        error.response.data = error.response.data.data;
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors
addAuthInterceptor(axiosInstance);
addAuthInterceptor(axiosFormDataInstance);

// --- Exports ---
export default axiosInstance;
export const axiosForm_DataInstance = axiosFormDataInstance;
export const baseUrl = rootUrl;
