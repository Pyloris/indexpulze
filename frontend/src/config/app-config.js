const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.API_URL ||
  'http://localhost:8088';

const apiUrl = (/^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `http://${rawApiUrl}`).replace(/\/+$/, '');
const wsUrl = apiUrl.replace(/^http(s?):\/\//i, 'ws$1://');

export const appConfig = {
  API_URL: apiUrl,
  BASE_URL: `${apiUrl}/api/v1`,
  WS_URL: `${wsUrl}/ws`,
};
