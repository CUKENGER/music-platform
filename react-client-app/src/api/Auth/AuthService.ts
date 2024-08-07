import { createApi, fetchBaseQuery, FetchBaseQueryError, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../apiUrl";
import { CreateUserDto, LoginUserDto, RegUserResponse } from "@/types/auth";
import Cookies from 'js-cookie';

// Функция базового запроса с расширенной обработкой ошибок
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('jwt');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Расширенный базовый запрос для обработки токенов и ошибок
const enhancedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const message = (result.error as FetchBaseQueryError).status
      ? `Ошибка: ${result.error.status}`
      : 'Ошибка запроса';
    throw new Error(message);
  }
  const response = result.data as RegUserResponse;
  if (response.refreshToken) {
    Cookies.set('jwt', response.refreshToken, { expires: 7 });
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: enhancedBaseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    regUser: builder.mutation<RegUserResponse, CreateUserDto>({
      query: (userDto) => ({
        url: "user",
        method: 'POST',
        body: userDto,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // Пример использования invalidatesTags, если это необходимо
      invalidatesTags: [{ type: 'Auth', id: 'LIST' }],
    }),
    login: builder.mutation<RegUserResponse, LoginUserDto>({
      query: (userDto) => ({
        url: "auth/login",
        method: 'POST',
        body: userDto,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // Пример использования invalidatesTags, если это необходимо
      invalidatesTags: [{ type: 'Auth', id: 'LIST' }],
    }),
    logout: builder.mutation<string, void>({
      query: () => ({
        url: "auth/logout",
        method: 'POST',
      }),
      // Пример использования invalidatesTags, если это необходимо
      invalidatesTags: [{ type: 'Auth', id: 'LIST' }],
    }),
    refreshToken: builder.query<RegUserResponse, void>({
      query: () => ({
        url: "auth/refresh",
        method: 'GET',
      }),
      // Пример использования providesTags, если это необходимо
      providesTags: [{ type: 'Auth', id: 'LIST' }],
    }),
  }),
});

export const {
  useRegUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenQuery,
} = authApi;
