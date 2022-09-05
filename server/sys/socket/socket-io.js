let io;

const socketConnection = (server) => {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.info(`Client connected [id=${socket.id}]`);
        socket.on('disconnect', () => {
            console.info(`Client disconnected [id=${socket.id}]`);
        });
    });
};

const sendSocketMessage = (key, message) => io.emit(key, message);



module.exports = { socketConnection, sendSocketMessage }