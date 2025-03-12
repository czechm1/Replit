import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, InfoIcon } from 'lucide-react';
import { TutorialStep, useTutorial } from '@/context/TutorialContext';
import { cn } from '@/lib/utils';

interface TutorialTooltipProps {
  step: TutorialStep;
}

export function TutorialTooltip({ step }: TutorialTooltipProps) {
  const { 
    dismissTutorial, 
    completeTutorial, 
    steps, 
    highlightFeature 
  } = useTutorial();
  
  const [position, setPosition] = useState<{top: number, left: number}>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Get next step for "Next" button
  const nextStep = steps.find(s => 
    s.state === 'unseen' && s.order > step.order
  );
  
  // Position the tooltip relative to the target element
  useEffect(() => {
    if (!step.element) return;
    
    const positionTooltip = () => {
      const targetElement = document.querySelector(step.element as string);
      if (!targetElement || !tooltipRef.current) return;
      
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      // Position based on specified position
      switch(step.position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + 10;
          break;
        default:
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      }
      
      // Adjust to ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Keep within horizontal bounds
      if (left < 10) left = 10;
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }
      
      // Keep within vertical bounds
      if (top < 10) top = 10;
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10;
      }
      
      setPosition({ top, left });
    };
    
    // Delay showing to ensure DOM is ready
    const timer = setTimeout(() => {
      positionTooltip();
      setIsVisible(true);
    }, 300);
    
    // Reposition on window resize
    window.addEventListener('resize', positionTooltip);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [step]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => dismissTutorial(step.id), 300); // Allow time for animation
  };
  
  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      completeTutorial(step.id);
      
      // Show next tutorial step if available
      if (nextStep) {
        highlightFeature(nextStep.id);
      }
    }, 300);
  };
  
  // Highlight the target element
  useEffect(() => {
    if (!step.element) return;
    
    const targetElement = document.querySelector(step.element);
    if (!targetElement) return;
    
    // Add highlighting class
    targetElement.classList.add('tutorial-highlight');
    
    return () => {
      targetElement.classList.remove('tutorial-highlight');
    };
  }, [step.element]);
  
  return (
    <div 
      ref={tooltipRef}
      className={cn(
        "fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <InfoIcon size={18} className="text-primary" />
          <h3 className="font-medium text-lg">{step.title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-muted-foreground hover:text-foreground" 
          onClick={handleDismiss}
        >
          <X size={16} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDismiss}
        >
          Skip
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleComplete}
          className="gap-1"
        >
          {nextStep ? 'Next' : 'Got it'} 
          {nextStep && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}