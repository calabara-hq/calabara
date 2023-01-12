const logger = require('../../logger').child({ service: 'socket' })
let io;

const socketConnection = (server) => {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        logger.log({ level: 'info', message: `Client connected [id=${socket.id}]` })


        socket.on('user-subscribe', (room) => {
            // add subscription
            logger.log({ level: 'info', message: `Client joining [room=${room}]` })
            socket.join(room)
        })

        socket.on('contest-subscribe', (room) => {
            // add subscription
            logger.log({ level: 'info', message: `Client joining [room=${room}]` })
            socket.join(room)
        })

        socket.on('user-contest-subscribe', (room) => {
            // add subscription
            logger.log({ level: 'info', message: `Client joining [room=${room}]` })
            socket.join(room)
        })



        socket.on('disconnect', () => {
            logger.log({ level: 'info', message: `Client disconnected [id=${socket.id}]` })
        })

    });
};

const sendSocketMessage = (room, key, message) => io.sockets.to(room).emit(key, message);



module.exports = { socketConnection, sendSocketMessage }