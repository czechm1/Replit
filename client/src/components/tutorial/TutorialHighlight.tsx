import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTutorial, TutorialStep } from '@/context/TutorialContext';

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Positions tooltip relative to highlighted element
const getTooltipPosition = (
  elementPosition: ElementPosition, 
  position: 'top' | 'right' | 'bottom' | 'left' = 'bottom'
) => {
  const margin = 12; // Distance from element
  
  switch (position) {
    case 'top':
      return {
        top: elementPosition.top - margin,
        left: elementPosition.left + elementPosition.width / 2,
        transform: 'translate(-50%, -100%)'
      };
    case 'right':
      return {
        top: elementPosition.top + elementPosition.height / 2,
        left: elementPosition.left + elementPosition.width + margin,
        transform: 'translate(0, -50%)'
      };
    case 'bottom':
      return {
        top: elementPosition.top + elementPosition.height + margin,
        left: elementPosition.left + elementPosition.width / 2,
        transform: 'translate(-50%, 0)'
      };
    case 'left':
      return {
        top: elementPosition.top + elementPosition.height / 2,
        left: elementPosition.left - margin,
        transform: 'translate(-100%, -50%)'
      };
  }
};

const TutorialHighlight: React.FC = () => {
  const { 
    isActive, 
    currentStep, 
    nextStep, 
    prevStep, 
    endTutorial, 
    completeStep,
    progress
  } = useTutorial();
  
  const [elementPosition, setElementPosition] = useState<ElementPosition | null>(null);
  
  // Find and track the target element's position
  useEffect(() => {
    if (!isActive || !currentStep?.elementId) {
      setElementPosition(null);
      return;
    }

    const targetElement = document.getElementById(currentStep.elementId);
    if (!targetElement) {
      console.warn(`Tutorial element with ID "${currentStep.elementId}" not found.`);
      return;
    }

    // Calculate initial position
    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      setElementPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
    };
    
    updatePosition();
    
    // Update position on resize or scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep]);
  
  // Handle skip/close
  const handleClose = () => {
    if (currentStep) {
      completeStep(currentStep.id);
    }
    endTutorial();
  };

  // If tutorial is not active or no current step, don't render anything
  if (!isActive || !currentStep) return null;
  
  // If element-specific tutorial but no element found
  if (currentStep.elementId && !elementPosition) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-4 max-w-md"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-slate-800">{currentStep.title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <p className="text-xs text-slate-600 mb-3">{currentStep.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7" 
              onClick={prevStep}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="text-xs h-7" 
              onClick={nextStep}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // For element-specific tutorials
  return (
    <>
      {/* Highlight overlay */}
      {elementPosition && (
        <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bg-white rounded-md"
            style={{
              top: elementPosition.top - 4,
              left: elementPosition.left - 4,
              width: elementPosition.width + 8,
              height: elementPosition.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(59, 130, 246, 0.7)'
            }}
          />
        </div>
      )}
      
      {/* Tooltip */}
      <AnimatePresence>
        {elementPosition && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-white rounded-lg shadow-lg p-3 max-w-xs pointer-events-auto"
            style={getTooltipPosition(elementPosition, currentStep.position)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-slate-800">{currentStep.title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full" 
                onClick={handleClose}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <p className="text-xs text-slate-600 mb-3">{currentStep.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 rounded-full w-7 p-0" 
                  onClick={prevStep}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs h-7" 
                  onClick={nextStep}
                >
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TutorialHighlight;