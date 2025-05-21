const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let queueStatus = {
  canteen: 0,
  feeCounter: 0,
  stationary: 0,
};

const orders = [];

// When a client connects
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current queue status to client
  socket.emit('queueUpdate', queueStatus);

  // Handle queue increment requests
  socket.on('incrementQueue', (service) => {
    if (queueStatus[service] !== undefined) {
      queueStatus[service]++;
      const order = {
        id: Date.now(), // Unique timestamp ID
        service,
        timestamp: new Date().toLocaleString(),
      };
      orders.push(order); // Save order
      console.log(`New order added:`, order);

      // Broadcast updated queue status and orders to all clients
      io.emit('queueUpdate', queueStatus);
      io.emit('orderUpdate', orders);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
