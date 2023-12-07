const mongoose = require('mongoose');

const friendShipSchema = new mongoose.Schema({
    // user which sends the friend request
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // user which gets the friend request
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Friendship = mongoose.model('Friendship', friendShipSchema);

module.exports = Friendship;