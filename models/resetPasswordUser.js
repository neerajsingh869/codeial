const mongoose = require('mongoose');

const resetPasswordUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const ResetPassowrdUser = mongoose.model('ResetPassowrdUser', resetPasswordUserSchema);

module.exports = ResetPassowrdUser;