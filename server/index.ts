// server/index.ts

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// --- Define a type for our user ---
interface TeamMember {
  id: string; // The socket.id
  username: string;
}

const app = express();
app.use(cors());

const httpServer = createServer(app);

// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      "http://localhost:3000", 
      "http://localhost:3001",
      "https://codestreampro.vercel.app", // Add your Vercel domain
      /\.vercel\.app$/ // Allow all Vercel preview deployments
    ];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- THIS IS THE MAIN CHANGE ---
// We now store a list of TeamMember objects for each room
const roomOccupants = new Map<string, TeamMember[]>();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // --- UPDATED EVENT ---
  // We now expect a 'username' when joining
  socket.on('join-room', (roomId: string, username: string) => {
    socket.join(roomId);

    const newUser: TeamMember = { id: socket.id, username: username };
    const members = roomOccupants.get(roomId) || [];
    members.push(newUser);
    roomOccupants.set(roomId, members);

    console.log(`Socket ${socket.id} (${username}) joined room ${roomId}`);

    // --- NEW EVENT NAME ---
    // Tell EVERYONE in the room (including sender) the new team list
    io.in(roomId).emit('update-team-list', members);
  });

  socket.on('code-change', (roomId: string, newCode: string) => {
    socket.to(roomId).emit('receive-code', newCode);
  });

  // --- UPDATED DISCONNECT LOGIC ---
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Clean up from roomOccupants map
    roomOccupants.forEach((members, roomId) => {
      // Find the index of the disconnected user
      const index = members.findIndex((member) => member.id === socket.id);

      if (index > -1) {
        members.splice(index, 1); // Remove them from the list
        roomOccupants.set(roomId, members);

        // Tell everyone in that room the new list
        io.in(roomId).emit('update-team-list', members);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});