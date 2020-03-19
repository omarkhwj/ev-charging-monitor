const mongoose = require('mongoose');

const HouseholdSchema = mongoose.Schema({
    creationDate: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    users: [{ 
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'User'
     }],
     zipcode: {
         type: String,
         min: 5,
         max: 5
     }
});

module.exports = mongoose.model('Household', HouseholdSchema);