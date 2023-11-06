import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { getUser } from '../services/users';
import LogoutForm from './LogoutForm';

const User = () => {
  const userId = useParams().id;

  const result = useQuery(['user', userId], () => getUser(userId), { retry: false, refetchOnWindowFocus: false });
  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError) return <div>user service not available due to problems in the server.</div>;

  const user = result.data;
  return (
    <div>
      <LogoutForm />
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
