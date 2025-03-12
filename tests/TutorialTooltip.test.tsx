import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TutorialTooltip } from '../client/src/components/tutorial/TutorialTooltip';
import { TutorialStep, FeatureType } from '../client/src/context/TutorialContext';

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
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    expect(dismissButton).toBeInTheDocument();
    
    const gotItButton = screen.getByRole('button', { name: /got it/i });
    expect(gotItButton).toBeInTheDocument();
  });

  it('renders with correct position class', () => {
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
    
    // Check for position class
    const tooltipElement = screen.getByRole('dialog');
    expect(tooltipElement).toHaveClass('right'); // This assumes your component adds a class based on position
  });
});