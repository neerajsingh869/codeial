const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const AVATAR_PATH = path.join('/uploads/users/avatars').replace(/\\/g, '/');

// create schema for user document
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password : {
        type: String,
        required: true
    }, 
    name : {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    friendships: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship'
    }]
}, { timestamps: true });

// multer configurations to store uploaded file on local file system
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      const fileInfo = file.mimetype.split('/');
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileInfo[fileInfo.length - 1])
    }
  })

// static functions of user schema
userSchema.statics.upload = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

// create model for user with userSchema
const User = mongoose.model('User', userSchema);

// export model
module.exports = User;