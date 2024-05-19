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
  const filteredUsers = users?.filter((user) =>
    searchPredicate(
      [user.address.city, user.address.street, user.company.name, user.email, user.name, user.phone, user.username],
      searchText ?? ''
    )
  );

  const handleMutate = () => addUser({ ...editedUser, id: users?.length ?? 0 });

  const handleEdit = () => editUser(editedUser ?? DEFAULT_VALUES);

  const handleInputChange = (val: string, fieldName: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [fieldName]: val,
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
      return (
        <div className='user-el' key={`user-${user.email}-${index}-${user.id}`}>
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

          <div className='container-el-btn'>
            <div className='delete-el-btn' onClick={() => deleteUser(user.id)}>
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
          onChange={(e) => handleInputChange(e.currentTarget.value, 'username')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Name</h4>
        <input
          type='text'
          value={editedUser.name}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'name')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Email</h4>
        <input
          type='text'
          value={editedUser.email}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'email')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Phone</h4>
        <input
          type='text'
          value={editedUser.phone}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'phone')}
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
        changeData={editedUser.id ? handleEdit : handleMutate}
        isDisabledBtn={hasEmptyField(editedUser)}
        isEdit={!!editedUser.id}
        onResetState={() => setEditedUser(DEFAULT_VALUES)}
      />
    </>
  );
};
