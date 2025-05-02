"use client";
import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { appname, rootUrl, base_endpoint  } from "@/constants/string";
import { toast } from "sonner";


export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${appname}-authdata`, token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${appname}-authdata`);
  }
};

const getAccessToken = (): {
  access_token: string;
  refresh_token: string;
} | null =>
  localStorage.getItem(`${appname}-authdata`)
    ? JSON.parse(localStorage.getItem(`${appname}-authdata`)!)
    : null;

export const token = getAccessToken();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: rootUrl,
  headers: token
    ? {
        Accept: "application/json",
        channel: "ADMIN PANEL",
        Authorization: `Bearer ${token?.access_token}`,
      }
    : { Accept: "application/json" },
});

const axiosFormDataInstance: AxiosInstance = axios.create({
  baseURL: rootUrl,
  headers: {
    Accept: "application/json",
    channel: "ADMIN PANEL",
    Authorization: `Bearer ${token?.access_token}`,
    "Content-Type": "multipart/form-data",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  const token = getAccessToken();
  if (req?.data) req.data = req.data;

  if (!token?.access_token) return req;

  const user = jwtDecode<{ exp: number }>(token?.access_token);

  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token?.access_token}`;
    return req;
  }
  const response = await axios.post(
    `${rootUrl}${base_endpoint}/refresh-token/`,
    {
      token: token?.refresh_token,
    }
  );
  if (response) {
    const respdata = response.data.data;
    localStorage.setItem(`${appname}-authdata`, JSON.stringify(respdata));
    req.headers.Authorization = `Bearer ${respdata.access_token}`;
    return req;
  } else {
    removeAccessToken();
    return req;
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data) {
      if (response?.data?.data) {
        // response.data = JSON.parse(decryptPayload(response.data.data));
        response.data = response.data.data;
      }
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      if(error?.response?.data.message != 'Permission Denied'){
        // toast.error(error?.response.message);
        removeAccessToken();
      }
      return Promise.reject(error);
    }

    if (error?.response) {
      if (error.response?.data?.data) {
        // error.response.data = JSON.parse(decryptPayload(error.response.data.data));

        error.response.data = error.response.data.data;
      }
    }
    return Promise.reject(error);
  }
);

axiosFormDataInstance.interceptors.request.use(async (req) => {
  const token = getAccessToken();
  if (!token?.access_token) return req;

  const user = jwtDecode<{ exp: number }>(token?.access_token);

  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token?.access_token}`;
    return req;
  }
  // const response = await axios.post(`${rootUrl}${ums_endpoint}/refresh-token`, encryptPayload({
  //   refresh: token?.refresh_token,
  // }));

  const response = await axios.post(`${rootUrl}${base_endpoint}/refresh-token`, {
    token: token?.refresh_token,
  });

  // const respdata = JSON.parse(decryptPayload(response.data.data));

  const respdata = response.data.data;

  localStorage.setItem(`${appname}-authdata`, JSON.stringify(respdata));

  req.headers.Authorization = `Bearer ${respdata.access_token}`;
  return req;
});

axiosFormDataInstance.interceptors.response.use(
  (response) => {
    if (response?.data) {
      if (response?.data?.data) {
        // response.data = JSON.parse(decryptPayload(response.data.data));

        response.data = response.data.data;
      }
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      // toast.error(error?.response.message);
      removeAccessToken();
      return Promise.reject(error);
    }

    if (error?.response) {
      if (error.response?.data?.data) {
        // error.response.data = JSON.parse(decryptPayload(error.response.data.data));
        error.response.data = error.response.data.data;
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export const axiosForm_DataInstance = axiosFormDataInstance;
export const baseUrl = rootUrl;
