import { useDispatch, useSelector } from 'react-redux';
import { addBlogLike, removeBlog } from '../reducers/blogReducer';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLikeButton = (event) => {
    event.preventDefault();
    dispatch(addBlogLike(blog));
  };

  const handleDeleteButton = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) dispatch(removeBlog(blog.id));
  };

  if (!blog) return null;

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
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
        {user && user.username === blog.user.username ? (
          <button id="remove-blog-button" onClick={handleDeleteButton}>
            remove
          </button>
        ) : null}
      </p>
    </div>
  );
};

export default Blog;
