import { useDispatch, useSelector } from 'react-redux';

import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';
import { createNewBlog } from '../reducers/blogReducer';
import { Link } from 'react-router-dom';

const compare = (a, b) => {
  if (a.likes > b.likes) return -1;
  if (a.likes < b.likes) return 1;
  return 0;
};

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleCreateBlog = async (newBlog) => {
    dispatch(createNewBlog(newBlog, user));
  };

  if (!blogs) return null;

  const blogsToDisplay = [...blogs];

  return (
    <div>
      <Togglable buttonLabel="new blog">
        <NewBlogForm handleCreate={handleCreateBlog} />
      </Togglable>
      {blogsToDisplay.sort(compare).map((blog) => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
