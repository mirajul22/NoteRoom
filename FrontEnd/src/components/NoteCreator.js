import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NoteCreator() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const note = await response.json();
    navigate(`/note/${note._id}`);
  };

  return (
    <div className="note-creator">
      <h1>Create a New Note</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NoteCreator;