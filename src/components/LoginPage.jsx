import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Heart, Video, Shield } from 'lucide-react';
const LoginPage = ({
  onLogin
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    gender: ''
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.mobile === formData.mobile && u.password === formData.password);
      if (user) {
        if (user.role === 'model' && !user.approved) {
          toast({
            title: "অনুমোদন প্রয়োজন",
            description: "আপনার মডেল অ্যাকাউন্ট এখনো অ্যাডমিন দ্বারা অনুমোদিত হয়নি।",
            variant: "destructive"
          });
        } else {
          toast({
            title: "সফলভাবে লগইন!",
            description: `স্বাগতম, ${user.name}!`
          });
          onLogin(user);
        }
      } else {
        toast({
          title: "ভুল তথ্য",
          description: "মোবাইল নম্বর বা পাসওয়ার্ড ভুল।",
          variant: "destructive"
        });
      }
    } else {
      // Registration logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if mobile already exists
      if (users.find(u => u.mobile === formData.mobile)) {
        toast({
          title: "ইতিমধ্যে নিবন্ধিত",
          description: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।",
          variant: "destructive"
        });
        return;
      }
      const role = formData.gender === 'female' ? 'model' : 'user';
      const newUser = {
        ...formData,
        role,
        approved: role === 'user',
        id: Date.now(),
        online: false,
        callRate: role === 'model' ? 100 : 0,
        profilePhoto: null
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      toast({
        title: "সফলভাবে নিবন্ধন!",
        description: role === 'model' ? "অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।" : "এখন লগইন করুন।"
      });
      setIsLogin(true);
      setFormData({
        name: '',
        mobile: '',
        password: '',
        gender: ''
      });
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md">
        {/* Logo & Title */}
        <motion.div initial={{
        scale: 0.8
      }} animate={{
        scale: 1
      }} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Online Fun Service</h1>
          <p className="text-purple-200">dgd</p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div whileHover={{
          scale: 1.05
        }} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-white">নিরাপদ</p>
          </motion.div>
          <motion.div whileHover={{
          scale: 1.05
        }} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Video className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-white">HD ভিডিও</p>
          </motion.div>
          <motion.div whileHover={{
          scale: 1.05
        }} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-xs text-white">মজাদার</p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20" whileHover={{
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}>
          <div className="flex mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 px-4 rounded-lg transition-all ${isLogin ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/10'}`}>
              লগইন
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 px-4 rounded-lg transition-all ${!isLogin ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-white/10'}`}>
              নিবন্ধন
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }}>
                <input type="text" placeholder="পূর্ণ নাম" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </motion.div>}

            <input type="tel" placeholder="মোবাইল নম্বর" value={formData.mobile} onChange={e => setFormData({
            ...formData,
            mobile: e.target.value
          })} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500" required />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="পাসওয়ার্ড" value={formData.password} onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }}>
                <select value={formData.gender} onChange={e => setFormData({
              ...formData,
              gender: e.target.value
            })} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                  <option value="">লিঙ্গ নির্বাচন করুন</option>
                  <option value="male">পুরুষ</option>
                  <option value="female">মহিলা</option>
                </select>
              </motion.div>}

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              {isLogin ? 'লগইন করুন' : 'নিবন্ধন করুন'}
            </Button>
          </form>

          {!isLogin && <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="text-xs text-purple-200 mt-4 text-center">
              মহিলারা মডেল হিসেবে নিবন্ধিত হবেন এবং অ্যাডমিনের অনুমোদনের প্রয়োজন হবে।
            </motion.p>}
        </motion.div>
      </motion.div>
    </div>;
};
export default LoginPage;
