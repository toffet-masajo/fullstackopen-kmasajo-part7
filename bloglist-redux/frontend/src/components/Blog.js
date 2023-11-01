import { useDispatch, useSelector } from 'react-redux';
import { addBlogComment, addBlogLike, removeBlog } from '../reducers/blogReducer';

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

  const handleAddComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    dispatch(addBlogComment({ blogId: blog.id, comment }));
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
        added by {blog.user.name}{' '}
        {user && user.username === blog.user.username ? (
          <button id="remove-blog-button" onClick={handleDeleteButton}>
            remove
          </button>
        ) : null}
      </p>
      <h2>comments</h2>
      <form onSubmit={handleAddComment}>
        <input type="text" placeholder="comment" name="comment" />
        <button>add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, idx) => (
          <li key={idx}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
