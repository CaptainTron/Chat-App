const express = require('express');
const app = express();


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Socket Module 
// const server = require('http').Server(app);
// const io = require('socket.io')(app)
app.use(express.static('public'))
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client.html');
// });
let ActiveUsers = [];
io.on('connection', (socket) => {
  socket.on('Chat Message', (msg)=>{
    socket.broadcast.emit('Msg',{Msg: msg, From: socket.username});
    console.log(`${socket.username}: `, msg);
    socket.emit("ActiveUsers",ActiveUsers);
  });
  socket.on("UserConnected",(User)=>{
    socket.username = User;
    ActiveUsers.push(User)
    console.log(ActiveUsers);
    socket.broadcast.emit("UserConnect",User);
    socket.broadcast.emit("ActiveUsers",ActiveUsers);
  })
  socket.on('disconnect',()=>{
    ActiveUsers = ActiveUsers.filter(user => user!=socket.username)
    console.log(ActiveUsers)
    console.log(socket.username, "Disconneted From: ", socket.id);
    socket.broadcast.emit('Leave', socket.username);
    socket.broadcast.emit('ActiveUsers', ActiveUsers);
  })
  socket.on("Typing",()=>{
    socket.broadcast.emit("UserTyping",socket.username);
    console.log(socket.username,'is Typing...');
  })
});

server.listen(3000, () => {
  console.log('listening on 3000...');
});