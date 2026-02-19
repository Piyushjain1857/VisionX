import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatFloatingWidget from './components/ChatFloatingWidget';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import FarmerProfile from './pages/FarmerProfile';
import LandDetails from './pages/LandDetails';
import CropDetails from './pages/CropDetails';
import PastHistory from './pages/PastHistory';
import Dashboard from './pages/Dashboard';
import AdminFarmers from './pages/AdminFarmers';
import AdminBroadcast from './pages/AdminBroadcast';
import FarmerChatbot from './pages/FarmerChatbot';
import DiscussionHistory from './pages/DiscussionHistory';
import Notifications from './pages/Notifications';
import ActionPlan from './pages/ActionPlan';

import './index.css';
import './i18n';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const showSidebar = token && !['/login', '/signup'].includes(location.pathname);
  const showChatWidget = token;

  return (
    <>
      <Navbar />
      <div className="app-layout">
        {showSidebar && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><FarmerProfile /></PrivateRoute>} />
            <Route path="/land" element={<PrivateRoute><LandDetails /></PrivateRoute>} />
            <Route path="/crops" element={<PrivateRoute><CropDetails /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><PastHistory /></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><FarmerChatbot /></PrivateRoute>} />
            <Route path="/discussions" element={<PrivateRoute><DiscussionHistory /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/action-plan" element={<PrivateRoute><ActionPlan /></PrivateRoute>} />

            <Route path="/admin/farmers" element={<PrivateRoute><AdminFarmers /></PrivateRoute>} />
            <Route path="/admin/broadcast" element={<PrivateRoute><AdminBroadcast /></PrivateRoute>} />
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
      {showChatWidget && <ChatFloatingWidget />}
    </>
  );
}

export default App;
