import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userData) => {
    connectedUsers.set(socket.id, {
      ...userData,
      socketId: socket.id,
      status: 'online'
    });
    
    // Broadcast user list update
    io.emit('users_update', Array.from(connectedUsers.values()));
  });

  // Handle task updates
  socket.on('task_updated', (data) => {
    // Broadcast task update to all users in the project
    socket.broadcast.emit('task_updated', data);
  });

  // Handle project updates
  socket.on('project_updated', (data) => {
    socket.broadcast.emit('project_updated', data);
  });

  // Handle new comments
  socket.on('comment_added', (data) => {
    socket.broadcast.emit('comment_added', data);
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.broadcast.emit('typing_start', data);
  });

  socket.on('typing_stop', (data) => {
    socket.broadcast.emit('typing_stop', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('users_update', Array.from(connectedUsers.values()));
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users/online', (req, res) => {
  res.json(Array.from(connectedUsers.values()));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});