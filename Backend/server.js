const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const noteRoutes = require('./routes/noteRoutes');
const socketController = require('./controllers/socketController');
const cors = require('cors'); // Add this line

const app = express();
const server = http.createServer(app);

// Configure CORS for Express (regular HTTP routes)
app.use(cors({
  origin: '*', // Or specify your frontend URL like 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());

// Routes
app.use('/', noteRoutes);

// Socket.io
socketController(io);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/notesapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});