import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws'; // Use this named import

// Creating an Express app
const app = express();

// Creating an HTTP server using Express app
const server = http.createServer(app);

// Creating WebSocket server instance using the WebSocketServer
const wss = new WebSocketServer({ server });

// Basic API route
app.get('/', (req, res) => {
  res.send('Welcome to the chat app!');
});

// Real-time chat functionality using WebSockets
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all connected clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Listen for when a client disconnects
  ws.on('close', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
