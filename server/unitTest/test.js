const assert = require('assert'); //link in assertion library

const SuperAdmin = require(__dirname + '\\..\\models\\user-model\\SuperAdmin');
const GroupAdmin = require(__dirname + '\\..\\models\\user-model\\GroupAdmin');
const User = require(__dirname + '\\..\\models\\user-model\\User');

const user = new User(null, 'user', 'email@email.com');
const superAdmin = new SuperAdmin(null, 'super', 'email@email.com');
const groupAdmin = new GroupAdmin(null, 'group', 'email@email.com');

describe('Tests for SuperAdmin', () => {
    describe('Test Case 1 for SuperAdmin',() => {
        it('should be able to create a super admin', () => {
            assert.equal(superAdmin.can("createSuperAdmin"), true);
        });
    });
    describe('Test Case 2 for SuperAdmin', () => {
        it('should be able to create a group admin', () => {
            assert.equal(superAdmin.can("createGroupAdmin"), true);
        });
    });
});

describe('Tests for GroupAdmin', () => {
    describe('Test Case 1 for SuperAdmin',() => {
        it('should be allowed to create a regular user', () => {
            assert.equal(groupAdmin.can("createRegUser"), true);
        });
    });
    describe('Test Case 2 for GroupAdmin', () => {
        it('should not be allowed to create a group admin', () => {
            assert.equal(groupAdmin.can("createGroupAdmin"), false);
        });
    });
});

describe('Tests for User', () => {
    describe('Test Case 1 for User',() => {
        it('should be able to add a message to a channel', () => {
            assert.equal(user.can("addMessage"), true);
        });
    });
    describe('Test Case 2 for User', () => {
        it('should not be able to add a user to a channel', () => {
            assert.equal(user.can("addUserToChannel"), false);
        });
    });
});