const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: 'course1'},
  { id: 2, name: 'course2'},
  { id: 3, name: 'course3'},
  { id: 4, name: 'course4'}
]

app.get('/', (req, res) => {
  res.send('Hello Welcome on board');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  const result = validateCourse(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  const newCourse = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(newCourse);
  res.send(newCourse);
});

// http put request

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find((c => c.id === parseInt(req.params.id)));
  if (!course) return res.status(404).send('The course not found');
  const result = validateCourse(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }
  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((c => c.id === parseInt(req.params.id)));
  if (!course) return res.status(404).send('The course not found');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c => c.id === parseInt(req.params.id)));
  if (!course) return res.status(404).send('The course not found');
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}

const port = process.env.port || 9090;

app.listen(port, () => {
  console.log('server is runing');
});