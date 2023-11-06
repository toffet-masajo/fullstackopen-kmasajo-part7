import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useUserValue } from '../context/UserContext';
import { useNotificationDispatch } from '../context/NotificationContext';
import { createBlog, getAllBlogs } from '../services/blogs';

import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';
import LogoutForm from './LogoutForm';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const user = useUserValue();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const compare = (a, b) => {
    if (a.likes > b.likes) return -1;
    if (a.likes < b.likes) return 1;
    return 0;
  };

  const newBlogMutation = useMutation(createBlog, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs');
      newBlog.user = { username: user.username, name: user.name };
      queryClient.setQueryData('blogs', blogs.concat(newBlog).sort(compare));
      notificationDispatch({
        type: 'NEW_MESSAGE',
        payload: {
          message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
          type: 'ok',
        },
      });
    },
    onError: ({ response }) =>
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: `${response.data.error}`, type: 'ng' } }),
    onSettled: () => setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000),
  });

  const handleCreateBlog = async (newBlog) => {
    newBlogMutation.mutate(newBlog);
  };

  const result = useQuery('blogs', getAllBlogs, { retry: false, refetchOnWindowFocus: false });
  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError) return <div>blog service not available due to problems in the server.</div>;

  const blogs = result.data.sort(compare);

  return (
    <div>
      {user && (
        <div>
          <LogoutForm />
          <Togglable buttonLabel="new blog">
            <NewBlogForm handleCreate={handleCreateBlog} />
          </Togglable>
        </div>
      )}
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
