import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';

interface DesignStage {
  title: string;
  date: string;
  image: string;
  description: string;
}

interface VideoShowcaseProps {
  stages: DesignStage[];
  autoPlay?: boolean;
  interval?: number; // in milliseconds
  className?: string;
}

export function VideoShowcase({ 
  stages, 
  autoPlay = true, 
  interval = 3000, 
  className = "" 
}: VideoShowcaseProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle auto-play and progress
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    let progressInterval: number;
    
    if (isPlaying) {
      // Calculate how often to update progress (aim for smooth updates)
      progressInterval = 50; // update every 50ms
      const progressStep = (progressInterval / interval) * 100;
      
      // Start progress timer
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + progressStep;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, progressInterval);
      
      // Stage change timer
      timer = setTimeout(() => {
        goToNextStage();
        setProgress(0);
      }, interval);
    }
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [isPlaying, currentStage, interval]);
  
  // Navigation functions
  const goToNextStage = () => {
    setCurrentStage(prev => (prev + 1) % stages.length);
    setProgress(0);
  };
  
  const goToPrevStage = () => {
    setCurrentStage(prev => (prev - 1 + stages.length) % stages.length);
    setProgress(0);
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleFullscreen = () => {
    const element = document.getElementById('video-showcase');
    if (!isFullscreen) {
      if (element?.requestFullscreen) {
        element.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error("Fullscreen error:", err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error("Exit fullscreen error:", err));
      }
    }
  };
  
  // Listen for ESC key to update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const currentItem = stages[currentStage];
  
  return (
    <div 
      id="video-showcase"
      className={`relative rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800/50 ${className}`}
    >
      {/* Main display */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={currentItem.image} 
          alt={currentItem.title}
          className="w-full h-full object-contain transition-transform duration-700"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
        
        {/* Current stage indicator */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-blue-600/80 backdrop-blur-sm text-white border-0">
            {currentItem.date}
          </Badge>
        </div>
        
        {/* Stage title and description in overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 to-slate-900/30">
          <h3 className="text-lg font-medium text-white mb-1">{currentItem.title}</h3>
          <p className="text-sm text-slate-300 line-clamp-2">{currentItem.description}</p>
        </div>
      </div>
      
      {/* Controls overlay */}
      <div className="bg-slate-900/80 backdrop-blur-sm p-2">
        <div className="flex items-center gap-2">
          {/* Progress bar */}
          <div className="flex-1 mr-2">
            <Progress value={progress} className="h-1.5" />
          </div>
          
          {/* Navigation buttons */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-300 hover:text-white"
            onClick={goToPrevStage}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-300 hover:text-white"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-300 hover:text-white"
            onClick={goToNextStage}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-slate-300 hover:text-white"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Stage indicator dots */}
      <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1 pb-1">
        {stages.map((_, idx) => (
          <button
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStage 
                ? 'bg-blue-500 w-4' 
                : 'bg-slate-600 w-1.5 hover:bg-slate-500'
            }`}
            onClick={() => {
              setCurrentStage(idx);
              setProgress(0);
            }}
            aria-label={`Go to stage ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}