import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = createServer(app);

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // You can restrict this to specific origins for production, e.g., ['http://localhost:5174']
    methods: ['GET', 'POST'],
  }
});

// Middleware
app.use(cors());
app.use(json());

// In-memory user storage (For development only, replace with database for production)
let users = [];

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle user joining the chat
  socket.on('user:join', (user) => {
    // Add user to the list of online users
    const existingUser = users.find(u => u.id === user.id);
    if (!existingUser) {
      users.push({ ...user, socketId: socket.id, online: true });
      console.log(`${user.name} joined the chat`);
    }

    // Emit the updated users list
    io.emit('users', users);

    // Send a welcome message to the newly joined user
    socket.emit('message', {
      id: Date.now().toString(),
      senderId: 'system',
      receiverId: user.id,
      content: 'Welcome to the chat!',
      timestamp: Date.now(),
    });
  });

  // Handle incoming messages
  socket.on('message:send', (message) => {
    console.log(`Received message from ${message.senderId}: ${message.content}`);

    // Find the receiver's socket ID
    const receiverSocket = users.find(user => user.id === message.receiverId)?.socketId;
    if (receiverSocket) {
      // Emit the message to the receiver
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

  // Handle user explicitly leaving the chat
  socket.on('user:leave', (userId) => {
    console.log(`User ${userId} left the chat`);

    // Remove user from the list
    users = users.filter(user => user.id !== userId);
    io.emit('users', users);
  });
});

// A simple test route
app.get('/', (req, res) => {
  res.send('Chat Server is Running');
});

// Start the server
const PORT = process.env.PORT || 5000;
/* global process */server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
