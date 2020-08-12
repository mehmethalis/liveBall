const socketio = require('socket.io');
const io = socketio();

const randomColor = require('../helpers/randomColor');

const socketApi = {};
socketApi.io = io;
const users = {};

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: { x: 0, y: 0 },
            color: randomColor()
        }

        const userData = Object.assign(data, defaultData);
        users[socket.id] = userData;
        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });

    socket.on('animate', (data) => {
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        socket.broadcast.emit('animate', { socketId: socket.id, x: data.x, y: data.y });

    });

    socket.on('newMessage', (data) => {
        const messageData = Object.assign(data, { socketId: socket.id });
        socket.broadcast.emit('newMessage', messageData);
    });

});

module.exports = socketApi;