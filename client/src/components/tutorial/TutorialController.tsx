import React from 'react';
import { useTutorial } from '@/context/TutorialContext';
import { TutorialTooltip } from './TutorialTooltip';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, X } from 'lucide-react';

export function TutorialController() {
  const { 
    currentStep, 
    resetTutorial, 
    tutorialActive, 
    setTutorialActive 
  } = useTutorial();
  
  // Show tutorial tooltip if there's a current step
  const showTutorial = currentStep && tutorialActive;
  
  return (
    <>
      {/* Tutorial toggle button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant={tutorialActive ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 shadow-md"
          onClick={() => setTutorialActive(!tutorialActive)}
        >
          {tutorialActive ? (
            <>
              <X size={16} />
              <span>Disable Tutorial</span>
            </>
          ) : (
            <>
              <Lightbulb size={16} />
              <span>Enable Tutorial</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Tutorial reset button - only shown when tutorial is active */}
      {tutorialActive && (
        <div className="fixed bottom-4 right-40 z-40">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 shadow-md"
            onClick={resetTutorial}
          >
            <Sparkles size={16} />
            <span>Restart Tutorial</span>
          </Button>
        </div>
      )}
      
      {/* Active tutorial tooltip */}
      {showTutorial && <TutorialTooltip step={currentStep} />}
    </>
  );
}