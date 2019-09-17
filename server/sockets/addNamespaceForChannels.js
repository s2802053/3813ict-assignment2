const mongoose = require('mongoose');
require(__dirname + '/../models/models');
const Group = mongoose.model('group');

const addNamespace = require(__dirname + '/addNamespace.js');

module.exports = function(io) {
    // find all groups in db
    Group.find({}, (err, groups) => {
        if (err) throw err;
        // iterate over groups
        groups.forEach(group => {
            // iterate over channels of each group
            group.channels.forEach(channel => {
                // add a socket namespace for each channel
                addNamespace(io, channel.id);
            });
        });
        return io;
    });
}