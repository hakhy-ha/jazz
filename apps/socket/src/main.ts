import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

app.use(cors({ origin: true, credentials: true }));
app.get('/', (_req, res) => res.send({ status: 'Jazz socket server running' }));

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
});

const activeUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('register', ({ userId }: { userId: string }) => {
    if (userId) {
      activeUsers.set(userId, socket.id);
      socket.data.userId = userId;
    }
  });

  socket.on('chat:message', async (payload: { to: string; message: string; senderId: string }) => {
    const targetSocketId = activeUsers.get(payload.to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('chat:message', payload);
    }
  });

  socket.on('notification', async (payload: { to: string; type: string; data: unknown }) => {
    const targetSocketId = activeUsers.get(payload.to);
    await prisma.notification.create({
      data: {
        userId: payload.to,
        type: payload.type as any,
        payload: payload.data as any
      }
    });
    if (targetSocketId) {
      io.to(targetSocketId).emit('notification', payload);
    }
  });

  socket.on('webrtc:offer', ({ to, offer }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc:offer', { from: socket.data.userId, offer });
    }
  });

  socket.on('webrtc:answer', ({ to, answer }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc:answer', { from: socket.data.userId, answer });
    }
  });

  socket.on('webrtc:ice-candidate', ({ to, candidate }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc:ice-candidate', { from: socket.data.userId, candidate });
    }
  });

  socket.on('disconnect', () => {
    if (socket.data.userId) {
      activeUsers.delete(socket.data.userId);
      // Broadcast offline status if needed
    }
  });

  // WhatsApp-style typing and read receipts
  socket.on('typing', ({ to }: { to: string }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('typing', { from: socket.data.userId });
    }
  });

  socket.on('stopTyping', ({ to }: { to: string }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('stopTyping', { from: socket.data.userId });
    }
  });

  socket.on('message:read', ({ to, messageId }: { to: string; messageId: string }) => {
    const targetSocketId = activeUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('message:read', { from: socket.data.userId, messageId });
    }
  });
});

const port = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 5001;
server.listen(port, () => {
  console.log(`Socket server listening on port ${port}`);
});
