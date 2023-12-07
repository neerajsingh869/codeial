const mongoose = require('mongoose');
const env = require('../config/environment');

// establish connection with mongodb and 
// listen for initial error
mongoose.connect(env.db).then(() => {
    console.log("DB connection is successful!");
}).catch(error => {
    console.error(error);
})

// listen for error other than initial error
mongoose.connection.on('error', error => {
    console.error(error);
})

const db = mongoose.connection;

module.exports = db;