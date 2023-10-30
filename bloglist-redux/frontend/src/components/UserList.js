import { useSelector } from 'react-redux';

const UserList = () => {
  const users = useSelector((state) => state.userlist);

  if (users.length < 1) return null;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Blogs created</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
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

export default UserList;
