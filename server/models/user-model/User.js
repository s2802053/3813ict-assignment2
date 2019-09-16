module.exports = class User{
    // A user of the chat client

    constructor(jsonObject, username, email){
        if (jsonObject){
            // deserialise
            this.username = jsonObject.username;
            this.email = jsonObject.email;
        } else {
            this.username = username;
            this.email = email;
        }
        // set default permissions
        this.permissions = {
            createSuperAdmin: false,
            createGroupAdmin: false,
            createUser: false,
            deleteUser: false,
            createGroup: false,
            deleteGroup: false,

            // group methods
            addUserToGroup: false,
            removeUserFromGroup: false,
            createChannel: false,
            deleteChannel: false,

            // channel methods
            addMessage: true,
            addUserToChannel: false,

            // user methods
            getUser: false
        }
        this.isGroupAdmin = false;
        this.isSuperAdmin = false;

    }

    userDetails(){
        // returns an object containing user
        // details for this user
        return {
            username: this.username,
            email: this.email,
            isGroupAdmin: this.isGroupAdmin,
            isSuperAdmin: this.isSuperAdmin
        }
    }

    testPassword(pw){
        // returns a boolean indicating if a
        // provided password is a match
        return this.password === pw;
    }

    json(){
        return {
            username: this.username,
            email: this.email,
            isGroupAdmin: this.isGroupAdmin,
            isSuperAdmin: this.isSuperAdmin
        };
    }

    can(action){
        return this.permissions[action];
    }
}