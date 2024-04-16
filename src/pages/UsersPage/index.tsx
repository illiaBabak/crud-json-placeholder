import { useContext, useState } from 'react';
import { useAddUser, useDeleteUser, useEditUser, useQueryUsers } from 'src/api/users';
import { Page } from 'src/components/Page';
import { GlobalContext } from 'src/root';
import { User } from 'src/types/types';
import { hasEmptyField } from 'src/utils/hasEmptyFields';

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
  const { setShouldShowCreateWindow } = useContext(GlobalContext);
  const { data: users, isError, isLoading } = useQueryUsers();
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [userValues, setUserValues] = useState<User>(DEFAULT_VALUES);

  const { mutateAsync: addUser } = useAddUser();

  const { mutateAsync: deleteUser } = useDeleteUser();

  const { mutateAsync: editUser } = useEditUser();

  const handleMutate = () => addUser({ ...userValues, id: users?.length ?? 0 });

  const handleEdit = () => editUser(editedUser ?? DEFAULT_VALUES);

  const removeEdit = () => setEditedUser(null);

  const handleInputChange = (val: string, fieldName: string) => {
    {
      editedUser
        ? setEditedUser((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              [fieldName]: val,
            };
          })
        : setUserValues((prevState) => ({
            ...prevState,
            [fieldName]: val,
          }));
    }
  };

  const usersElements =
    users?.map((user, index) => {
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
          value={editedUser ? editedUser.username : userValues.username}
          onChange={(e) => handleInputChange(e.currentTarget.value, 'username')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Name</h4>
        <input
          type='text'
          value={editedUser ? editedUser.name : userValues.name}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'name')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Email</h4>
        <input
          type='text'
          value={editedUser ? editedUser.email : userValues.email}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'email')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Phone</h4>
        <input
          type='text'
          value={editedUser ? editedUser.phone : userValues.phone}
          className='create-window-input'
          onChange={(e) => handleInputChange(e.currentTarget.value, 'phone')}
        />
      </div>

      <div className='create-window-row'>
        <h4>Company name</h4>
        <input
          type='text'
          value={editedUser ? editedUser.company.name : userValues.company.name}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedUser
                ? setEditedUser((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      company: {
                        ...prev.company,
                        name: val,
                      },
                    };
                  })
                : setUserValues((prev) => ({
                    ...prev,
                    company: {
                      ...prev.company,
                      name: val,
                    },
                  }));
            }
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>City</h4>
        <input
          type='text'
          value={editedUser ? editedUser.address.city : userValues.address.city}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedUser
                ? setEditedUser((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      address: {
                        ...prev.address,
                        city: val,
                      },
                    };
                  })
                : setUserValues((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      city: val,
                    },
                  }));
            }
          }}
        />
      </div>

      <div className='create-window-row'>
        <h4>Street</h4>
        <input
          type='text'
          value={editedUser ? editedUser.address.street : userValues.address.street}
          className='create-window-input'
          onChange={(e) => {
            const val = e.currentTarget.value;

            {
              editedUser
                ? setEditedUser((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      address: {
                        ...prev.address,
                        street: val,
                      },
                    };
                  })
                : setUserValues((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      street: val,
                    },
                  }));
            }
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
        isLoading={isLoading}
        listElements={usersElements}
        inputs={usersInputs}
        changeData={editedUser ? handleEdit : handleMutate}
        isDisabledBtn={editedUser ? hasEmptyField(editedUser) : hasEmptyField(userValues)}
        isEdit={!!editedUser}
        removeEdit={removeEdit}
      />
    </>
  );
};
