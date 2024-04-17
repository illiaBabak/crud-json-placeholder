import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const findUser = (users: User[] | undefined, searchVal: string) => {
  const targetUser = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.username.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.email.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.address.city.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.address.street.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.company.name.toLowerCase().includes(searchVal.toLowerCase())
  )[0];

  return targetUser;
};

export const UsersPage = (): JSX.Element => {
  const { setShouldShowCreateWindow, setAlertProps } = useContext(GlobalContext);
  const { data: users, isLoading } = useQueryUsers();
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [userValues, setUserValues] = useState<User>(DEFAULT_VALUES);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

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

  const searchUser = () => {
    if (!searchVal) {
      navigate('/posts');
      return;
    }

    const searched = findUser(users, searchVal);

    if (searched) navigate(`/users/:${searched?.id}`);
    else {
      setAlertProps({ text: 'Not found', type: 'warning', position: 'top' });
      navigate('/users');
    }
  };

  const searchUserInput = (
    <input
      type='text'
      className='search-input'
      value={searchVal}
      onChange={(e) => setSearchVal(e.currentTarget.value)}
      onBlur={() => searchUser()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );

  const usersElements =
    (id ? users?.filter((user) => user.id === Number(id.slice(1))) : users)?.map((user, index) => {
      if (id && index > 0) return <></>;

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
        isLoading={isLoading}
        listElements={usersElements}
        inputs={usersInputs}
        changeData={editedUser ? handleEdit : handleMutate}
        isDisabledBtn={editedUser ? hasEmptyField(editedUser) : hasEmptyField(userValues)}
        isEdit={!!editedUser}
        removeEdit={removeEdit}
        searchInput={searchUserInput}
      />
    </>
  );
};
