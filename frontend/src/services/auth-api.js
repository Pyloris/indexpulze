import { baseApi } from './base-api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials, // { username, password }
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData, // { username, email, password, full_name, profile_picture }
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
