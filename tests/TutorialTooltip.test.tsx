import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TutorialTooltip } from '../client/src/components/tutorial/TutorialTooltip';
import { TutorialStep, FeatureType } from '../client/src/context/TutorialContext';

// Mock the useTutorial hook
vi.mock('../client/src/context/TutorialContext', () => ({
  useTutorial: () => ({
    dismissTutorial: vi.fn(),
    completeTutorial: vi.fn(),
    steps: [
      {
        id: 'layer_controls',
        title: 'Layer Controls',
        description: 'Adjust visibility of different layers',
        state: 'highlighted',
        order: 1
      },
      {
        id: 'landmark_editor',
        title: 'Landmark Editor',
        description: 'Edit landmark positions',
        state: 'unseen',
        order: 2
      }
    ],
    highlightFeature: vi.fn()
  }),
  FeatureType: {
    layer_controls: 'layer_controls',
    landmark_editor: 'landmark_editor'
  }
}));

// Mock document.querySelector
const mockQuerySelector = vi.fn().mockImplementation(() => ({
  getBoundingClientRect: () => ({
    top: 100,
    left: 100,
    right: 200,
    bottom: 200,
    width: 100,
    height: 100
  }),
  classList: {
    add: vi.fn(),
    remove: vi.fn()
  }
}));

document.querySelector = mockQuerySelector;

// Mock window
global.innerWidth = 1024;
global.innerHeight = 768;

describe('TutorialTooltip', () => {
  it('renders correctly with step information', () => {
    const mockStep: TutorialStep = {
      id: 'layer_controls' as FeatureType,
      title: 'Layer Controls',
      description: 'Adjust visibility of different layers',
      state: 'highlighted',
      element: '#layer-controls',
      position: 'bottom',
      order: 1
    };

    render(React.createElement(TutorialTooltip, { step: mockStep }));

    // Check if title and description are rendered
    expect(screen.getByText('Layer Controls')).toBeInTheDocument();
    expect(screen.getByText('Adjust visibility of different layers')).toBeInTheDocument();
    
    // Check if buttons are present
    expect(screen.getByText('Skip')).toBeInTheDocument();
    
    // Note: We can't check for "Got it" because the component uses "Next" or "Got it"
    // based on whether there's a next step, which is determined by the mocked useTutorial hook
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders with position styles when element is specified', () => {
    const mockStep: TutorialStep = {
      id: 'landmark_editor' as FeatureType,
      title: 'Landmark Editor',
      description: 'Edit landmark positions',
      state: 'highlighted',
      element: '#landmark-editor',
      position: 'right',
      order: 2
    };

    render(React.createElement(TutorialTooltip, { step: mockStep }));
    
    // Verify that the tooltip renders with the right content
    expect(screen.getByText('Landmark Editor')).toBeInTheDocument();
    expect(screen.getByText('Edit landmark positions')).toBeInTheDocument();
  });
});