import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { User } from 'src/types/types';
import { isUser, isUserArr } from 'src/utils/guards';

const addUser = async (user: User): Promise<User | undefined> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Something went wrong with adding a new user');

  const newUser: unknown = await response.json();

  return isUser(newUser) ? newUser : undefined;
};

const deleteUser = async (userId: number): Promise<undefined> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Something went wrong with deleting a user');
};

const editUser = async (user: User): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
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

export const useAddUser = (): UseMutationResult<
  User | undefined,
  Error,
  User,
  {
    prevVal: User[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: ['add_user'],
    mutationFn: addUser,
    onMutate: async (user: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const prevVal = queryClient.getQueryData<User[] | undefined>(['users']);

      queryClient.setQueryData(['users'], (prev: User[]) => [user, ...prev]);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData(['users'], context?.prevVal);
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
    mutationKey: ['delete_user'],
    mutationFn: deleteUser,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const prevVal = queryClient.getQueryData<User[] | undefined>(['users']);

      queryClient.setQueryData(['users'], (prev: User[]) => prev.filter((user) => user.id !== id));

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_err, _user, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData(['users'], context?.prevVal);
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
    mutationKey: ['edit_user'],
    mutationFn: editUser,
    onMutate: async (editedUser: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const prevVal = queryClient.getQueryData<User[] | undefined>(['users']);

      const editedUserIndex = prevVal?.findIndex((user) => user.id === editedUser.id);

      if (!editedUserIndex && editedUserIndex !== 0) return;

      const updatedUsers = [
        ...(prevVal ?? []).slice(0, editedUserIndex),
        editedUser,
        ...(prevVal ?? []).slice(editedUserIndex + 1),
      ];

      queryClient.setQueryData(['users'], updatedUsers);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData(['users'], context?.prevVal);
    },
  });
};
