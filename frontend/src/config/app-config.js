export const appConfig = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api/v1',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8088/ws',
};
