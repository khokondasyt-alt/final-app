import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { LogOut, Camera, DollarSign, Clock, Users, Video, Upload, PhoneIncoming, Trash2, PlusCircle } from 'lucide-react';

const ModelDashboard = ({ user, onLogout }) => {
  const [modelData, setModelData] = useState(user);
  const [isOnline, setIsOnline] = useState(user.online || false);
  const [callRate, setCallRate] = useState(user.callRate || 100);
  const [earnings, setEarnings] = useState(0);
  const [photos, setPhotos] = useState(user.photos || []);
  const [videos, setVideos] = useState(user.videos || []);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserData = users.find(u => u.id === user.id);
    if (currentUserData) {
      setPhotos(currentUserData.photos || []);
      setVideos(currentUserData.videos || []);
      setIsOnline(currentUserData.online || false);
      setCallRate(currentUserData.callRate || 100);
    }

    const savedEarnings = localStorage.getItem(`earnings_${user.id}`);
    if (savedEarnings) {
      setEarnings(parseFloat(savedEarnings));
    }
    
    const interval = setInterval(() => {
      if (isOnline) {
        const shouldShowNotification = Math.random() > 0.95;
        if (shouldShowNotification) {
          toast({
            title: "Incoming Call!",
            description: "A user wants to call you.",
            action: <Button onClick={() => toast({ description: "Call accepted (simulation)." })}>Accept</Button>,
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);

  }, [user.id, isOnline]);

  const updateUserData = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...updatedData } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    const updatedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.setItem('currentUser', JSON.stringify({...updatedCurrentUser, ...updatedData}));
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    updateUserData({ online: newStatus });
    setIsOnline(newStatus);
    toast({
      title: newStatus ? "You are Online" : "You are Offline",
      description: newStatus ? "You can now receive calls." : "You will not receive calls."
    });
  };

  const updateCallRate = () => {
    const newRate = parseInt(callRate);
    updateUserData({ callRate: newRate });
    toast({
      title: "Rate Updated",
      description: `Your new call rate is ৳${newRate}/minute.`
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPhotos = [...photos];
    const newVideos = [...videos];

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        newPhotos.push({ id: Date.now() + Math.random(), url });
      } else if (file.type.startsWith('video/')) {
        newVideos.push({ id: Date.now() + Math.random(), url });
      }
    });

    setPhotos(newPhotos);
    setVideos(newVideos);
    updateUserData({ photos: newPhotos, videos: newVideos });

    toast({
      title: "Media Uploaded",
      description: `${files.length} file(s) have been added to your profile.`
    });
  };

  const removeMedia = (id, type) => {
    let updatedMedia;
    let mediaList;
    let setMediaList;
    let key;

    if (type === 'photo') {
      mediaList = photos;
      setMediaList = setPhotos;
      key = 'photos';
    } else {
      mediaList = videos;
      setMediaList = setVideos;
      key = 'videos';
    }

    updatedMedia = mediaList.filter(item => item.id !== id);
    setMediaList(updatedMedia);
    updateUserData({ [key]: updatedMedia });

    toast({
      title: "Media Removed",
      description: `The ${type} has been removed from your profile.`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Model Dashboard</h1>
              <p className="text-purple-200">Welcome, {modelData.name}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className={`rounded-xl p-4 text-white ${isOnline ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
          <div className="flex items-center justify-between">
            <div><p className="text-2xl font-bold">{isOnline ? 'Online' : 'Offline'}</p><p className="text-sm opacity-90">Status</p></div>
            <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-300' : 'bg-red-300'} animate-pulse`} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <DollarSign className="w-8 h-8 mb-2" /><p className="text-2xl font-bold">৳{earnings.toFixed(2)}</p><p className="text-sm opacity-90">Total Earnings</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <Clock className="w-8 h-8 mb-2" /><p className="text-2xl font-bold">৳{callRate}</p><p className="text-sm opacity-90">Per Minute</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Manage Media</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white">Upload photos and videos for your profile.</p>
            {photos.length < 3 && <p className="text-yellow-400 text-sm">Minimum 3 photos required.</p>}
          </div>
          <Button onClick={() => fileInputRef.current.click()} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*,video/*" className="hidden" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">Photos ({photos.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {photos.map(photo => (
            <div key={photo.id} className="relative group">
              <img src={photo.url} alt="Profile photo" className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button variant="destructive" size="icon" onClick={() => removeMedia(photo.id, 'photo')}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full h-32 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white/50 hover:bg-white/10 cursor-pointer"
          >
            <PlusCircle className="w-8 h-8 mb-1" />
            <span>Add Photo</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">Videos ({videos.length})</h3>
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map(video => (
              <div key={video.id} className="relative group">
                <video src={video.url} className="w-full h-32 object-cover rounded-lg bg-black" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="destructive" size="icon" onClick={() => removeMedia(video.id, 'video')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white/50 hover:bg-white/10 cursor-pointer p-8"
          >
            <Video className="w-8 h-8 mb-2" />
            <span>Upload your first video</span>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Call Rate (per minute)</h3>
          <div className="flex items-center space-x-4">
            <input type="number" value={callRate} onChange={(e) => setCallRate(e.target.value)} className="w-32 p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500" min="50" max="1000" />
            <Button onClick={updateCallRate} className="bg-blue-600 hover:bg-blue-700">Update Rate</Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Control Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={toggleOnlineStatus} className={`p-4 h-auto ${isOnline ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
            <Users className="w-6 h-6 mr-3" />
            <div className="text-left">
              <p className="font-semibold">{isOnline ? 'Go Offline' : 'Go Online'}</p>
              <p className="text-sm opacity-90">{isOnline ? 'Stop receiving calls' : 'Start receiving calls'}</p>
            </div>
          </Button>
          <Button onClick={() => toast({ title: "🚧 Feature not implemented yet", description: "You can request this in your next prompt! 🚀" })} className="p-4 h-auto bg-purple-600 hover:bg-purple-700">
            <Video className="w-6 h-6 mr-3" />
            <div className="text-left">
              <p className="font-semibold">Test Video Call</p>
              <p className="text-sm opacity-90">Check your camera and mic</p>
            </div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelDashboard;
