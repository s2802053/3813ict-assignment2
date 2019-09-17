const router = require('express').Router();
const mongoose = require('mongoose');
require(__dirname + '/../../models/models');

const Group = mongoose.model('group');
const User = mongoose.model('user');
const Message = mongoose.model('message');

router.post('/addMessage', (req, res) => {
    const { groupId, channelId, message } = req.body;

    Group.findById(groupId, (err, group) => {
        if (err){
            res.json({success: false, err: err, data: null});
        } else if (!group){
            res.json({success: false, err: "Invalid groupId", data: null});
        } else {
            // successfully found group
            const channel = group.channels.id(channelId);
            if (!channel){ res.json({success: false, err: "Invalid channelId", data: null});}
            const msg = new Message(message);
            channel.messages.push(msg);
            group.save((err, group) => {
                res.json({success: Boolean(group), err: err, data: group.channels.id(channelId)});
            });
        }
    });
});

router.get('/getMessages', (req, res) => {
    const { groupId, channelId } = req.query;
    if ( !(groupId && channelId) ) { res.json({success: false, err: "Invalid parameters", data: null})}
    Group.findById(groupId, (err, group) => {
        if (err){res.json({success: false, err: err, data: null})}
        else if (!group){res.json({success: false, err: "Invalid groupId", data: null})}
        const channel = group.channels.id(channelId);
        if (!channel) { res.json({success: false, err: "Invalid channelId", data: null}) }
        res.json({ success: true, err: null, data: channel.messages })
    });
});

router.post('/addUser', (req, res) => {
    const { groupId, channelId, username } = req.body;

    if (!(groupId && channelId && username)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("addUserToChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        User.findOne({username: username}, (err, user) => {
            if (err){
                res.json({success: false, err: "Database error", data: null});
            } else if (!user){
                res.json({success: false, err: "Invalid username", data: null});
            } else {
                const userId = user.id;
                Group.findById(groupId, (err, group) => {
                    if (err){
                        res.json({success: false, err: err, data: null});
                    } else if (!group){
                        res.json({success: false, err: "Invalid groupId", data: null});
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
        })
    }
});

router.post('/removeUser', (req, res) => {
    const { groupId, channelId, username } = req.body;

    if (!(groupId && channelId && username)){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else if (!req.user.can("addUserToChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        User.findOne({username: username}, (err, user) => {
            if (err){
                res.json({success: false, err: "Database error", data: null});
            } else if (!user){
                res.json({success: false, err: "Invalid username", data: null});
            } else {
                const userId = user.id;
                Group.findById(groupId, (err, group) => {
                    if (err){
                        res.json({success: false, err: err, data: null});
                    } else if (!group){
                        res.json({success: false, err: "Invalid groupId", data: null});
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
        })
    }
});
module.exports = router;