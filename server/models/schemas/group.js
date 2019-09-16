const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const channelSchema = require('./channel');

const groupSchema = new Schema({
    groupId: { type: String },
    users: { type: [Schema.ObjectId] },
    assistants: { type: [Schema.ObjectId] },
    admins: { type: [Schema.ObjectId] },
    channels: { type: [channelSchema] }
});

module.exports = groupSchema;