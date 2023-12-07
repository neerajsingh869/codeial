module.exports.chatSockets = function(socketServer) {
    const io = require('socket.io')(socketServer);

    // observer gets request and then emit it back to subscriber
    io.sockets.on('connection', (socket) => {
        console.log('new connection received', socket.id);

        socket.on('disconnect', () => {
            console.log('socket disconnected!');
        });

        socket.on('join_room', (data) => {
            console.log('joining request received ', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        socket.on('send_message', (data) => {
            io.in(data.chatroom).emit('receive_message', data);
        })
    });
}