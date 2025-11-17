// server/index.ts

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// 1. Setup the server
const app = express();
app.use(cors()); // Allow requests from your Next.js app

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"],
  },
});

// A simple map to store which users are in which rooms
const roomOccupants = new Map<string, string[]>();

// 2. Define Socket.IO events
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Event: When a user joins a room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    
    // Add user to our occupants map (we'll use socket.id for now)
    const occupants = roomOccupants.get(roomId) || [];
    occupants.push(socket.id);
    roomOccupants.set(roomId, occupants);

    console.log(`Socket ${socket.id} joined room ${roomId}`);
    
    // Tell EVERYONE in the room (including sender) who is in there
    io.in(roomId).emit('update-occupants', occupants);
  });

  // Event: When a user changes the code
  socket.on('code-change', (roomId: string, newCode: string) => {
    // Broadcast the change to EVERYONE ELSE in the room
    socket.to(roomId).emit('receive-code', newCode);
  });

  // Event: When a user disconnects
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Clean up from roomOccupants map
    roomOccupants.forEach((occupants, roomId) => {
      const index = occupants.indexOf(socket.id);
      if (index > -1) {
        occupants.splice(index, 1);
        roomOccupants.set(roomId, occupants);
        // Tell everyone the user left
        io.in(roomId).emit('update-occupants', occupants);
      }
    });
  });
});

// 3. Start the server
const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});