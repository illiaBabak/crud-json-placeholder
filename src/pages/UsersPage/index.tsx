import { useQueryUsers } from 'src/api/users';
import { Alert } from 'src/components/Alert';
import { Header } from 'src/components/Header';
import { Loader } from 'src/components/Loader';

export const UsersPage = (): JSX.Element => {
  const { data, isError, isFetching } = useQueryUsers();

  const users = data?.data;

  return (
    <>
      <div className='page'>
        <Header />
        {isFetching ? (
          <Loader />
        ) : (
          <div className='list'>
            {users?.map((user, index) => {
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
            })}
          </div>
        )}
      </div>

      {isError && <Alert />}
    </>
  );
};
