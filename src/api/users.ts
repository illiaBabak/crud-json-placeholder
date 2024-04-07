import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { UserResponse } from 'src/types/users';
import { isUserResponse } from 'src/utils/guards';

const getUsers = async (): Promise<UserResponse | undefined> => {
  try {
    const response: AxiosResponse<UserResponse> = await axios.get(`https://jsonplaceholder.typicode.com/users`);

    if (isUserResponse(response)) return response;
    else throw new Error('Something went wrong with API request (users)');
  } catch {
    throw new Error('Unexpected result (users)');
  }
};

export const useQueryUsers = (): UseQueryResult<UserResponse> => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await getUsers();
    },
  });
};
