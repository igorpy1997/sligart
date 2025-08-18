// frontend/sligart-ui/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApiTest from './components/ApiTest';
import PortfolioAdmin from './components/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ApiTest />} />
          <Route path="/admin/*" element={<PortfolioAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;