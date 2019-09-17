const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    username: {type: String},
    timestamp: {type: String},
    message: {type: String}
});

module.exports = messageSchema;