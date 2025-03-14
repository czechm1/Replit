import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export interface LandmarkData {
  id?: string;
  name: string;
  abbreviation: string;
  description?: string;
  confidence?: number;
  anatomicalRegion?: string;
  clinicalSignificance?: string;
}

interface LandmarkTooltipProps {
  landmark: LandmarkData;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

/**
 * A component that displays a tooltip with medical information when hovering over a landmark
 */
export function LandmarkTooltip({ 
  landmark, 
  children, 
  side = 'right',
  align = 'center' 
}: LandmarkTooltipProps) {
  const confidenceLevel = landmark.confidence ? 
    landmark.confidence >= 0.8 ? 'high' : 
    landmark.confidence >= 0.5 ? 'medium' : 'low' 
    : 'unknown';
  
  const confidenceVariant = 
    confidenceLevel === 'high' ? 'success' : 
    confidenceLevel === 'medium' ? 'warning' : 
    'destructive';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className="max-w-[300px] z-50 bg-background/95 backdrop-blur-sm border-2 border-primary/20 shadow-lg"
          sideOffset={5}
        >
          <div className="space-y-2 p-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{landmark.name}</h4>
              <Badge variant="outline" className="ml-1 text-xs">
                {landmark.abbreviation}
              </Badge>
            </div>
            
            {landmark.anatomicalRegion && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Region:</span> {landmark.anatomicalRegion}
              </div>
            )}
            
            {landmark.description && (
              <p className="text-xs leading-snug">{landmark.description}</p>
            )}
            
            {landmark.clinicalSignificance && (
              <div className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">Clinical Significance:</span> {landmark.clinicalSignificance}
              </div>
            )}
            
            {landmark.confidence && (
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-primary/10">
                <span className="text-xs text-muted-foreground">Detection Confidence:</span>
                <Badge variant={confidenceVariant as any} className="text-[10px]">
                  {(landmark.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}