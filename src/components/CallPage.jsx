import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Clock } from 'lucide-react';

const CallPage = ({ user, model, duration, onEndCall }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const startWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Placeholder for remote stream
        if (remoteVideoRef.current) {
          // In a real app, this would come from the peer connection
          // For now, we can just show the local stream again as a placeholder
          remoteVideoRef.current.srcObject = stream; 
        }
        toast({ title: "ভিডিও কল শুরু হয়েছে!" });
      } catch (error) {
        console.error("Error accessing media devices.", error);
        toast({
          title: "ক্যামেরা/মাইক্রোফোন অ্যাক্সেস করা যায়নি",
          description: "অনুগ্রহ করে পারমিশন চেক করুন এবং আবার চেষ্টা করুন।",
          variant: "destructive",
        });
        onEndCall();
      }
    };

    startWebRTC();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onEndCall]);

  useEffect(() => {
    if (timeLeft <= 0) {
      toast({ title: "সময় শেষ!", description: "আপনার কলটি শেষ হয়ে গেছে।" });
      onEndCall();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEndCall]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col"
    >
      <div className="relative flex-grow">
        {/* Remote Video */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-lg">
          <p className="text-white text-lg font-bold">আপনি {model.name} এর সাথে কথা বলছেন</p>
        </div>
        
        {/* Local Video */}
        <motion.div
          drag
          dragConstraints={{ top: -200, left: -200, right: 200, bottom: 200 }}
          className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-purple-500 cursor-grab"
        >
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
        </motion.div>

        {/* Timer */}
        <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg flex items-center space-x-2">
          <Clock className="text-red-500 w-5 h-5" />
          <p className="text-white font-mono text-lg">{formatTime(timeLeft)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/70 py-4 flex justify-center items-center space-x-4">
        <Button onClick={toggleMute} variant="outline" size="icon" className={`rounded-full w-16 h-16 ${isMuted ? 'bg-red-500 border-red-500' : 'bg-white/20 border-white/20'}`}>
          {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </Button>
        <Button onClick={toggleCamera} variant="outline" size="icon" className={`rounded-full w-16 h-16 ${isCameraOff ? 'bg-red-500 border-red-500' : 'bg-white/20 border-white/20'}`}>
          {isCameraOff ? <VideoOff className="w-8 h-8" /> : <Video className="w-8 h-8" />}
        </Button>
        <Button onClick={onEndCall} variant="destructive" size="icon" className="rounded-full w-20 h-20 bg-red-600 hover:bg-red-700">
          <PhoneOff className="w-10 h-10" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CallPage;
