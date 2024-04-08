import { useQueryUsers } from 'src/api/users';
import { Page } from 'src/components/Page';

export const UsersPage = (): JSX.Element => {
  const { data: users, isError, isFetching } = useQueryUsers();

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

  return <Page title='users' isError={isError} isFetching={isFetching} listElements={usersElements} />;
};
