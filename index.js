const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = required('./models/person');
const app = express();

const url = 'mongodb+srv://Mustafa-Lutaaya:Satire6Digits@fullstackopencluster.zx926.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpenCluster'

mongoose.connect(url)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('Error connceting to MongoDB:', error.message);
  process.exit(1);
});

morgan.token('body', (req) => {
  return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '';
});

const format = ':method :url :status :response-time ms - :body';

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/persons',(request, response) => {
  Person.find([])
  .then(persons => response.json(persons))
  .cath(error => response.status(500).json({ error: 'Failed to fetch persons' }));
});

app.get('/info', (request, response) => {
  Person.countDocuments({})
  .then(count => {
    const requestTime = new Date();
    response.send(`
      <p>Phonebook has info for ${numberofRecords} people </p>
      <p>${requestTime}</p>
      `);
  })
  .catch(error => response.status(500).json({ error: 'Failed to count documents' }));
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
  .then(person => {
    if (person) {
    response.json(person);
  } else { 
    response.status(404).send({ error: 'Person not found' });
  }
  })
  .catch(error => response.status(500).json({ error: 'Failed to fetch person' }));
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: 'Person not found' });
  }



app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
  .then(result => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: 'Person not found' });
    }
     })
     .catch(error => response.status(500).json({ error: 'Failed to delete person'}));
  });



app.post('/api/persons', (request, response) => {
  const body= request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  Person.findOne({ name: body.name })
  .then(exisitingPerson => {
    if (exisitingPerson) {
      return response.status(400).json({ error: 'Name already exits! must be unique' });
    }

    const person = new Person({
      name: body.name,
      number: body.number
  });
  return person.save();
})
.then(savedPerson => response.json(savedPerson))
.catch(error => response.status(500).json({ error: 'Failed to save person' }));
});

app.get('*', (request, respond) => {
  respond.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
