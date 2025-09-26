import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { X, Clock, DollarSign, QrCode } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, model, userBalance, onPaymentSuccess }) => {
  const [selectedDuration, setSelectedDuration] = useState(5); // in minutes
  const callAmount = selectedDuration * model.callRate;

  const durations = [
    { minutes: 5, label: '৫ মিনিট' },
    { minutes: 10, label: '১০ মিনিট' },
    { minutes: 15, label: '১৫ মিনিট' },
  ];

  const handlePay = () => {
    if (userBalance < callAmount) {
      toast({
        title: "অপর্যাপ্ত ব্যালেন্স",
        description: `আপনার প্রয়োজন ৳${callAmount.toFixed(2)}, কিন্তু আপনার আছে ৳${userBalance.toFixed(2)}।`,
        variant: "destructive",
      });
      return;
    }
    
    // Simulate payment success
    onPaymentSuccess(selectedDuration * 60, callAmount);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-xl border-purple-500/50 text-white p-0 max-w-md">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <DialogHeader className="p-6">
              <DialogTitle className="text-2xl font-bold text-center">কলের জন্য পেমেন্ট</DialogTitle>
              <DialogDescription className="text-center text-purple-200">
                {model.name} এর সাথে কথা বলুন
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-lg">
                  <img alt="QR Code for payment" className="w-40 h-40" src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf" />
                </div>
              </div>
              <p className="text-center text-sm text-purple-300">
                উপরের QR কোডটি স্ক্যান করে পেমেন্ট করুন অথবা ব্যালেন্স থেকে পে করুন।
              </p>

              <div>
                <p className="text-center font-semibold mb-3">কলের সময়কাল নির্বাচন করুন</p>
                <div className="flex justify-center space-x-2">
                  {durations.map(d => (
                    <Button
                      key={d.minutes}
                      variant={selectedDuration === d.minutes ? 'default' : 'outline'}
                      onClick={() => setSelectedDuration(d.minutes)}
                      className={`
                        ${selectedDuration === d.minutes 
                          ? 'bg-purple-600 border-purple-600' 
                          : 'bg-transparent border-white/30 text-white hover:bg-white/10'}
                      `}
                    >
                      {d.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 text-center space-y-2">
                <div className="flex justify-around">
                  <div>
                    <p className="text-sm text-purple-300">সময়কাল</p>
                    <p className="font-bold text-lg flex items-center justify-center"><Clock className="w-4 h-4 mr-1"/>{selectedDuration} মিনিট</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300">খরচ</p>
                    <p className="font-bold text-lg flex items-center justify-center"><DollarSign className="w-4 h-4 mr-1"/>{callAmount.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-xs text-purple-300">আপনার বর্তমান ব্যালেন্স: ৳{userBalance.toFixed(2)}</p>
              </div>

              <Button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3"
                disabled={userBalance < callAmount}
              >
                {userBalance < callAmount ? 'অপর্যাপ্ত ব্যালেন্স' : `৳${callAmount.toFixed(2)} পে করুন`}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
