import { Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const NewBlogForm = ({ handleCreate }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;

    handleCreate({
      title: title,
      author: author,
      url: url,
    });

    event.target.title.value = '';
    event.target.author.value = '';
    event.target.url.value = '';
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <TextField label="title" name="title" placeholder="blog title" />
          </div>
          <div>
            <TextField label="author" name="author" placeholder="blog author" />
          </div>
          <div>
            <TextField label="url" name="url" placeholder="blog url" />
          </div>
          <div>
            <Button variant="contained" color="primary" type="submit">
              create
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

NewBlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
};

export default NewBlogForm;
