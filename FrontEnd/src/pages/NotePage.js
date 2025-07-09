import React from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '../components/NoteEditor';

function NotePage() {
  const { id } = useParams();
  
  return (
    <div className="page">
      <NoteEditor noteId={id} />
    </div>
  );
}

export default NotePage;