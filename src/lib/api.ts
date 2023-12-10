import axios, { AxiosInstance } from 'axios';
import { getBaseUrl } from '@/helpers/utils';

const baseApiInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

baseApiInstance.interceptors.response.use(
  (response) => {
    return response.data.results || response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const rawgApiInstance: AxiosInstance = axios.create({
  ...baseApiInstance.defaults,
  baseURL: process.env.NEXT_PUBLIC_RAWG_URL,
  params: { key: process.env.NEXT_PUBLIC_API_KEY },
});

rawgApiInstance.interceptors.response.use(
  (response) => {
    return response.data.results || response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const serverApi = baseApiInstance;

export const rawgApi = rawgApiInstance;
