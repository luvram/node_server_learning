const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});
const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: authorSchema,
    required: true
  },
}));

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course
    .find()
    .populate('author', 'name -_id')
    .populate('category', 'name')
    .select('name author');
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = 'Boram Kim';
  course.save();
}

async function updateAuthorByUpdate(courseId) {
  const course = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': 'Toto Oh!'
    }
  });
}

async function removeAuthor(courseId) {
  const course = await Course.update({ _id: courseId }, {
    $unset: {
      'author': '',
    }
  })
}
// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', new Author({ name: 'Boram' }));

// listCourses();

removeAuthor('5bdb07b8943812e46795d079');