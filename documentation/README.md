## Git
The git repository for the assignment is located at http://github.com/s2802053/3813ict-assignment2.
The repository consists of the assignment2 directory containing source code for the angular front end, the server directory containing the node.js backend of the application, and the documentation directory which contains the documentation files associated with the project in markdown format.
As there was only a single contributor to the project, branching was deemed to be unnecessary. Regular commits were made to the master repository as changes were made to code and features were added or extended. If errors appeared when code was run, the file where the error occurred was noted and the commit history of the file checked to review where the error was likely to have been introduced. Additionally, the remote repository was used to synchronise the project while developing over several workstations.

## Data Structure
![Assignment 2 Class Diagram](https://i.imgur.com/3Mv4OA9.png)

## Angular

The front end of the application was kept as lightweight as possible. No real model was implemented bar interfaces for api responses. A service was implemented to abstract a the socket implementation, exposing only necessary behaviours to be accessed by components. 

A login component handles user authentication. A text input retrieves a username from the user which is validated by the server. If the login credential is valid, the application redirects to the chat-client component.

The chat-client component retrieves and displays view components for an array of groups the logged-in user is a member of. When a group is selected, channels belonging to the group which the user is authorised to view are displayed. When a channel is selected, the message history of the channel is retrieved and displayed. Input options are presented to group and super admins which allows them to perform administerial tasks such as adding and removing users from groups and creating and deleting channels, groups and users. I intended to abstract the functionality required for the chat-client into individual components, however as the project was not architected in this manner from its inception, the work required to convert the project to a componenent-based architecture became too great to accomplish within the given timeframe. As a result, the complexity of this component was greater than desired at project completion. 

Additionally, as part of assignment 2 the chat functionality was implemented through sockets.io. When a user clicks on a channel, a request is sent to the api to retrieve the message history for the channel. If the request is successful, the message history is added to the contents of the messages class then a socket connection is established to the namespace of the channel id. The socket broadcasts a message sent by a user to all connected users of the channel, so that the message-history updates in real time. 

Finally, a session-based user authentication system was implemented on the server-side which sets a client-side cookie upon successful authentication. Because http is a stateless protocol, a request cannot rely on a previous request, thus the client must identify itself on each request. This is done by setting a client-side cookie which is automatically attached to each request and used by the server to connect the client to a session.

## State change
The client sends a http request to the server, for example to the /api/client/createGroup route to create a group, along with several data parameters which are required by the server to perform an action. The route handler on the server validates the parameters sent by the request, parses the chat client data structure from a json file, and calls the relevant method on the chat client object, passing in the data parameters. The method performs its actions and returns a status code to the route handler describing the outcome of the operation (whether it was successful, why it was unsuccessful). If the operation was successful, the route handler stores the updated chat client back in a json storage file and returns a json response to the client. The client evaluates the response to determine whether the intended action was performed successfully and then redraws any affected view components to reflect changes to the model.
