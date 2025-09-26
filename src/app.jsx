import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import ModelDashboard from '@/components/ModelDashboard';
import UserDashboard from '@/components/UserDashboard';
import CallPage from '@/components/CallPage';
import HomePage from '@/pages/HomePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callDetails, setCallDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'model':
        navigate('/model');
        break;
      case 'user':
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCallDetails(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleStartCall = (model, duration) => {
    setCallDetails({ model, duration });
    navigate('/call');
  };

  const handleEndCall = () => {
    setCallDetails(null);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Online Fun Service - Video Chat Platform</title>
        <meta name="description" content="Make Friends, Video Call, Fun, Real Meeting" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            {currentUser?.role === 'user' && (
              <>
                <Route path="/dashboard" element={<UserDashboard user={currentUser} onLogout={handleLogout} onStartCall={handleStartCall} />} />
                <Route path="/call" element={<CallPage user={currentUser} model={callDetails?.model} duration={callDetails?.duration} onEndCall={handleEndCall} />} />
              </>
            )}
            
            {currentUser?.role === 'admin' && (
              <Route path="/admin" element={<AdminDashboard user={currentUser} onLogout={handleLogout} />} />
            )}

            {currentUser?.role === 'model' && (
              <Route path="/model" element={<ModelDashboard user={currentUser} onLogout={handleLogout} />} />
            )}
          </Routes>
        </AnimatePresence>
        <Toaster />
      </div>
    </>
  );
}

export default App;
