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
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            title: <input key="blog-title" type="text" name="title" placeholder="blog title" />
          </div>
          <div>
            author: <input key="blog-author" type="text" name="author" placeholder="blog author" />
          </div>
          <div>
            url: <input key="blog-url" type="text" name="url" placeholder="blog url" />
          </div>
          <div>
            <button key="create-button" type="submit">
              create
            </button>
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
