import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the types of features that can be highlighted
export type FeatureType = 
  | 'layer_controls' 
  | 'landmark_editor' 
  | 'image_settings' 
  | 'zoom_controls' 
  | 'analysis_view' 
  | 'export_options'
  | 'keyboard_shortcuts';

// Define the states of each tutorial step
export type TutorialState = 'unseen' | 'highlighted' | 'seen' | 'dismissed';

// Interface for a tutorial step
export interface TutorialStep {
  id: FeatureType;
  title: string;
  description: string;
  state: TutorialState;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  order: number; // For sequential tutorial steps
  condition?: () => boolean; // Optional condition to show this step
}

interface TutorialContextType {
  steps: TutorialStep[];
  currentStep: TutorialStep | null;
  highlightFeature: (featureId: FeatureType) => void;
  dismissTutorial: (featureId: FeatureType) => void;
  completeTutorial: (featureId: FeatureType) => void;
  resetTutorial: () => void;
  tutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;
  userInteractionCount: Record<FeatureType, number>;
  recordInteraction: (featureId: FeatureType) => void;
}

const defaultTutorialSteps: TutorialStep[] = [
  {
    id: 'layer_controls',
    title: 'Layer Controls',
    description: 'Adjust the visibility of different layers such as tracing, landmarks, and measurements. Click the layers icon to access these controls.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="layer_controls"]',
    position: 'top',
    order: 1
  },
  {
    id: 'image_settings',
    title: 'Image Settings',
    description: 'Enhance the radiograph by adjusting brightness and contrast. Click the sliders icon to access these controls.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="image_settings"]',
    position: 'top',
    order: 2
  },
  {
    id: 'landmark_editor',
    title: 'Landmark Editor',
    description: 'Add, move, or delete cephalometric landmarks on the radiograph. Click the edit icon to start editing landmarks.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="landmark_editor"]',
    position: 'top',
    order: 3
  },
  {
    id: 'zoom_controls',
    title: 'Zoom Controls',
    description: 'Zoom in, out, or reset the view to better examine details on the radiograph.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="zoom_controls"]',
    position: 'top',
    order: 4
  },
  {
    id: 'analysis_view',
    title: 'Analysis View',
    description: 'View analysis results in different formats, including tables, charts, and visual overlays.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="analysis_view"]',
    position: 'right',
    order: 5
  },
  {
    id: 'export_options',
    title: 'Export Options',
    description: 'Export your analysis results in various formats for reports or presentations.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="export_options"]',
    position: 'bottom',
    order: 6
  },
  {
    id: 'keyboard_shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Use keyboard shortcuts for faster workflow. Press ? to view all available shortcuts.',
    state: 'unseen' as TutorialState,
    element: '[data-tutorial="keyboard_shortcuts"]',
    position: 'bottom',
    order: 7
  }
];

const TutorialContext = createContext<TutorialContextType>({
  steps: [],
  currentStep: null,
  highlightFeature: () => {},
  dismissTutorial: () => {},
  completeTutorial: () => {},
  resetTutorial: () => {},
  tutorialActive: true,
  setTutorialActive: () => {},
  userInteractionCount: {} as Record<FeatureType, number>,
  recordInteraction: () => {}
});

