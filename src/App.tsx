import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Calendar from './components/Calendar/Calendar';
import LectureDetail from './components/LectureDetail/LectureDetail';
import React from 'react';

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