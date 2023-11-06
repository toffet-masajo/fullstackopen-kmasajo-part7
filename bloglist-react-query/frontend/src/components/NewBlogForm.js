import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const NewBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreate({
      title: title,
      author: author,
      url: url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id="blog-title"
            type="text"
            placeholder="blog title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Form.Label>author:</Form.Label>
          <Form.Control
            id="blog-author"
            type="text"
            placeholder="blog author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <Form.Label>url:</Form.Label>
          <Form.Control
            id="blog-url"
            type="text"
            placeholder="blog url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <Button id="create-button" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

NewBlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
};

export default NewBlogForm;
