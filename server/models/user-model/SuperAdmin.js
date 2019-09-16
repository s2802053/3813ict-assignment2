const User = require('./User');

module.exports = class SuperAdmin extends User {
    // A user with superAdmin role

    constructor(jsonObject, username, email){
        super(jsonObject, username, email);
        
        // overwrite permissions
        this.permissions = {
            // client methods
            createSuperAdmin: true,
            createGroupAdmin: true,
            createRegUser: true,
            deleteUser: true,
            createGroup: true,
            deleteGroup: true,

            // group methods
            addUserToGroup: true,
            removeUserFromGroup: true,
            createChannel: true,
            deleteChannel: true,

            // channel methods
            addMessage: true,
            addUserToChannel: true,

            // user methods
            getUsers: true
        }
        this.isGroupAdmin = false;
        this.isSuperAdmin = true;
    }

}