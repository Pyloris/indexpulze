import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appConfig } from '../config/app-config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: appConfig.BASE_URL,
    prepareHeaders: (headers) => {
      // In a real application, you might get the token from your auth state instead
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
