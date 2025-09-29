// server/index.ts

import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'url';

const wss = new WebSocketServer({ port: 8080 });

// A Map to store clients based on their workspaceId
// Key: workspaceId (string), Value: Set of connected WebSockets
const rooms = new Map<string, Set<WebSocket>>();

console.log('WebSocket server started on port 8080');

wss.on('connection', (ws, req) => {
  // Extract workspaceId from the connection URL, e.g., ws://localhost:8080?workspaceId=123
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const workspaceId = url.searchParams.get('workspaceId');

  if (!workspaceId) {
    console.log('Connection rejected: No workspaceId provided.');
    ws.close();
    return;
  }

  // If the room doesn't exist, create it
  if (!rooms.has(workspaceId)) {
    rooms.set(workspaceId, new Set());
  }

  // Add the new client to the room
  rooms.get(workspaceId)!.add(ws);
  console.log(`Client connected to workspace: ${workspaceId}`);

  ws.on('message', (message) => {
    const room = rooms.get(workspaceId);
    if (room) {
      // Broadcast the message ONLY to other clients in the same room
      room.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    }
  });

  ws.on('close', () => {
    const room = rooms.get(workspaceId);
    if (room) {
      // Remove the client from the room when they disconnect
      room.delete(ws);
      console.log(`Client disconnected from workspace: ${workspaceId}`);
      // If the room is empty, delete it to save memory
      if (room.size === 0) {
        rooms.delete(workspaceId);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});