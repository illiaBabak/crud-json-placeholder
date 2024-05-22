import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAddUser, useDeleteUser, useEditUser, useQueryUsers } from 'src/api/users';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { User } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';
import { searchPredicate } from 'src/utils/searchPredicate';

const DEFAULT_VALUES = {
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
  id: 0,
};

export const UsersPage = (): JSX.Element => {
  const [editedUser, setEditedUser] = useState<User>(DEFAULT_VALUES);
  const { setShouldShowCreateWindow } = useContext(GlobalContext);

  const { data: users, isLoading } = useQueryUsers();

  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: editUser } = useEditUser();

  const [seachParams] = useSearchParams();

  const searchText = seachParams.get('query');
  const filteredUsers = users?.filter((user) => {
    const { address, company, email, name, phone, username } = user;
    const { city, street } = address;

    return searchPredicate([city, street, company.name, email, name, phone, username], searchText ?? '');
  });

  const handleMutate = () => addUser({ ...editedUser, id: users?.length ?? 0 });

  const handleEdit = () => editUser(editedUser ?? DEFAULT_VALUES);

  const handleInputChange = ({ currentTarget: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeNestedObj = (
    { currentTarget: { name, value } }: React.ChangeEvent<HTMLInputElement>,
    nestedObjName: 'address' | 'company'
  ) => {
    setEditedUser((prev) => ({
      ...prev,
      [nestedObjName]: {
        ...prev[nestedObjName],
        [name]: value,
      },
    }));
  };

  const usersElements =
    filteredUsers?.map((user, index) => {
      const { address, company, email, name, phone, username, id } = user;
      const { city, street } = address;

      return (
        <div className='user-el' key={`user-${email}-${index}-${id}`}>
          <h2>Username: {username}</h2>
          <div className='user-row'>
            <div className='user-col'>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Phone: {phone}</p>
            </div>
            <div className='user-col'>
              <p>Company name: {company.name}</p>
              <p>City: {city}</p>
              <p>Street: {street}</p>
            </div>
          </div>

          <div className='container-el-btn'>
            <div className='delete-el-btn' onClick={() => deleteUser(id)}>
              Delete
            </div>
            <div
              className='edit-el-btn'
              onClick={() => {
                setShouldShowCreateWindow(true);
                setEditedUser(user);
              }}
            >
              Edit
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
          value={editedUser.username}
          name='username'
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>Name</h4>
        <input
          type='text'
          value={editedUser.name}
          className='create-window-input'
          name='name'
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>Email</h4>
        <input
          type='text'
          value={editedUser.email}
          className='create-window-input'
          name='email'
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>Phone</h4>
        <input
          type='text'
          value={editedUser.phone}
          className='create-window-input'
          name='phone'
          onChange={handleInputChange}
        />
      </div>

      <div className='create-window-row'>
        <h4>Company name</h4>
        <input
          type='text'
          value={editedUser.company.name}
          className='create-window-input'
          name='name'
          onChange={(e) => handleChangeNestedObj(e, 'company')}
        />
      </div>

      <div className='create-window-row'>
        <h4>City</h4>
        <input
          type='text'
          value={editedUser.address.city}
          className='create-window-input'
          name='city'
          onChange={(e) => handleChangeNestedObj(e, 'address')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Street</h4>
        <input
          type='text'
          value={editedUser.address.street}
          className='create-window-input'
          name='street'
          onChange={(e) => handleChangeNestedObj(e, 'address')}
        />
      </div>
    </>
  );

  return (
    <>
      <Page
        title='users'
        isLoading={isLoading}
        listElements={usersElements}
        inputs={usersInputs}
        onChangeData={editedUser.id ? handleEdit : handleMutate}
        isDisabledBtn={hasEmptyField(editedUser)}
        isEdit={!!editedUser.id}
        onResetState={() => setEditedUser(DEFAULT_VALUES)}
      />
    </>
  );
};