export const useTutorial = () => useContext(TutorialContext);

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  // Initialize tutorial steps
  const [steps, setSteps] = useState<TutorialStep[]>(() => {
    // Load from localStorage if available
    const savedSteps = localStorage.getItem('tutorialSteps');
    return savedSteps ? JSON.parse(savedSteps) : defaultTutorialSteps;
  });
  
  const [tutorialActive, setTutorialActive] = useState<boolean>(() => {
    const savedState = localStorage.getItem('tutorialActive');
    return savedState ? JSON.parse(savedState) : true;
  });
  
  // Track interaction count for each feature
  const [userInteractionCount, setUserInteractionCount] = useState<Record<FeatureType, number>>(() => {
    const savedCounts = localStorage.getItem('userInteractionCount');
    return savedCounts 
      ? JSON.parse(savedCounts) 
      : Object.fromEntries(defaultTutorialSteps.map(step => [step.id, 0])) as Record<FeatureType, number>;
  });
  
  // Current step being highlighted
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  
  // Update localStorage when steps change
  useEffect(() => {
    localStorage.setItem('tutorialSteps', JSON.stringify(steps));
  }, [steps]);
  
  useEffect(() => {
    localStorage.setItem('tutorialActive', JSON.stringify(tutorialActive));
  }, [tutorialActive]);
  
  useEffect(() => {
    localStorage.setItem('userInteractionCount', JSON.stringify(userInteractionCount));
  }, [userInteractionCount]);
  
  // Highlight a feature
  const highlightFeature = (featureId: FeatureType) => {
    if (!tutorialActive) return;
    
    const stepIndex = steps.findIndex(step => step.id === featureId);
    if (stepIndex === -1) return;
    
    // If there's a condition and it returns false, don't highlight
    if (steps[stepIndex].condition && !steps[stepIndex].condition()) return;
    
    // Update the step state
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], state: 'highlighted' as TutorialState };
    setSteps(updatedSteps);
    
    // Set as current step
    setCurrentStep(updatedSteps[stepIndex]);
  };
  
  // Dismiss a tutorial step
  const dismissTutorial = (featureId: FeatureType) => {
    const stepIndex = steps.findIndex(step => step.id === featureId);
    if (stepIndex === -1) return;
    
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], state: 'dismissed' as TutorialState };
    setSteps(updatedSteps);
    
    // Clear current step if it's the one being dismissed
    if (currentStep?.id === featureId) {
      setCurrentStep(null);
      
      // Show the next step automatically if it exists
      const nextStepIndex = steps.findIndex(
        step => step.state === 'unseen' && step.order > updatedSteps[stepIndex].order
      );
      
      if (nextStepIndex !== -1) {
        setTimeout(() => highlightFeature(steps[nextStepIndex].id), 1000);
      }
    }
  };
  
  // Mark a tutorial step as completed
  const completeTutorial = (featureId: FeatureType) => {
    const stepIndex = steps.findIndex(step => step.id === featureId);
    if (stepIndex === -1) return;
    
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], state: 'seen' as TutorialState };
    setSteps(updatedSteps);
    
    // Clear current step if it's the one being completed
    if (currentStep?.id === featureId) {
      setCurrentStep(null);
    }
  };
  
  // Reset all tutorial steps to unseen
  const resetTutorial = () => {
    const resetSteps = defaultTutorialSteps.map(step => ({
      ...step,
      state: 'unseen' as TutorialState
    }));
    setSteps(resetSteps);
    setCurrentStep(null);
    setTutorialActive(true);
    setUserInteractionCount(
      Object.fromEntries(defaultTutorialSteps.map(step => [step.id, 0])) as Record<FeatureType, number>
    );
  };
  
  // Record an interaction with a feature
  const recordInteraction = (featureId: FeatureType) => {
    setUserInteractionCount(prev => {
      const newCount = { ...prev };
      newCount[featureId] = (newCount[featureId] || 0) + 1;
      return newCount;
    });
    
    // If the user has interacted with the feature multiple times,
    // consider it as seen even if they didn't complete the tutorial
    const interactionThreshold = 3;
    if (userInteractionCount[featureId] >= interactionThreshold) {
      completeTutorial(featureId);
    }
  };
  
  // Determine which feature to highlight based on user interaction
  useEffect(() => {
    if (!tutorialActive) return;
    
    // Find unseen steps with low interaction counts
    const unseenSteps = steps
      .filter(step => step.state === 'unseen')
      .sort((a, b) => {
        // First, sort by interaction count (ascending)
        const countDiff = (userInteractionCount[a.id] || 0) - (userInteractionCount[b.id] || 0);
        if (countDiff !== 0) return countDiff;
        
        // If interaction counts are the same, sort by order
        return a.order - b.order;
      });
    
    // If there's a current step or no unseen steps, don't do anything
    if (currentStep || unseenSteps.length === 0) return;
    
    // Highlight the first unseen step with the lowest interaction count
    const nextStep = unseenSteps[0];
    if (nextStep?.condition && !nextStep.condition()) return;
    
    // Delay showing the first tutorial to allow the UI to settle
    const timer = setTimeout(() => highlightFeature(nextStep.id), 2000);
    return () => clearTimeout(timer);
  }, [tutorialActive, steps, currentStep, userInteractionCount]);
  
  return (
    <TutorialContext.Provider
      value={{
        steps,
        currentStep,
        highlightFeature,
        dismissTutorial,
        completeTutorial,
        resetTutorial,
        tutorialActive,
        setTutorialActive,
        userInteractionCount,
        recordInteraction
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};