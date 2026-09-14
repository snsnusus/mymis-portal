import type { AxiosRequestConfig, AxiosInstance } from 'axios';

import axios from 'axios';

export const createAxiosInstance = (
  config: AxiosRequestConfig
): AxiosInstance => axios.create(config);
