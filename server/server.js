const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
let io = require('socket.io')(http);
io = require(__dirname + '/sockets/addNamespaceForChannels')(io);
const api_route = require('./routes/routeHandler');

mongoose.connect('mongodb://localhost:27017/chat-client', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: "s2802053-3813ict",
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        //sameSite: true
    }
}));
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(bodyParser.json());

// add a reference to the io object to each request
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api', api_route);



http.listen(3000, () => {
    console.log("Server listening on port 3000");
});

module.exports = http;