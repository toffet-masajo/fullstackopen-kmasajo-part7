import { useDispatch, useSelector } from 'react-redux';

import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';
import { addBlogLike, createNewBlog, removeBlog } from '../reducers/blogReducer';

const compare = (a, b) => {
  if (a.likes > b.likes) return -1;
  if (a.likes < b.likes) return 1;
  return 0;
};

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleCreateBlog = async (newBlog) => {
    dispatch(createNewBlog(newBlog, user));
  };

  const handleRemoveBlog = async (blogId) => {
    dispatch(removeBlog(blogId));
  };

  const handleAddLike = async (updatedBlog) => {
    dispatch(addBlogLike(updatedBlog));
  };

  if (!blogs) return null;

  const blogsToDisplay = [...blogs];

  return (
    <div>
      <Togglable buttonLabel="new blog">
        <NewBlogForm handleCreate={handleCreateBlog} />
      </Togglable>
      {blogsToDisplay.sort(compare).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user.username}
          handleUpdate={handleAddLike}
          handleDelete={handleRemoveBlog}
        />
      ))}
    </div>
  );
};

export default BlogList;
