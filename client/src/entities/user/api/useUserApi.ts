import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkUsername, getByEmail, loginUser, logoutUser, refreshToken, regUser } from "./userApi";
import { CreateUserDto, RegUserResponse } from "../types/User";
import { handleErrorHandler } from "@/shared";

const invalidateUserQuery = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: ['user'],
    exact: true,
  });
};

const handleError = (error: unknown, context: string) => {
  if (error instanceof Error) {
    console.error(`Error ${context}:`, error.message);
  } else {
    console.error(`Unknown error ${context}:`, error);
  }
};

export const useRegUser = () => {
  const queryClient = useQueryClient();

  return useMutation<RegUserResponse, unknown, CreateUserDto>({
    mutationFn: regUser,
    onSuccess: (data) => {
      console.log('Mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['user'], exact: true });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error registering user:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    },
  });
};

export const useLoginUser = (showModal: (message: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleErrorHandler(error, showModal),
  });
};

export const useGetByEmail = (email: string) => {
  // const queryClient = useQueryClient();

  return useQuery({
    queryFn: () => getByEmail(email),
    queryKey: ['user'],
    
  });
};


export const useCheckUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkUsername,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'useCheckUsername'),
  });
};


export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'logging out user'),
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'refreshing token'),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'refreshing token'),
  });
}