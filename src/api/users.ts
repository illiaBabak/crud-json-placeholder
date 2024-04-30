import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { User } from 'src/types/types';
import { isUserArr } from 'src/utils/guards';
import { BASE_URL, USERS_QUERY, USER_ADD, USER_DELETE, USER_EDIT, USER_MUTATION } from './constants';

const addUser = async (user: User): Promise<void> => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new user');
};

const deleteUser = async (userId: number): Promise<undefined> => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a user');
};

const editUser = async (user: User): Promise<void> => {
  const response = await fetch(`${BASE_URL}/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with editing a user');
};

const getUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/users`);

    const responseData: unknown = await response.json();

    if (isUserArr(responseData)) return responseData;
    else throw new Error('Something went wrong with API request (users)');
  } catch {
    throw new Error('Unexpected result (users)');
  }
};

export const useQueryUsers = (): UseQueryResult<User[]> =>
  useQuery({
    queryKey: [USERS_QUERY],
    queryFn: getUsers,
  });

export const useAddUser = (): UseMutationResult<
  void,
  Error,
  User,
  {
    prevVal: User[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_ADD],
    mutationFn: addUser,
    onMutate: async (user: User) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY] });

      const prevVal = queryClient.getQueryData<User[] | undefined>([USERS_QUERY]);

      queryClient.setQueryData([USERS_QUERY], (prev: User[]) => [user, ...prev]);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([USERS_QUERY], context?.prevVal);
    },
  });
};

export const useDeleteUser = (): UseMutationResult<
  undefined,
  Error,
  number,
  {
    prevVal: User[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_DELETE],
    mutationFn: deleteUser,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY] });

      const prevVal = queryClient.getQueryData<User[] | undefined>([USERS_QUERY]);

      queryClient.setQueryData([USERS_QUERY], (prev: User[]) => prev.filter((user) => user.id !== id));

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_err, _user, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([USERS_QUERY], context?.prevVal);
    },
  });
};

export const useEditUser = (): UseMutationResult<
  void,
  Error,
  User,
  {
    prevVal: User[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [USER_MUTATION, USER_EDIT],
    mutationFn: editUser,
    onMutate: async (editedUser: User) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY] });

      const prevVal = queryClient.getQueryData<User[] | undefined>([USERS_QUERY]);

      queryClient.setQueryData<User[] | undefined>([USERS_QUERY], (prev) =>
        prev?.map((user) => (user.id === editedUser.id ? { ...user, ...editedUser } : user))
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([USERS_QUERY], context?.prevVal);
    },
  });
};
