import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of our tutorial steps
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  elementId?: string;  // ID of the element to highlight
  position?: 'top' | 'right' | 'bottom' | 'left';
  trigger?: 'view' | 'interaction' | 'manual';
  completed?: boolean;
  order?: number;
}

// Define the tutorial context type
interface TutorialContextType {
  isActive: boolean;
  currentStep: TutorialStep | null;
  steps: TutorialStep[];
  completedSteps: Set<string>;
  progress: number;
  
  startTutorial: () => void;
  endTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: string) => void;
  completeStep: (stepId: string) => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  
  // For tracking user interaction
  trackInteraction: (elementId: string) => void;
}

// Create context with default values
const TutorialContext = createContext<TutorialContextType>({
  isActive: false,
  currentStep: null,
  steps: [],
  completedSteps: new Set(),
  progress: 0,
  
  startTutorial: () => {},
  endTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  completeStep: () => {},
  skipTutorial: () => {},
  resetTutorial: () => {},
  trackInteraction: () => {},
});

// Default tutorial steps
const defaultTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CephaloScan',
    description: 'This quick tutorial will guide you through the essential features of our simplified cephalometric analysis tool.',
    trigger: 'view',
    order: 0
  },
  {
    id: 'toggle-panel',
    title: 'Collapsible Panel',
    description: 'Click this button to expand or collapse the analysis panel for more screen space.',
    elementId: 'toggle-panel-btn',
    position: 'left',
    trigger: 'interaction',
    order: 1
  },
  {
    id: 'ai-insights',
    title: 'AI Clinical Insights',
    description: 'The AI automatically identifies key clinical patterns and provides diagnostic suggestions based on your analysis.',
    elementId: 'ai-insights-banner',
    position: 'bottom',
    trigger: 'view',
    order: 2
  },
  {
    id: 'critical-findings',
    title: 'Critical Findings',
    description: 'Important measurements outside normal range are highlighted here for quick reference.',
    elementId: 'critical-findings-section',
    position: 'right',
    trigger: 'view',
    order: 3
  },
  {
    id: 'view-switcher',
    title: 'Analysis Views',
    description: 'Switch between different analysis perspectives: measurements, chart, and profile.',
    elementId: 'view-switcher',
    position: 'bottom',
    trigger: 'interaction',
    order: 4
  },
  {
    id: 'radiograph-controls',
    title: 'Image Controls',
    description: 'Use these tools to adjust the radiograph view. Try zooming or panning for a better look.',
    elementId: 'radiograph-controls',
    position: 'top',
    trigger: 'interaction',
    order: 5
  }
];

// Provider component
export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<TutorialStep[]>(defaultTutorialSteps);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [interactedElements, setInteractedElements] = useState<Set<string>>(new Set());
  
  // Load tutorial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('cephaloScan_tutorialState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setCompletedSteps(new Set(parsedState.completedSteps));
        setInteractedElements(new Set(parsedState.interactedElements));
      } catch (error) {
        console.error('Error loading tutorial state:', error);
      }
    }
  }, []);

  // Save tutorial state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      completedSteps: Array.from(completedSteps),
      interactedElements: Array.from(interactedElements),
    };
    localStorage.setItem('cephaloScan_tutorialState', JSON.stringify(stateToSave));
  }, [completedSteps, interactedElements]);

  // Find the current step object based on ID
  const currentStep = currentStepId 
    ? steps.find(step => step.id === currentStepId) || null 
    : null;

  // Calculate progress percentage
  const progress = completedSteps.size > 0 
    ? Math.round((completedSteps.size / steps.length) * 100) 
    : 0;

  // Start tutorial
  const startTutorial = () => {
    setIsActive(true);
    // Start with the first incomplete step
    const firstIncompleteStep = steps
      .filter(step => !completedSteps.has(step.id))
      .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
      
    if (firstIncompleteStep) {
      setCurrentStepId(firstIncompleteStep.id);
    } else {
      // If all steps are completed, start from the beginning
      setCurrentStepId(steps[0].id);
    }
  };

  // End tutorial
  const endTutorial = () => {
    setIsActive(false);
    setCurrentStepId(null);
  };

  // Navigate to next step
  const nextStep = () => {
    if (!currentStep) return;
    
    // Mark current step as completed
    completeStep(currentStep.id);
    
    // Find next step by order
    const currentOrder = currentStep.order || 0;
    const nextStep = steps
      .filter(step => (step.order || 0) > currentOrder)
      .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
    
    if (nextStep) {
      setCurrentStepId(nextStep.id);
    } else {
      // If no next step, end tutorial
      endTutorial();
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (!currentStep) return;
    
    // Find previous step by order
    const currentOrder = currentStep.order || 0;
    const prevStep = steps
      .filter(step => (step.order || 0) < currentOrder)
      .sort((a, b) => (b.order || 0) - (a.order || 0))[0];
    
    if (prevStep) {
      setCurrentStepId(prevStep.id);
    }
  };

  // Navigate to specific step
  const goToStep = (stepId: string) => {
    const stepExists = steps.some(step => step.id === stepId);
    if (stepExists) {
      setCurrentStepId(stepId);
    }
  };

  // Mark a step as completed
  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      updated.add(stepId);
      return updated;
    });
  };

  // Skip the tutorial entirely
  const skipTutorial = () => {
    // Mark all steps as completed
    const allStepIds = steps.map(step => step.id);
    setCompletedSteps(new Set(allStepIds));
    endTutorial();
  };

  // Reset tutorial progress
  const resetTutorial = () => {
    setCompletedSteps(new Set());
    setInteractedElements(new Set());
    endTutorial();
  };

  // Track user interaction with elements
  const trackInteraction = (elementId: string) => {
    setInteractedElements(prev => {
      const updated = new Set(prev);
      updated.add(elementId);
      return updated;
    });
    
    // If tutorial is active and current step is for this element, complete it
    if (isActive && currentStep && currentStep.elementId === elementId) {
      completeStep(currentStep.id);
      nextStep();
    }
    
    // Check if any interaction-triggered steps should be shown
    if (!isActive) {
      const matchingStep = steps.find(
        step => 
          step.elementId === elementId && 
          step.trigger === 'interaction' && 
          !completedSteps.has(step.id)
      );
      
      if (matchingStep) {
        setIsActive(true);
        setCurrentStepId(matchingStep.id);
      }
    }
  };

  const contextValue: TutorialContextType = {
    isActive,
    currentStep,
    steps,
    completedSteps,
    progress,
    
    startTutorial,
    endTutorial,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    skipTutorial,
    resetTutorial,
    trackInteraction
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  );
};

// Custom hook for using the tutorial context
export const useTutorial = () => useContext(TutorialContext);

export default TutorialContext;