const router = require('express').Router();
const mongoose = require('mongoose');
require(__dirname + '/../../models/models');

const Group = mongoose.model('group');
const Channel = mongoose.model('channel');

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
                }).map( channel => channel.id );
                res.json({success: true, err: null, data: channelIds});
            } else {
                res.json({success: Boolean(group), err: err, data: group});
            }
        });
    }
});

router.get('/create', (req, res) => {
    const { groupId } = req.query;

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

router.get('/delete', (req, res) => {
    const { groupId } = req.query;

    if (!groupId){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.deleteOne({groupId: groupId}, (err) => {
            res.json({success: !Boolean(err), err: err, data: null});
        })
    }
});

router.get('/createChannel', (req, res) => {
    const { groupId, channelId } = req.query;

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
                    res.json({success: Boolean(group), err: err, data: group});
                }) ;
            }
        });
    }
});

router.get('/deleteChannel', (req, res) => {
    const { groupId, channelId } = req.query;

    if (!(groupId && channelId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("deleteChannel")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
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

router.get('/addUser', (req, res) => {
    const { groupId, userId } = req.query;

    if (!(groupId && userId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("addUserToGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
            } else {
                group.users.push(userId);
                group.save((err, group) => {
                    res.json({success: Boolean(group), err: err, data: group});
                });
            }
        });
    }
});

router.get('/removeUser', (req, res) => {
    const { groupId, userId } = req.query;

    if (!(groupId && userId)){
        res.json({success: false, err: "Invalid paramaters", data: null});
    } else if (!req.user.can("addUserToGroup")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else{
        Group.findById(groupId, (err, group) => {
            if (err){
                res.json({success: false, err: "Invalid group id", data: null});
            } else {
                // successfully found group
                let index = group.users.indexOf(userId);
                group.users.splice(index, 1);
                group.save((err, group) => {
                    res.json({success: Boolean(group), err: err, data: group});
                });
            }
        });
    }
});

router.get('/test', (req, res) => {
    Group.find({}, (err, docs) => {
        if (err) throw err;
        res.send(docs);
    })
});

module.exports = router;