module.exports = function(io, id){
    const namespace = io.of('/' + id);
    namespace.on('connection', (socket) => {
        // emit a user-joined event with the joining user's name
        namespace.emit('user-joined', socket.request._query.user);
        socket.on('message', (data) => {
            namespace.emit('message', data);
        });
    });
    return io;
}