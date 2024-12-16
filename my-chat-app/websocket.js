import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});


app.use(cors());
app.use(json());


let users = [];


io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('user:join', (user) => {
   
    const existingUser = users.find(u => u.id === user.id);
    if (!existingUser) {
      users.push({ ...user, socketId: socket.id, online: true });
      console.log(`${user.name} joined the chat`);
    }

    io.emit('users', users);

    socket.emit('message', {
      id: Date.now().toString(),
      senderId: 'system',
      receiverId: user.id,
      content: 'Welcome to the chat!',
      timestamp: Date.now(),
    });
  });


  socket.on('message:send', (message) => {
    console.log(`Received message from ${message.senderId}: ${message.content}`);

    const receiverSocket = users.find(user => user.id === message.receiverId)?.socketId;
    if (receiverSocket) {
     
      io.to(receiverSocket).emit('message', {
        ...message,
        timestamp: Date.now(),
      });
    } else {
      console.log(`Receiver not found: ${message.receiverId}`);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from the users list
    const disconnectedUser = users.find(user => user.socketId === socket.id);
    if (disconnectedUser) {
      users = users.filter(user => user.socketId !== socket.id);
      io.emit('users', users);
      console.log(`${disconnectedUser.name} left the chat`);
    }
  });


  socket.on('user:leave', (userId) => {
    console.log(`User ${userId} left the chat`);


    users = users.filter(user => user.id !== userId);
    io.emit('users', users);
  });
});


app.get('/', (req, res) => {
  res.send('Chat Server is Running');
});

const PORT = process.env.PORT || 5000;
/* global process */server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
