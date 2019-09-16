const router = require('express').Router();
const mongoose = require('mongoose');
require(__dirname + '/../../models/models');

const Group = mongoose.model('group');

router.get('/addMessage', (req, res) => {

});

router.get('/getMessages', (req, res) => {

});

router.get('/addUser', (req, res) => {
    const { groupId, channelId, userId } = req.query;

    if (!(groupId && channelId && userId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
            } else {
                // successfully found group
                const channel = group.channels.id(channelId);
                if (channel.users.indexOf(userId) === -1){
                    channel.users.push(userId);
                }
                group.save((err, group) => {
                    res.json({success: Boolean(group), err: err, data: group});
                });
            }
        });
    }
});

router.get('/removeUser', (req, res) => {
    const { groupId, channelId, userId } = req.query;

    if (!(groupId && channelId && userId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
            } else {
                // successfully found group
                const channel = group.channels.id(channelId);
                channel.users.splice(channel.users.indexOf(userId), 1);
                group.save((err, group) => {
                    res.json({success: Boolean(group), err: err, data: group});
                });
            }
        });
    }
});
module.exports = router;