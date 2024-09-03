const mongoose = require('mongoose')

const validatePhoneNumber = (number) => {
    const regex = /^\d{2,3}-\d{5,}$/;
    return regex.test(number);
};

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be atleast 3 characters long'],
        required: true
    },
    number: {
        type: String,
        minlength: [8, 'Phone number must be atleast 8 characters long'],
        validate: {
            validator: validatePhoneNumber,
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
});

personSchema.set('runValidators', true);

module.exports = mongoose.model('Person', personSchema)