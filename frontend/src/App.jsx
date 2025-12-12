import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Prevention from './pages/Prevention';
import Threats from './pages/Threats';
import Simulation from './pages/Simulation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="prevention" element={<Prevention />} />
        <Route path="threats" element={<Threats />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
