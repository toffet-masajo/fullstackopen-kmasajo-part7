import { useQuery } from 'react-query';
import { getAllUsers } from '../services/users';
import LogOutForm from './LogoutForm';

const UsersList = () => {
  const result = useQuery('blogs', getAllUsers, { retry: false, refetchOnWindowFocus: false });
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
            users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
