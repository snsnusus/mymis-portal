import axios, { isAxiosError } from 'axios';

// True when an error is an axios error whose response was 404 Not Found.
export const isNotFoundError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;

interface ApiErrorBody {
  message?: string;
  title?: string;
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.message ?? error.response?.data?.title ?? fallback
    );
  }
  return fallback;
};
