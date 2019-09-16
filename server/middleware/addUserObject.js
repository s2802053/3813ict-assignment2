const User = require('../models/user-model/User');
const GroupAdmin = require('../models/user-model/GroupAdmin');
const SuperAdmin = require('../models/user-model/SuperAdmin');

module.exports = (req, res, next) => {
    const { user } = req.session;
    const { id, username, email, role } = user;
    let userObject;
    switch (role){
        case 0:
            userObject = new SuperAdmin(null, username, email);
            break;
        case 1:
            userObject = new GroupAdmin(null, username, email);
            break;
        case 2:
            userObject = new User(null, username, email);
            break;
        default:
            console.log("User role not found");
    }
    req.user = userObject;
    next();  
}