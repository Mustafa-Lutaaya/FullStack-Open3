const mongoose = require('mongoose'); 
const Person = require('./models/person');

const args = process.argv;

if (args.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = args[2];
const url = 'mongodb+srv://Mustafa-Lutaaya:Satire6Digits@fullstackopencluster.zx926.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpenCluster'

mongoose.connect(url)
.then(() => {
    console.log('Connected to MongoDB');
    if (args.length === 3) {
        listPeople();
    } else if (args.length === 5) {
        const name = args[3];
        const number = args[4];
        addPerson(name, number);
    } else {
        console.log('Please provide the correct arguments: node mongo.js <password');
        process.exit(1);
    }
})
.catch((error) => {
    console.error('Error connection to MongoDB:', error.message);
    process.exit(1);
});


const listPeople = () => {
    Person.find({})
    .then(result => {
        console.log('phonebook');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close()
    })
    .catch(error => {
        console.error('Error fetching records:', error);
        mongoose.connection.close();
    });
};

const addPerson = (name, number) => {
    const person = new Person({ name, number });

    person.save()
    .then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error adding person:', error.message);
        mongoose.connection.close();
    });
};
