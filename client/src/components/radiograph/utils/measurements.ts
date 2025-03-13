// measurements.ts
import { LandmarkPoint } from '../types';
import { angle } from './angleCalculations';
import { pointToPointDistance } from './pointOperations';
import { pointToLineDistance } from './lineOperations';

export interface CephalometricMeasurements {
  angles: {
    sna: number;      // Sella-Nasion-A point angle
    snb: number;      // Sella-Nasion-B point angle
    anb: number;      // A point-Nasion-B point angle
    fma: number;      // Frankfort-Mandibular plane angle
    impa: number;     // Incisor-Mandibular plane angle
    fmia: number;     // Frankfort-Mandibular-Incisor angle
    interincisal: number; // Upper to lower incisor angle
    facialConvexity: number; // Facial convexity angle
  };
  distances: {
    anteriorFacialHeight: number;  // N-Me distance
    posteriorFacialHeight: number; // S-Go distance
    upperLipToELine: number;       // Upper lip to E-line distance
    lowerLipToELine: number;       // Lower lip to E-line distance
    overjet: number;               // Horizontal distance between U1 and L1
    overbite: number;              // Vertical distance between U1 and L1
  };
}

export function calculateCephalometricMeasurements(
  points: LandmarkPoint[]
): CephalometricMeasurements {
  // Helper function to find a point by landmark name
  const findPoint = (landmark: string): LandmarkPoint => {
    const point = points.find(p => p.landmark === landmark);
    if (!point) throw new Error(`Landmark ${landmark} not found`);
    return point;
  };

  // Get required landmarks
  const S = findPoint('S');
  const Na = findPoint('Na');
  const A = findPoint('A');
  const B = findPoint('B');
  const Pog = findPoint('Pog');
  const Gn = findPoint('Gn');
  const Go = findPoint('Go');
  const Me = findPoint('Me');
  const Po = findPoint('Po');
  const Or = findPoint('Or');
  const U1 = findPoint('U1IncisalTip');
  const U1Root = findPoint('U1RootTip');
  const L1 = findPoint('L1IncisalTip');
  const L1Root = findPoint('L1RootTip');
  const UL = findPoint('UpperLip');
  const LL = findPoint('LowerLip');
  const Prn = findPoint('Prn');

  // Calculate angles
  const sna = angle(S, Na, A);
  const snb = angle(S, Na, B);
  const anb = sna - snb;
  const fma = angle(Po, Or, Me);
  const impa = angle(Go, Me, L1);
  const fmia = angle(Po, Or, L1);
  const interincisal = angle(U1Root, U1, L1);
  const facialConvexity = angle(Na, A, Pog);

  // Calculate distances
  const anteriorFacialHeight = pointToPointDistance(
    Na.coordinates,
    Me.coordinates
  );
  const posteriorFacialHeight = pointToPointDistance(
    S.coordinates,
    Go.coordinates
  );

  // E-line (esthetic line) measurements
  const upperLipToELine = pointToLineDistance(
    Prn.coordinates,
    Pog.coordinates,
    UL.coordinates
  );
  const lowerLipToELine = pointToLineDistance(
    Prn.coordinates,
    Pog.coordinates,
    LL.coordinates
  );

  // Dental measurements
  const overjet = Math.abs(U1.coordinates.x - L1.coordinates.x);
  const overbite = Math.abs(U1.coordinates.y - L1.coordinates.y);

  return {
    angles: {
      sna,
      snb,
      anb,
      fma,
      impa,
      fmia,
      interincisal,
      facialConvexity
    },
    distances: {
      anteriorFacialHeight,
      posteriorFacialHeight,
      upperLipToELine,
      lowerLipToELine,
      overjet,
      overbite
    }
  };
}
