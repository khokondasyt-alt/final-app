import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Video, Heart, LogIn } from 'lucide-react';

const HomePage = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const approvedModels = users.filter(u => u.role === 'model' && u.approved);
    setModels(approvedModels);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Online Fun Service</h1>
        </div>
        <Link to="/login">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <LogIn className="w-4 h-4 mr-2" />
            লগইন / নিবন্ধন
          </Button>
        </Link>
      </header>

      <main className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold text-white mb-4"
        >
          Make Friends, Video Call, Fun, Real Meeting
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-purple-200 max-w-2xl mx-auto mb-12"
        >
          আপনার পছন্দের মানুষের সাথে নিরাপদে ভিডিও কলে কথা বলুন। এখনই আপনার যাত্রা শুরু করুন!
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-6">আমাদের জনপ্রিয় মডেল</h3>
          
          {models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl p-4 border border-white/20 backdrop-blur-sm text-left"
                >
                  <div className="relative mb-3">
                    <img alt={model.name} className="w-full h-48 object-cover rounded-lg" src="https://images.unsplash.com/photo-1694157263770-1a844cb0f6e0" />
                    {model.online && (
                      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span>অনলাইন</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-white font-semibold text-lg">{model.name}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">4.8</span>
                    </div>
                    <div className="text-white text-sm">
                      ৳{model.callRate}/মিনিট
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">এখন কোনো মডেল উপলব্ধ নেই</p>
              <p className="text-white/70">অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
