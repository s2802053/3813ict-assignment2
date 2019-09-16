const router = require('express').Router();
const mongoose = require('mongoose');
require('../../models/models');
const User = mongoose.model('user');

router.get('/login', (req, res) => {
    const { username, password } = req.query;

    User.findOne({username: username}, (err, doc) => {
        if (err){
            res.json({success: false, err: err, data: null});
        }
        if (doc.password === password){
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

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({success: false, err: err, data: null});
        } else {
            res.json({success: true, err: null, data: null});
        }
    });
});

module.exports = router;