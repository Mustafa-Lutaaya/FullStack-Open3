const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be atleast 3 characters long'],
        required: true
    },
    number: {
        type: String,
        required: true
    }
});

personSchema.set('runValidators', true);

module.exports = mongoose.model('Person', personSchema);