const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require('./schemas/user');
const messageSchema = require('./schemas/message');
const channelSchema = require('./schemas/channel');
const groupSchema = require('./schemas/group');

mongoose.model('user', userSchema);
mongoose.model('message', messageSchema);
mongoose.model('channel', channelSchema);
mongoose.model('group', groupSchema);