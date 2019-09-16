const User = require('./User');

module.exports = class GroupAdmin extends User {
    // A user with groupAdmin role

    constructor(jsonObject, username, email){
        super(jsonObject, username, email);
        
        // overwrite permissions
        this.permissions = {
            // client methods
            createSuperAdmin: false,
            createGroupAdmin: false,
            createRegUser: true,
            deleteUser: false,
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
            getUser: false, 
        }
        this.isGroupAdmin = true;
        this.isSuperAdmin = false;
    }

}