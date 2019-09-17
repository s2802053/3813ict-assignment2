const router = require('express').Router();
const mongoose = require('mongoose');
require('../../models/models');
const User = mongoose.model('user');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({username: username}, (err, doc) => {
        if (err){
            res.json({success: false, err: err, data: null});
        } else if (!doc){
            res.json({success: false, err: "Invalid credentials", data: null});
        } else if (!(doc.password === password)){
            res.json({success: false, err: "Invalid credentials", data: null});
        } else {
            const data = { 
                id: doc.id,
                username: doc.username,
                email: doc.email,
                role: doc.role
             };
            req.session.user = data;
            res.json({success: true, err: null, data: data});
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({success: false, err: err, data: null});
        } else {
            res.json({success: true, err: null, data: null});
        }
    });
});
module.exports = router;