import axios from 'axios';

// True when an error is an axios error whose response was 404 Not Found.
export const isNotFoundError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;
