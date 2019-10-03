const router = require('express').Router();
const mongoose = require('mongoose');
require(__dirname + '/../../models/models');

const Group = mongoose.model('group');
const Channel = mongoose.model('channel');
const User = mongoose.model('user');

const addNamespace = require(__dirname + '/../../sockets/addNamespace');

router.get('/getChannels', (req, res) => {
    const { groupId } = req.query;
    const userId = req.session.user.id;

    if (!groupId){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (!err){
                const channelIds = group.channels.filter(channel => {
                    return channel.users.indexOf(userId) !== -1;
                }).map( channel => {
                    return {
                        id: channel.id, 
                        name: channel.channelId
                    } 
                });
                res.json({success: true, err: null, data: channelIds});
            } else {
                res.json({success: Boolean(group), err: err, data: group});
            }
        });
    }
});

router.post('/create', (req, res) => {
    const { groupId } = req.body;

    if (!groupId){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("createGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        const group = new Group({
            groupId: groupId,
            admins: [],
            assistants: [],
            users: [],
            channels: []
        });
        // push the creater of the group to the admins array
        group.admins.push(req.session.user.id);

        group.save((err, group) => {
            res.json({success: Boolean(group), err: err, data: group});
        });
    }
});

router.post('/delete', (req, res) => {
    const { groupId } = req.body;

    if (!groupId){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findByIdAndDelete(groupId, (err, doc) => {
            res.json({success: Boolean(doc), err: err, data: doc});
        })
    }
});

router.post('/createChannel', (req, res) => {
    const { groupId, channelId } = req.body;

    if (!(groupId && channelId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("createChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
            } else {
                // create a channel
                const channel = new Channel({
                    channelId: channelId,
                    users: [],
                    messages: []
                });
                channel.users.push(req.session.user.id);
                group.channels.push(channel);
                group.save((err, group) => {
                    if (err){
                        res.json({success: false, err: err, data: null});
                    } else {
                        // add a namespace for the channel id to the io object
                        addNamespace(req.io, channel.id);
                        res.json({success: Boolean(group), err: err, data: group});
                    }
                }) ;
            }
        });
    }
});

router.post('/deleteChannel', (req, res) => {
    const { groupId, channelId } = req.body;

    if (!(groupId && channelId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: err, data: null});
            } else if (!group){
                res.json({success: false, err: "Invalid groupId", data: null});
            } else {
                // successfully found group
                group.channels.id(channelId).remove();
                group.save((err, group) => {
                    res.json({success: Boolean(group), err: err, data: group});
                });
            }
        });
    }
});

router.post('/addUser', (req, res) => {
    const { groupId, username } = req.body;

    if (!(groupId && username)){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else if (!req.user.can("addUserToGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        // find user id of username
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
                    } else {
                        group.users.push(userId);
                        group.save((err, group) => {
                            res.json({success: Boolean(group), err: err, data: group});
                        });
                    }
                });
            }
        });
    }
});

router.post('/removeUser', (req, res) => {
    const { groupId, username } = req.body;

    if (!(groupId && username)){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else if (!req.user.can("removeUserFromGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        // find user id of username
        User.findOne({username: username}, (err, user) => {
            if (err){
                res.json({success: false, err: "Database error", data: null});
            } else if (!user){
                res.json({success: false, err: "Invalid username", data: null});
            } else {
                const userId = user.id;
                // find group
                Group.findById(groupId, (err, group) => {
                    if (err){
                        res.json({success: false, err: err, data: null});
                    } else if (!group){
                        res.json({success: false, err: "Invalid groupId", data: null});
                    } else {
                        group.users.splice(group.users.indexOf(userId), 1);
                        group.save((err, group) => {
                            if (err){
                                res.json({success: false, err: err, data: null});
                            } else {
                                res.json({success: Boolean(group), err: err, data: group});
                            }
                        });
                    }
                });
            }
        });
    }
});
module.exports = router;