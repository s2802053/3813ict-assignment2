const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = require('./message');

const channelSchema = new Schema({
    channelId: String,
    users: [Schema.ObjectId],
    messages: [messageSchema]
});

module.exports = channelSchema;