interface Point {
  x: number;
  y: number;
}

interface LandmarkConnection {
  from: string;
  to: string;
  type: 'line' | 'curve';
  style: 'solid' | 'dashed';
}

interface LineStyle {
  strokeDasharray: string;
  strokeWidth: number;
}

// Landmark connection definitions
export const landmarkConnections: Record<string, LandmarkConnection[]> = {
  // Skeletal outline connections
  skeletalOutline: [
    { from: 'Na', to: 'G', type: 'line', style: 'solid' },
    { from: 'Na', to: 'S', type: 'line', style: 'solid' },
    { from: 'S', to: 'SOr', type: 'line', style: 'solid' },
    { from: 'SOr', to: 'Or', type: 'line', style: 'solid' },
    { from: 'Or', to: 'ANS', type: 'line', style: 'solid' },
    { from: 'ANS', to: 'A', type: 'line', style: 'solid' },
    { from: 'A', to: 'UL', type: 'line', style: 'solid' },
    { from: 'UL', to: 'LL', type: 'line', style: 'solid' },
    { from: 'LL', to: 'B', type: 'line', style: 'solid' },
    { from: 'B', to: 'Pog', type: 'line', style: 'solid' },
    { from: 'Pog', to: 'Me', type: 'line', style: 'solid' },
    { from: 'Me', to: "Me'", type: 'line', style: 'solid' },
  ],

  // Soft tissue outline
  softTissueOutline: [
    { from: 'G', to: "Na'", type: 'curve', style: 'solid' },
    { from: "Na'", to: "A'", type: 'curve', style: 'solid' },
    { from: "A'", to: 'UL', type: 'curve', style: 'solid' },
    { from: 'UL', to: 'LL', type: 'curve', style: 'solid' },
    { from: 'LL', to: "B'", type: 'curve', style: 'solid' },
    { from: "B'", to: "Pog'", type: 'curve', style: 'solid' },
    { from: "Pog'", to: "Me'", type: 'curve', style: 'solid' },
  ],

  // Dental connections
  dentalOutline: [
    { from: 'PNS', to: 'ANS', type: 'line', style: 'solid' }, // Palatal plane
    { from: 'Xi', to: 'DC', type: 'line', style: 'dashed' },
    { from: 'DC', to: 'R1', type: 'line', style: 'dashed' },
    { from: 'R3', to: 'Po', type: 'line', style: 'dashed' },
  ],
};

// Helper function to create SVG path data for curved connections
export function createCurvePath(
  startPoint: Point,
  endPoint: Point,
  curvature = 0.2,
): string {
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;

  // Calculate control point offset
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const normalX = -dy * curvature;
  const normalY = dx * curvature;

  return `M ${startPoint.x},${startPoint.y} Q ${midX + normalX},${midY + normalY} ${endPoint.x},${endPoint.y}`;
}

// Helper function to get line style attributes
export function getLineStyle(style: 'solid' | 'dashed'): LineStyle {
  switch (style) {
    case 'dashed':
      return {
        strokeDasharray: '4,4',
        strokeWidth: 1.5,
      };
    case 'solid':
    default:
      return {
        strokeDasharray: 'none',
        strokeWidth: 1.5,
      };
  }
}
