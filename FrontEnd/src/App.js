import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNotePage from './pages/CreateNotePage';
import NotePage from './pages/NotePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateNotePage />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes>
    </Router>
  );
}

export default App;