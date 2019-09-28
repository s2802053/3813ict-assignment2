# 3813ICT Assignment 1 Chat Client Api
## Sub-Routes
* [/User](#user)
* [/Client](#client)
* [/Group](#group)
* [/Channel](#channel)

___
# /User
___
# GET /user/getGroups
#### Retrieve a list of groups for a selected user
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
username: string – The username of the user to retrieve data for.
###### Returns 
@return {Success: Boolean, userId: string, data: [string]} <br>
___
# POST /user/authenticate
#### Validates the authentication credentials of a user
###### Parameters:
username: string – The username of the user to authenticate.<br>
###### Returns 
{ success: Boolean, err: string, data: obj }<br>
___
# POST /user/createUser
#### Creates a user in the chat client
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
username: string – The username to be created in the system.<br>
email: string – The email address for the user.<br>
role: string – The role of the user to be created.
###### Returns 
{ success: Boolean, err: string, data: null }<br>
___
# POST /user/deleteUser
#### Deletes a user from the chat client
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
username: string – The username to be created in the system.
###### Returns 
{ success: Boolean, err: string, data: null }<br>
___
# POST /user/list
#### Returns a list of user objects for all users 
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
###### Returns 
{ success: Boolean, err: string, data: [ obj ] }<br>
___
# /Client
___
# POST /client/createGroup
#### Creates a new group
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
groupId: string – The id of the group to create.
###### Returns 
{Success: Boolean, userId: string, data: null} <br>
___
# DELETE /client/deleteGroup
#### Deletes an existing group
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
groupId: string – The id of the group to delete.
###### Returns 
{Success: Boolean, userId: string, data: null} <br>
___
# /Group 
___
# POST /group/addUser
#### Add a user to a group 
###### Parameters: 
caller: string – The username of the authenticated user creating the request.<br> 
groupId: string – The id of the group to add a user to.<br>
username: string – The username of the user to be added to the group.
###### Returns:
{Success: Boolean, userId: string, data: null}<br>
___
# PUT /group/removeUser
#### Remove a user from a group
###### Parameters:
caller: string – The username of the authenticated user creating the request.<br>
groupId: string – The id of the group to remove a user from.<br>
username: string – The username of the user to be removed from the group.
###### Returns: 
{Success: Boolean, userId: string, data: null}<br>
___
# GET /group/getChannels
#### Retrieve a list of channel ids for a group.
###### Parameters:
caller: string – The username of the authenticated user creating the request.<br>
groupId: string – The id of the group to retrieve channel ids for.
###### Returns 
{Success: Boolean, userId: string, data: [ string ]} <br>
___
# POST /group/createChannel
#### Create a new channel within a group
###### Parameters:
caller: string – The username of the authenticated user creating the request.<br>
groupId: string – The id of the group to create a channel in.<br>
channelId: string – An id string for the channel to be created.
###### Returns 
{Success: Boolean, userId: string, data: null} <br>
___
# DELETE /group/deleteChannel
#### Delete a channel from a group
###### Parameters:
caller: string – The username of the authenticated user creating the request.<br>
groupId: string – The id of the group that contains the channel to be deleted.<br>
channelId: string – The id of the channel to be deleted.
###### Returns 
@return {Success: Boolean, userId: string, data: null} <br>
___
# /Channel
___
# GET /channel/getMessages
#### Retrieve message history of a channel
###### Parameters:
caller: string - The username of the authenticated user creating the request.<br>
groupId: string  - The id of the group containing the requested channel.<br>
channelId: string – The id of the channel to retrieve the message history for.
###### Returns 
{ success: boolean, err: string, data: [ { username: string, messageText: string, timestamp: string } ] }<br>
___
# POST /channel/addMessage
#### Adds a message to the message history of a channel
###### Parameters:
caller: string – The username of the authenticated user creating the request.<br>
groupId: string – The id of the group containing the channel to add the message to.<br>
channelId: string – The id of the channel to add the message to.<br>
username: string – The username of the user who sent the message.<br>
messageText: string – The text string of the message.
###### Returns
{ success: Boolean, err: string, data: null }<br>
___
# POST /channel/addUser
#### Adds a user to the channel
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
groupId: string – the id of the group that contains the channel to add the user to.<br>
channelId: string – the id of the channel to add the user to.<br>
username: string – the username to add to the channel.
###### Returns
{success: Boolean, err: string, data: null}<br>
___
# POST /channel/removeUser
#### Removes a user from the channel
###### Parameters:
caller: string – the username of the authenticated user creating the request.<br>
groupId: string – the id of the group that contains the channel to remove the user from.<br>
channelId: string – the id of the channel to remove the user from.<br>
username: string – the username of the user to remove from the channel.
###### Returns
{success: Boolean, err: string, data: null}<br>
___
