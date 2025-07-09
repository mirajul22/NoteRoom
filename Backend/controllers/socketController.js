const Note = require('../models/Note');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join_note', async (noteId) => {
      socket.join(noteId);
      
      // Notify others about new user
      socket.to(noteId).emit('user_joined');
      
      // Send current active users count (simple version)
      const clients = await io.in(noteId).allSockets();
      io.to(noteId).emit('active_users', { count: clients.size });
      
      // Send initial note data
      const note = await Note.findById(noteId);
      socket.emit('note_data', note);
    });
    
    socket.on('note_update', async ({ noteId, content }) => {
      // Update in database
      const note = await Note.findByIdAndUpdate(
        noteId,
        { content, updatedAt: Date.now() },
        { new: true }
      );
      
      // Broadcast to all clients in the room except sender
      socket.to(noteId).emit('note_updated', note);
    });
    
    socket.on('disconnect', async () => {
      // Notify all rooms this socket was in about the disconnection
      const rooms = Array.from(socket.rooms);
      rooms.forEach(async (room) => {
        if (room !== socket.id) { // Skip the default room (socket's own ID)
          const clients = await io.in(room).allSockets();
          io.to(room).emit('active_users', { count: clients.size });
        }
      });
    });
  });
};