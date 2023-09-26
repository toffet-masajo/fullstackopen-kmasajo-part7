import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { getAllUsers } from '../services/users';
import LogOutForm from './LogoutForm';

const UsersList = () => {
  const result = useQuery('users', getAllUsers, { retry: false, refetchOnWindowFocus: false });
  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError) return <div>user service not available due to problems in the server.</div>;

  const users = result.data;

  return (
    <div>
      <LogOutForm />
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
