import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { LogOut, Users, UserCheck, Eye, CheckCircle, XCircle, Crown } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalModels: 0,
    pendingApprovals: 0,
    onlineModels: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
    
    setStats({
      totalUsers: allUsers.filter(u => u.role === 'user').length,
      totalModels: allUsers.filter(u => u.role === 'model').length,
      pendingApprovals: allUsers.filter(u => u.role === 'model' && !u.approved).length,
      onlineModels: allUsers.filter(u => u.role === 'model' && u.online).length
    });
  };

  const approveModel = (modelId) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(u => 
      u.id === modelId ? { ...u, approved: true } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
    toast({
      title: "মডেল অনুমোদিত!",
      description: "মডেল এখন সেবা প্রদান করতে পারবেন।"
    });
  };

  const rejectModel = (modelId) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.filter(u => u.id !== modelId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
    toast({
      title: "মডেল প্রত্যাখ্যাত",
      description: "মডেলের অ্যাকাউন্ট মুছে দেওয়া হয়েছে।",
      variant: "destructive"
    });
  };

  const pendingModels = users.filter(u => u.role === 'model' && !u.approved);
  const approvedModels = users.filter(u => u.role === 'model' && u.approved);
  const allUsers = users.filter(u => u.role === 'user');

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-full">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="text-purple-200">স্বাগতম, {user.name}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            লগআউট
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white"
        >
          <Users className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-sm opacity-90">মোট ইউজার</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white"
        >
          <UserCheck className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{stats.totalModels}</p>
          <p className="text-sm opacity-90">মোট মডেল</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 text-white"
        >
          <Eye className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
          <p className="text-sm opacity-90">অনুমোদনের অপেক্ষায়</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"
        >
          <CheckCircle className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{stats.onlineModels}</p>
          <p className="text-sm opacity-90">অনলাইন মডেল</p>
        </motion.div>
      </div>

      {/* Pending Approvals */}
      {pendingModels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-4">অনুমোদনের অপেক্ষায় থাকা মডেল</h2>
          <div className="space-y-3">
            {pendingModels.map((model) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">{model.name}</p>
                  <p className="text-purple-200 text-sm">{model.mobile}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => approveModel(model.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    অনুমোদন
                  </Button>
                  <Button
                    onClick={() => rejectModel(model.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    প্রত্যাখ্যান
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Approved Models */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
      >
        <h2 className="text-xl font-bold text-white mb-4">অনুমোদিত মডেল</h2>
        <div className="grid gap-3">
          {approvedModels.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold">{model.name}</p>
                <p className="text-purple-200 text-sm">{model.mobile}</p>
                <p className="text-green-400 text-sm">
                  {model.online ? '🟢 অনলাইন' : '🔴 অফলাইন'} | রেট: ৳{model.callRate}/মিনিট
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* All Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-xl font-bold text-white mb-4">সকল ইউজার</h2>
        <div className="grid gap-3">
          {allUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 rounded-lg p-4"
            >
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-purple-200 text-sm">{user.mobile}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
