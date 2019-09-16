const router = require('express').Router();

const auth = require('./api/auth');
const user = require('./api/user');
const group = require('./api/group');
const channel = require('./api/channel');

const addUserObject = require(__dirname + '/../middleware/addUserObject');
const checkLogin = require(__dirname + '/../middleware/checkLogin');

router.use('/auth', auth);
router.use('/user', checkLogin, addUserObject, user);
router.use('/group', checkLogin, addUserObject, group);
router.use('/channel', checkLogin, addUserObject, channel);


module.exports = router;