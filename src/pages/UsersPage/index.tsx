import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addUser, useQueryUsers } from 'src/api/users';
import { Page } from 'src/components/Page';
import { User } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

export const UsersPage = (): JSX.Element => {
  const { data: users, isError, isFetching } = useQueryUsers();
  const [userValues, setUserValues] = useState<User>({
    address: {
      city: '',
      street: '',
    },

    company: {
      name: '',
    },

    email: '',
    name: '',
    phone: '',
    username: '',
  });
  const queryClient = useQueryClient();

  const usersMutation = useMutation({
    mutationFn: (user: User) => addUser(user),
    onMutate: async (user: User) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const prevVal: User[] | undefined = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (prev: User[]) => [user, ...prev]);

      return { prevVal };
    },

    onError: (_err, _newUser, context) => {
      queryClient.setQueryData(['users'], context?.prevVal);
    },
  });

  const handleMutate = () => usersMutation.mutate(userValues);

  const handleInputChange = (val: string, fieldName: string) => {
    setUserValues((prevState) => ({
      ...prevState,
      [fieldName]: val,
    }));
  };

  const usersElements =
    users?.map((user, index) => {
      return (
        <div className='user-el' key={`user-${user.email}-${index}`}>
          <h2>Username: {user.username}</h2>
          <div className='user-row'>
            <div className='user-col'>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
            <div className='user-col'>
              <p>Company name: {user.company.name}</p>
              <p>City: {user.address.city}</p>
              <p>Street: {user.address.street}</p>
            </div>
          </div>
        </div>
      );
    }) ?? [];

  const usersInputs = (
    <>
      <div className='create-window-row'>
        <h4>Username</h4>
        <input
          type='text'
          className='create-window-input'
          value={userValues.username}
          onChange={(e) => handleInputChange(e.currentTarget.value, 'username')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Name</h4>
        <input
          type='text'
          value={userValues.name}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'name')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Email</h4>
        <input
          type='text'
          value={userValues.email}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'email')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Phone</h4>
        <input
          type='text'
          value={userValues.phone}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'phone')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Company name</h4>
        <input
          type='text'
          value={userValues.company.name}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            setUserValues((prev) => ({
              ...prev,
              company: {
                ...prev.company,
                name: val,
              },
            }));
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>City</h4>
        <input
          type='text'
          value={userValues.address.city}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            setUserValues((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                city: val,
              },
            }));
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>Street</h4>
        <input
          type='text'
          value={userValues.address.street}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            setUserValues((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                street: val,
              },
            }));
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <Page
        title='users'
        isError={isError}
        isFetching={isFetching}
        listElements={usersElements}
        inputs={usersInputs}
        changeData={handleMutate}
        isDisabledBtn={hasEmptyField(userValues)}
      />
    </>
  );
};
