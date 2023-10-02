const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
});

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.blogId;
  },
});

module.exports = mongoose.model('Comment', commentSchema);
