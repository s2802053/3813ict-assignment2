const router = require('express').Router();
const mongoose = require('mongoose');
require('../../models/models');
const User = mongoose.model('user');
const Group = mongoose.model('group');

router.get('/getGroups', (req, res) => {
        // retrieve all groups
        const userId = req.session.user.id;
        Group.find({}, (err, groups) => {
            if (err){
                res.json({success: false, err: "Error accessing database", data: null});
            } else {
                const groupIds = new Array();
                groups.forEach(group => {
                    const isUser = group.users.indexOf(userId) !== -1;
                    const isAssistant = group.assistants.indexOf(userId) !== -1;
                    const isAdmin = group.admins.indexOf(userId) !== -1;

                    if (isUser || isAssistant || isAdmin){
                        groupIds.push(group.id);
                    }
                });
                res.json({success: true, err: null, data: groupIds});
            }
        })
});

router.get("/create", (req, res) => {
    // create a new user
    
    const { username, email, password, role } = req.query;

    if (!(username && email && password && role)){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else if (!req.user.can("createRegUser")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else {
        let user = new User({
            username: username,
            password: password,
            email: email,
            role: role 
        });
        user.save((err, user) => {
            if (err) throw err;
            res.json({success: true, err: null, data: user});
        });
    }
});

router.get('/delete', (req, res) => {

    const { username } = req.query;

    if (!username){
        res.json({success: false, err: "Invalid parameters", data: null});
    } else if (!req.user.can("deleteUser")){
        res.json({success: false, err: "Insufficient permissions", data: null});
    } else {
        User.deleteOne({username: username}, (err) => {
            if (err) throw err;
            res.json({success: true, err: null, data: null});
        });
    }
});

router.get('/list', (req, res) => {
    User.find({}, (err, docs) => {
        res.json({success: Boolean(docs), err: err, data: docs});
    })
});

module.exports = router;