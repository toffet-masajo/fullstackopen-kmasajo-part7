import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { getBlog, updateBlog } from '../services/blogs';
import { useNotificationDispatch } from '../context/NotificationContext';
import LogoutForm from './LogoutForm';

const Blog = () => {
  const queryClient = useQueryClient();
  const blogId = useParams().id;
  const notificationDispatch = useNotificationDispatch();

  const likeBlogMutation = useMutation(updateBlog, {
    onSuccess: (updatedBlog) => {
      // const blog = queryClient.getQueryData('blog');
      // queryClient.setQueryData('blog', { ...blog, likes: updatedBlog.likes });
      queryClient.invalidateQueries('blog');
      queryClient.setQueryData('blog', { ...blog, likes: updatedBlog.likes });
    },
    onError: ({ response }) =>
      notificationDispatch({ type: 'NEW_MESSAGE', payload: { message: `${response.data.error}`, type: 'ng' } }),
    onSettled: () => setTimeout(() => notificationDispatch({ type: 'CLEAR_MESSAGE' }), 5000),
  });

  const handleLikeButton = async (event) => {
    event.preventDefault();
    likeBlogMutation.mutate({ ...blog });
  };

  const result = useQuery(['blog', blogId], () => getBlog(blogId), { retry: false, refetchOnWindowFocus: false });
  if (result.isLoading) return <div>loading blog data...</div>;
  if (result.isError) return <div>blog service not available due to problems in the server.</div>;

  const blog = result.data;
  queryClient.setQueryData('blog', blog);

  return (
    <div>
      <LogoutForm />
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
        <br />
        {blog.likes} likes
        <button id="like-blog-button" onClick={handleLikeButton}>
          like
        </button>
        <br />
        added by {blog.user.name}
        <br />
        <h2>comments</h2>
        <ul>
          {blog.comments.map((comment, idx) => (
            <li key={idx}>{comment.content}</li>
          ))}
        </ul>
      </p>
    </div>
  );
};

export default Blog;
