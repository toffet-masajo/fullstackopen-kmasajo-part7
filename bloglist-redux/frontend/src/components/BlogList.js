import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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

  const handleCreateBlog = async (newBlog) => {
    dispatch(createNewBlog(newBlog, user));
  };

  if (!blogs) return null;

  const blogsToDisplay = [...blogs];

  return (
    <div>
      {user && (
        <Togglable buttonLabel="new blog">
          <NewBlogForm handleCreate={handleCreateBlog} />
        </Togglable>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogsToDisplay.sort(compare).map((blog) => (
              <TableRow key={blog.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogList;
