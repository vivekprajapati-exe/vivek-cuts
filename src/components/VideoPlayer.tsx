
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  aspectRatio?: "16:9" | "1:1" | "4:3" | "21:9";
  className?: string;
}

const VideoPlayer = ({ 
  youtubeId, 
  title, 
  aspectRatio = "16:9", 
  className 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
    "21:9": "aspect-[21/9]",
  }[aspectRatio];

  const handlePlay = () => {
    // YouTube iframe API to control playback
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    // YouTube iframe API to control playback
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (playerRef.current && playerRef.current.contentWindow) {
      if (isMuted) {
        playerRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        playerRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear existing timeout if there is one
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <motion.div 
      className={cn("custom-video-player group relative", aspectRatioClass, className, isPlaying && "playing")}
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <iframe
        ref={playerRef}
        className="absolute w-full h-full top-0 left-0 z-10"
        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&controls=0&showinfo=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              
              <div className="text-white text-sm font-medium ml-2 hidden sm:block">
                {title}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                aria-label="Toggle volume"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              
              <button 
                className="w-8 h-8 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                aria-label="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for when video is not playing */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer z-20"
          onClick={togglePlay}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center"
          >

          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlayer;
