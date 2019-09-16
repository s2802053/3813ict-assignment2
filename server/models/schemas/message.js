const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {type: Schema.ObjectId},
    timestamp: {type: Date, default: Date.now},
    content: {type: String}
});

module.exports = messageSchema;