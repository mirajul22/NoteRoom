import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import UserStatus from './UserStatus';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function NoteEditor({ noteId }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);
  const socketRef = useRef();
  const saveIntervalRef = useRef();
  const lastSavedRef = useRef('');

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    
    // Fetch initial note data
    const fetchNote = async () => {
      const response = await fetch(`http://localhost:5000/notes/${noteId}`);
      const note = await response.json();
      setContent(note.content);
      setTitle(note.title);
      setUpdatedAt(new Date(note.updatedAt).toLocaleString());
      lastSavedRef.current = note.content;
    };
    
    fetchNote();

    // Set up socket events
    socketRef.current.emit('join_note', noteId);
    
    socketRef.current.on('note_updated', (note) => {
      if (note.content !== content) {
        setContent(note.content);
        setUpdatedAt(new Date(note.updatedAt).toLocaleString());
        lastSavedRef.current = note.content;
      }
    });
    
    socketRef.current.on('active_users', ({ count }) => {
      setActiveUsers(count);
    });

    // Set up auto-save (fallback)
    saveIntervalRef.current = setInterval(() => {
      if (content !== lastSavedRef.current) {
        saveNote();
      }
    }, 10000); // 10 seconds

    return () => {
      // Clean up on unmount
      socketRef.current.disconnect();
      clearInterval(saveIntervalRef.current);
    };
  }, [noteId]);

  const saveNote = async () => {
    if (content === lastSavedRef.current) return;
    
    try {
      // Optimistically update locally
      const newUpdatedAt = new Date().toISOString();
      setUpdatedAt(new Date(newUpdatedAt).toLocaleString());
      lastSavedRef.current = content;
      
      // Send via WebSocket (primary)
      socketRef.current.emit('note_update', { noteId, content });
      
      // Fallback to HTTP if needed
      await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Debounced socket update for real-time collaboration
    clearTimeout(saveIntervalRef.current);
    saveIntervalRef.current = setTimeout(() => {
      if (newContent !== lastSavedRef.current) {
        socketRef.current.emit('note_update', { noteId, content: newContent });
      }
    }, 500);
  };

  return (
    <div className="note-editor">
      <h2>{title}</h2>
      <UserStatus activeUsers={activeUsers} updatedAt={updatedAt} />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing here..."
      />
    </div>
  );
}

export default NoteEditor;