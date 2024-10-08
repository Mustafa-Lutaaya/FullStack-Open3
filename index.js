const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');
const errorHandler = require('./middlewares/errorHandler')

const personsRouter = express.Router();

const app = express();
const url = 'mongodb+srv://Mustafa-Lutaaya:Satire6Digits@fullstackopencluster.zx926.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpenCluster'

mongoose.connect(url)
.then(() => { 
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connceting to MongoDB:', error.message);
});

morgan.token('body', (req) => {
  return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '';
});

const format = ':method :url :status :response-time ms - :body';

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/persons', personsRouter);

personsRouter.get('/',(request, response) => {
  Person.find([])
  .then(persons => {
    response.json(persons);
  })
  .catch(error => {
    next(error);
  });    
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
  .then(count => {
    const info = `
      <p>Phonebook has info for ${count} people </p>
      <p>${new Date}</p>
      `;
      response.send(info);
  })
  .catch(error => 
    next(error));
});

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
    response.json(person);
  } else { 
    response.status(404).end();
  }
  })
  .catch(error => next(error));
});


personsRouter.delete('/:id', (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
  .then(result => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: 'Person not found' });
    }
     })
     .catch(error => {
      next(error);
      });
  });

personsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params;
  const { name, number } = request.body;

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson);
    } else {
      response.status(404).send({ error: 'Person not found' });
    }
  })
  .catch(error => next(error));
});

personsRouter.post('/', (request, response) => {
  const body= request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  
  person.save()
  .then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => {
  next(error);
  });
});


app.get('*', (request, response) => {
  respond.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
