const mongoose = require('mongoose');

const DeviceSessionSchema = mongoose.Schema({
    startTime: {
        type: Date,
        default: Date.now
    },
    owner: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    macAddress: {
        type: String,
        required: true
    },
    data: {
        type: [],
        default: []
    }
});

module.exports = mongoose.model('DeviceSession', DeviceSessionSchema);