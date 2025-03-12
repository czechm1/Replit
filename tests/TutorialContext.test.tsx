import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TutorialProvider, useTutorial, TutorialStep, FeatureType } from '../client/src/context/TutorialContext';

// Mock component to test the context
function TutorialTester() {
  const { 
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
  } = useTutorial();

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Tutorial Tester'),
    React.createElement('div', { 'data-testid': 'steps-count' }, steps.length),
    React.createElement('div', { 'data-testid': 'current-step' }, currentStep?.id || 'none'),
    React.createElement('div', { 'data-testid': 'tutorial-active' }, tutorialActive ? 'active' : 'inactive'),
    React.createElement(
      'button',
      { 
        'data-testid': 'highlight-btn',
        onClick: () => highlightFeature('layer_controls')
      },
      'Highlight Controls'
    ),
    React.createElement(
      'button',
      { 
        'data-testid': 'dismiss-btn',
        onClick: () => dismissTutorial('layer_controls')
      },
      'Dismiss Controls'
    ),
    React.createElement(
      'button',
      { 
        'data-testid': 'complete-btn',
        onClick: () => completeTutorial('layer_controls')
      },
      'Complete Controls'
    ),
    React.createElement(
      'button',
      { 
        'data-testid': 'record-btn',
        onClick: () => recordInteraction('layer_controls')
      },
      'Record Interaction'
    ),
    React.createElement(
      'button',
      { 
        'data-testid': 'toggle-active-btn',
        onClick: () => setTutorialActive(!tutorialActive)
      },
      'Toggle Active'
    ),
    React.createElement(
      'button',
      { 
        'data-testid': 'reset-btn',
        onClick: () => resetTutorial()
      },
      'Reset Tutorial'
    ),
    React.createElement(
      'div',
      { 'data-testid': 'interaction-count' },
      userInteractionCount['layer_controls'] || 0
    )
  );
}

describe('TutorialContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Mock localStorage.getItem and clear any mocks
    vi.resetAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'tutorialSteps') return null;
      if (key === 'tutorialActive') return null;
      if (key === 'userInteractionCount') return null;
      return null;
    });
  });

  it('provides tutorial steps and functionality', () => {
    render(
      React.createElement(
        TutorialProvider,
        null,
        React.createElement(TutorialTester, null)
      )
    );

    // Check initial state
    expect(screen.getByTestId('steps-count').textContent).not.toBe('0');
    expect(screen.getByTestId('current-step').textContent).toBe('none');
    expect(screen.getByTestId('tutorial-active').textContent).toBe('active'); // Default is active in the context
    expect(screen.getByTestId('interaction-count').textContent).toBe('0');

    // Test highlighting a feature
    fireEvent.click(screen.getByTestId('highlight-btn'));
    expect(screen.getByTestId('current-step').textContent).toBe('layer_controls');

    // Test recording interaction
    fireEvent.click(screen.getByTestId('record-btn'));
    expect(screen.getByTestId('interaction-count').textContent).toBe('1');

    // Test dismissing tutorial
    fireEvent.click(screen.getByTestId('dismiss-btn'));
    expect(screen.getByTestId('current-step').textContent).toBe('none');

    // Test toggling active state
    fireEvent.click(screen.getByTestId('toggle-active-btn'));
    expect(screen.getByTestId('tutorial-active').textContent).toBe('inactive');

    // Test completing tutorial
    fireEvent.click(screen.getByTestId('highlight-btn')); // First highlight again
    fireEvent.click(screen.getByTestId('complete-btn'));
    expect(screen.getByTestId('current-step').textContent).toBe('none');

    // Test resetting tutorial
    fireEvent.click(screen.getByTestId('reset-btn'));
    // After reset, steps should be back to initial state
    expect(screen.getByTestId('tutorial-active').textContent).toBe('active');
  });
});