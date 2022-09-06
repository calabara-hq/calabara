let io;

const socketConnection = (server) => {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.info(`Client connected [id=${socket.id}]`);

        socket.on('subscribe', (room, callback) => {
            // add subscription
            console.info(`Client joining [room=${room}]`);
            socket.join(room)

            callback();
        })

        socket.on('disconnect', () => {
            console.info(`Client disconnected [id=${socket.id}]`);
        })

        /*
        console.info(`Client connected [id=${socket.id}]`);
        socket.on('disconnect', () => {
            console.info(`Client disconnected [id=${socket.id}]`);
        });
        */
    });
};

const sendSocketMessage = (room, key, message) => io.to(room).emit(key, message);



module.exports = { socketConnection, sendSocketMessage }