import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { LogOut, Video, Heart, Search, Star, Clock, DollarSign, Phone } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';

const UserDashboard = ({ user, onLogout, onStartCall }) => {
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [balance, setBalance] = useState(500);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadModels();
    const savedBalance = localStorage.getItem(`balance_${user.id}`);
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, [user.id]);

  const loadModels = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const approvedModels = users.filter(u => u.role === 'model' && u.approved);
    setModels(approvedModels);
  };

  const handleCallClick = (model) => {
    setSelectedModel(model);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (duration, amount) => {
    const newBalance = balance - amount;
    setBalance(newBalance);
    localStorage.setItem(`balance_${user.id}`, newBalance.toString());
    setIsPaymentModalOpen(false);
    toast({
      title: "পেমেন্ট সফল!",
      description: `আপনি ${duration / 60} মিনিটের জন্য কল করতে পারবেন।`,
    });
    onStartCall(selectedModel, duration);
  };

  const addBalance = () => {
    toast({
      title: "🚧 পেমেন্ট সিস্টেম এখনো তৈরি হয়নি",
      description: "Stripe ইন্টিগ্রেশনের জন্য পরবর্তী প্রম্পটে চাইতে পারেন! 🚀"
    });
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineModels = filteredModels.filter(model => model.online);
  const offlineModels = filteredModels.filter(model => !model.online);

  return (
    <>
      <div className="min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ইউজার ড্যাশবোর্ড</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"
          >
            <DollarSign className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">৳{balance.toFixed(2)}</p>
            <p className="text-sm opacity-90">ব্যালেন্স</p>
            <Button
              onClick={addBalance}
              size="sm"
              className="mt-2 bg-white/20 hover:bg-white/30 text-white border-none"
            >
              রিচার্জ করুন
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white"
          >
            <Heart className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{onlineModels.length}</p>
            <p className="text-sm opacity-90">অনলাইন মডেল</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white"
          >
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm opacity-90">মোট কল মিনিট</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="text"
              placeholder="মডেল খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </motion.div>

        {onlineModels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
              অনলাইন মডেল ({onlineModels.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineModels.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl p-4 border border-white/20 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <img alt={model.name} className="w-full h-full rounded-full object-cover" src="https://images.unsplash.com/photo-1679845495280-0b760428f725" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{model.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm">অনলাইন</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">4.8</span>
                    </div>
                    <div className="text-white text-sm">
                      ৳{model.callRate}/মিনিট
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCallClick(model)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    কল করুন
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {offlineModels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              অফলাইন মডেল ({offlineModels.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineModels.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 opacity-60"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                      <img alt={model.name} className="w-full h-full rounded-full object-cover grayscale" src="https://images.unsplash.com/photo-1585552209257-86d2db9988b8" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{model.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-red-400 text-sm">অফলাইন</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">4.8</span>
                    </div>
                    <div className="text-white text-sm">
                      ৳{model.callRate}/মিনিট
                    </div>
                  </div>

                  <Button
                    disabled
                    className="w-full bg-gray-600 text-white cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    অফলাইন
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {filteredModels.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center"
          >
            <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">কোনো মডেল পাওয়া যায়নি</p>
            <p className="text-white/70">অন্য নাম দিয়ে খুঁজে দেখুন বা পরে আবার চেষ্টা করুন</p>
          </motion.div>
        )}
      </div>
      {selectedModel && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          model={selectedModel}
          userBalance={balance}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default UserDashboard;
