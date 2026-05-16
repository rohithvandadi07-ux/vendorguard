import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// We will implement these next
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanVendor from './pages/ScanVendor';
import ScanHistory from './pages/ScanHistory';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protect these routes in a real app, for now just wrap in Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan" element={<ScanVendor />} />
          <Route path="history" element={<ScanHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
