import express from 'express';
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
app.use(express.json());

let users = [];

const handleUserJoin = async (socket, user) => {
  try {
    const existingUser = users.find(u => u.id === user.id);

    if (!existingUser) {
      users = [...users, { ...user, socketId: socket.id, online: true }];
      console.log(`${user.name} joined the chat`);
    }

    io.emit('users', users);

    socket.emit('message', {
      id: `${Date.now()}`,
      senderId: 'system',
      receiverId: user.id,
      content: 'Welcome to the chat!',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error handling user join:', error);
  }
};


const handleMessageSend = (message) => {
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
};

const handleUserDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`);

  const disconnectedUser = users.find(user => user.socketId === socket.id);
  if (disconnectedUser) {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('users', users);
    console.log(`${disconnectedUser.name} left the chat`);
  }
};

const handleUserLeave = (userId) => {
  console.log(`User ${userId} left the chat`);

  users = users.filter(user => user.id !== userId);
  io.emit('users', users);
};

const initializeSocketEvents = (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('user:join', (user) => handleUserJoin(socket, user));
  socket.on('message:send', handleMessageSend);
  socket.on('disconnect', () => handleUserDisconnect(socket));
  socket.on('user:leave', handleUserLeave);
};

io.on('connection', initializeSocketEvents);

app.get('/', (req, res) => {
  res.send('Chat Server is Running');
});

const PORT = process.env.PORT || 5000;
/* global process */
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
