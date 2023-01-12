import { io } from "socket.io-client";

let socket

export const initializeSocketConnection = () => {
    socket = io();
    console.log('Connecting to socket ...')
}

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
}

export { socket }