import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { User } from 'src/types/types';
import { isUser, isUserArr } from 'src/utils/guards';

const getUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);

    const responseData: unknown = await response.json();

    if (isUserArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (users)');
  } catch {
    throw new Error('Unexpected result (users)');
  }
};

export const useQueryUsers = (): UseQueryResult<User[]> => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await getUsers();
    },
  });
};

export const addUser = async (user: User): Promise<User | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    body: JSON.stringify({
      ...user,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new user');

  const newUser: unknown = await response.json();

  return isUser(newUser) ? newUser : undefined;
};
