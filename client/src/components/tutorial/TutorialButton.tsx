import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from '@/context/TutorialContext';

interface TutorialButtonProps {
  compact?: boolean;
  className?: string;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ 
  compact = false,
  className = ''
}) => {
  const { 
    startTutorial, 
    resetTutorial, 
    isActive, 
    endTutorial, 
    completedSteps,
    steps
  } = useTutorial();
  
  const hasCompletedAllSteps = completedSteps.size === steps.length;
  
  const handleClick = () => {
    if (isActive) {
      endTutorial();
    } else {
      startTutorial();
    }
  };
  
  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full relative ${className}`}
        onClick={handleClick}
      >
        <HelpCircle className="h-4 w-4 text-primary-600" />
        {!hasCompletedAllSteps && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-1.5 ${className}`}
      onClick={handleClick}
    >
      <HelpCircle className="h-3.5 w-3.5" />
      <span>{isActive ? 'Hide Help' : 'Help'}</span>
      {!hasCompletedAllSteps && (
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
      )}
    </Button>
  );
};

export default TutorialButton;