// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server with CORS settings
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory queue status (for demonstration purposes)
let queueStatus = {
  canteen: 0,
  fee_counter: 0,
  stationary: 0,
};

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle 'joinQueue' event
  socket.on('joinQueue', ({ service }) => {
    if (queueStatus.hasOwnProperty(service)) {
      queueStatus[service] += 1;

      // Emit updated queue status to all connected clients
      io.emit('queueUpdate', {
        service,
        queue: queueStatus[service],
      });

      console.log(`Updated ${service} queue: ${queueStatus[service]}`);
    } else {
      console.error(`Unknown service: ${service}`);
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log('Socket.IO server running at http://localhost:3001');
});
