import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar/Calendar';
import LectureDetail from './components/LectureDetail/LectureDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/lecture/:id" element={<LectureDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;