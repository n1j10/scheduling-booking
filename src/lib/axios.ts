import axios from 'axios';

type TokenGetter = () => Promise<string | null>;

// Clerk's getToken() is only available inside React (useAuth),
// so AuthTokenSync gives it to us here.
let getToken: TokenGetter | null = null;

export function setTokenGetter(fn: TokenGetter | null) {
  getToken = fn;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
});

// Attach "Authorization: Bearer <token>" to every request when logged in
api.interceptors.request.use(async (config) => {
  if (getToken) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Turn any error into a message we can show in the UI
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}
