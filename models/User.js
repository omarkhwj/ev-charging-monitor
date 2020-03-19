const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    creationDate: {
        type: Date,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 64,
        min: 6
    },
    household: {
        type:  mongoose.Schema.Types.ObjectId,
        ref : 'Household'
    }
});

module.exports = mongoose.model('User', UserSchema);