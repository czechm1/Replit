import { Landmark, LandmarksCollection } from "@shared/schema";
import { nanoid } from "nanoid";

// Common cephalometric landmarks with their standard locations (relative coordinates 0-1)
const STANDARD_LANDMARKS: Omit<Landmark, "id">[] = [
  { name: "Nasion", abbreviation: "N", x: 0.5, y: 0.32, description: "The point at the junction of the nasal and frontal bones" },
  { name: "Sella", abbreviation: "S", x: 0.48, y: 0.34, description: "The center of the sella turcica" },
  { name: "Orbitale", abbreviation: "Or", x: 0.58, y: 0.46, description: "The lowest point on the infraorbital margin" },
  { name: "Porion", abbreviation: "Po", x: 0.22, y: 0.44, description: "The uppermost point of the external auditory meatus" },
  { name: "A Point", abbreviation: "A", x: 0.56, y: 0.53, description: "The deepest point of the maxillary concavity" },
  { name: "B Point", abbreviation: "B", x: 0.54, y: 0.66, description: "The deepest point of the mandibular concavity" },
  { name: "Pogonion", abbreviation: "Pog", x: 0.54, y: 0.72, description: "The most anterior point of the mandibular symphysis" },
  { name: "Gnathion", abbreviation: "Gn", x: 0.53, y: 0.76, description: "The most anterior-inferior point on the mandibular symphysis" },
  { name: "Menton", abbreviation: "Me", x: 0.52, y: 0.78, description: "The lowermost point on the mandibular symphysis" },
  { name: "Gonion", abbreviation: "Go", x: 0.26, y: 0.7, description: "The most posterior-inferior point on the mandibular angle" },
  { name: "Articulare", abbreviation: "Ar", x: 0.27, y: 0.42, description: "The intersection of the posterior border of the mandible with the inferior border of the skull base" },
  { name: "Anterior Nasal Spine", abbreviation: "ANS", x: 0.56, y: 0.49, description: "The anterior tip of the nasal spine" },
  { name: "Posterior Nasal Spine", abbreviation: "PNS", x: 0.35, y: 0.49, description: "The posterior tip of the nasal spine" },
  { name: "Upper Incisor Edge", abbreviation: "UIE", x: 0.6, y: 0.57, description: "The incisal edge of the most forward upper incisor" },
  { name: "Upper Incisor Apex", abbreviation: "UIA", x: 0.56, y: 0.51, description: "The root apex of the most forward upper incisor" },
  { name: "Lower Incisor Edge", abbreviation: "LIE", x: 0.58, y: 0.62, description: "The incisal edge of the most forward lower incisor" },
  { name: "Lower Incisor Apex", abbreviation: "LIA", x: 0.56, y: 0.68, description: "The root apex of the most forward lower incisor" },
  { name: "Upper Molar", abbreviation: "UM", x: 0.42, y: 0.52, description: "The mesial cusp tip of the upper first molar" },
  { name: "Lower Molar", abbreviation: "LM", x: 0.4, y: 0.6, description: "The mesial cusp tip of the lower first molar" },
  { name: "Soft Tissue Nasion", abbreviation: "N'", x: 0.52, y: 0.31, description: "The soft tissue point corresponding to nasion" },
  { name: "Pronasale", abbreviation: "Pn", x: 0.66, y: 0.4, description: "The most prominent point of the nose" },
  { name: "Subnasale", abbreviation: "Sn", x: 0.62, y: 0.49, description: "The point where the nose connects with the upper lip" },
  { name: "Labrale Superius", abbreviation: "Ls", x: 0.61, y: 0.52, description: "The most anterior point of the upper lip" },
  { name: "Labrale Inferius", abbreviation: "Li", x: 0.6, y: 0.58, description: "The most anterior point of the lower lip" },
  { name: "Soft Tissue Pogonion", abbreviation: "Pog'", x: 0.56, y: 0.72, description: "The most anterior point of the soft tissue chin" }
];

// Add random variation to simulate automatic detection
function randomizePosition(value: number, variance: number = 0.02): number {
  return Math.max(0, Math.min(1, value + (Math.random() - 0.5) * variance));
}

// Simulate automatic landmark detection
export function detectLandmarks(
  imageWidth: number,
  imageHeight: number,
  patientId: string,
  imageId: string = "default"
): LandmarksCollection {
  const landmarks: Landmark[] = STANDARD_LANDMARKS.map(landmark => ({
    ...landmark,
    id: nanoid(),
    // Add random variation to x, y coordinates
    x: randomizePosition(landmark.x),
    y: randomizePosition(landmark.y)
  }));

  // Create a landmarks collection
  const collection: LandmarksCollection = {
    id: nanoid(),
    patientId,
    imageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedBy: "Auto-detection",
    landmarks,
    // Additional metadata is not part of the schema, so we'll omit it
  };

  return collection;
}

// Generate tracing points for different anatomical structures
export function generateTracingPoints(
  imageWidth: number, 
  imageHeight: number,
  landmarks: Landmark[]
): Record<string, number[][]> {
  // Find key landmarks by abbreviation
  const findLandmark = (abbr: string): Landmark | undefined => 
    landmarks.find(l => l.abbreviation === abbr);

  // Create a function to generate a curve between landmarks with additional control points
  const generateCurve = (
    startLandmark: Landmark | undefined,
    endLandmark: Landmark | undefined,
    controlPoints: Array<{x: number, y: number}> = [],
    pointCount: number = 25
  ): number[][] => {
    if (!startLandmark || !endLandmark) return [];
    
    const points: number[][] = [];
    const start = {x: startLandmark.x, y: startLandmark.y};
    const end = {x: endLandmark.x, y: endLandmark.y};
    
    // Simple case: straight line with slight random variation
    if (controlPoints.length === 0) {
      for (let i = 0; i <= pointCount; i++) {
        const t = i / pointCount;
        const randomX = (Math.random() - 0.5) * 0.005;
        const randomY = (Math.random() - 0.5) * 0.005;
        const x = start.x + t * (end.x - start.x) + randomX;
        const y = start.y + t * (end.y - start.y) + randomY;
        points.push([x, y]);
      }
      return points;
    }
    
    // Bezier curve with control points
    for (let i = 0; i <= pointCount; i++) {
      const t = i / pointCount;
      let x = 0, y = 0;
      
      if (controlPoints.length === 1) {
        // Quadratic Bezier curve
        const p0 = start;
        const p1 = controlPoints[0];
        const p2 = end;
        
        x = Math.pow(1-t, 2) * p0.x + 2 * (1-t) * t * p1.x + Math.pow(t, 2) * p2.x;
        y = Math.pow(1-t, 2) * p0.y + 2 * (1-t) * t * p1.y + Math.pow(t, 2) * p2.y;
      } else {
        // Cubic Bezier curve (or more complex curves for more control points)
        const p0 = start;
        const p1 = controlPoints[0];
        const p2 = controlPoints[1];
        const p3 = end;
        
        x = Math.pow(1-t, 3) * p0.x + 3 * Math.pow(1-t, 2) * t * p1.x + 
            3 * (1-t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        y = Math.pow(1-t, 3) * p0.y + 3 * Math.pow(1-t, 2) * t * p1.y + 
            3 * (1-t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
      }
      
      points.push([x, y]);
    }
    
    return points;
  };

  // Get key landmarks
  const n = findLandmark("N");
  const s = findLandmark("S");
  const or = findLandmark("Or");
  const po = findLandmark("Po");
  const a = findLandmark("A");
  const b = findLandmark("B");
  const pog = findLandmark("Pog");
  const gn = findLandmark("Gn");
  const me = findLandmark("Me");
  const go = findLandmark("Go");
  const ar = findLandmark("Ar");
  const ans = findLandmark("ANS");
  const pns = findLandmark("PNS");
  const uie = findLandmark("UIE");
  const uia = findLandmark("UIA");
  const lie = findLandmark("LIE");
  const lia = findLandmark("LIA");
  const um = findLandmark("UM");
  const lm = findLandmark("LM");
  
  // Generate tracing lines for different anatomical structures
  const tracings: Record<string, number[][]> = {
    // Cranial base
    cranialBase: generateCurve(s, n, [{ x: 0.4, y: 0.32 }]),
    
    // Maxilla
    maxilla: generateCurve(pns, ans, [
      { x: 0.42, y: 0.48 }, 
      { x: 0.48, y: 0.47 }
    ]),
    
    // Mandible outline
    mandible: generateCurve(ar, me, [
      { x: 0.26, y: 0.5 },
      { x: 0.28, y: 0.62 },
      { x: go?.x || 0.26, y: go?.y || 0.7 },
      { x: 0.36, y: 0.76 },
      { x: 0.44, y: 0.78 },
    ], 40),
    
    // Mandible symphysis
    mandibleSymphysis: generateCurve(me, b, [
      { x: 0.52, y: 0.76 },
      { x: pog?.x || 0.54, y: pog?.y || 0.72 }
    ]),
    
    // Upper incisor
    upperIncisor: um && uia && uie ? [
      [uia.x, uia.y],
      [uie.x, uie.y]
    ] : [],
    
    // Lower incisor
    lowerIncisor: lm && lia && lie ? [
      [lia.x, lia.y],
      [lie.x, lie.y]
    ] : [],
    
    // Frankfort horizontal plane
    frankfortHorizontal: po && or ? [
      [po.x, po.y],
      [or.x, or.y]
    ] : [],
    
    // Soft tissue profile
    softTissueProfile: generateCurve(
      findLandmark("N'"), 
      findLandmark("Pog'"), 
      [
        { x: 0.58, y: 0.34 }, // Forehead
        { x: findLandmark("Pn")?.x || 0.66, y: findLandmark("Pn")?.y || 0.4 }, // Nose
        { x: findLandmark("Sn")?.x || 0.62, y: findLandmark("Sn")?.y || 0.49 }, // Subnasale
        { x: findLandmark("Ls")?.x || 0.61, y: findLandmark("Ls")?.y || 0.52 }, // Upper lip
        { x: findLandmark("Li")?.x || 0.6, y: findLandmark("Li")?.y || 0.58 }, // Lower lip
      ],
      40
    )
  };

  return tracings;
}

// Function to compute basic measurements from landmarks
export function computeMeasurements(landmarks: Landmark[]): Record<string, number> {
  // Find landmarks by abbreviation
  const findLandmark = (abbr: string): Landmark | undefined => 
    landmarks.find(l => l.abbreviation === abbr);
  
  // Calculate angle between three points (in degrees)
  const calculateAngle = (p1?: Landmark, p2?: Landmark, p3?: Landmark): number => {
    if (!p1 || !p2 || !p3) return 0;
    
    const vector1 = {
      x: p1.x - p2.x,
      y: p1.y - p2.y
    };
    
    const vector2 = {
      x: p3.x - p2.x,
      y: p3.y - p2.y
    };
    
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    const angle = Math.acos(dotProduct / (mag1 * mag2));
    return angle * (180 / Math.PI);
  };
  
  // Calculate distance between two points
  const calculateDistance = (p1?: Landmark, p2?: Landmark): number => {
    if (!p1 || !p2) return 0;
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };
  
  // Get key landmarks
  const n = findLandmark("N");
  const s = findLandmark("S");
  const or = findLandmark("Or");
  const po = findLandmark("Po");
  const a = findLandmark("A");
  const b = findLandmark("B");
  const pog = findLandmark("Pog");
  const gn = findLandmark("Gn");
  const me = findLandmark("Me");
  const go = findLandmark("Go");
  const ar = findLandmark("Ar");
  const ans = findLandmark("ANS");
  const pns = findLandmark("PNS");
  const uie = findLandmark("UIE");
  const uia = findLandmark("UIA");
  const lie = findLandmark("LIE");
  const lia = findLandmark("LIA");
  
  // Calculate common cephalometric measurements
  const measurements: Record<string, number> = {
    // Angular measurements
    SNA: calculateAngle(s, n, a), // Sella-Nasion-A Point angle
    SNB: calculateAngle(s, n, b), // Sella-Nasion-B Point angle
    ANB: n && s && a && b ? calculateAngle(s, n, a) - calculateAngle(s, n, b) : 0, // A Point-Nasion-B Point angle
    FMA: calculateAngle(po, or, me), // Frankfort-Mandibular Angle
    IMPA: calculateAngle(go, me, lie), // Incisor-Mandibular Plane Angle
    FMIA: or && po && lie && lia ? 180 - calculateAngle(po, or, me) - calculateAngle(go, me, lie) : 0, // Frankfort-Mandibular Incisor Angle
    
    // Linear measurements
    overjet: uie && lie ? Math.abs(uie.x - lie.x) * 100 : 0, // Horizontal distance between upper and lower incisors
    overbite: uie && lie ? Math.abs(uie.y - lie.y) * 100 : 0, // Vertical distance between upper and lower incisors
    
    // Facial proportions (relative values)
    upperFacialHeight: calculateDistance(n, ans) * 100,
    lowerFacialHeight: calculateDistance(ans, me) * 100,
    anteriorFacialHeight: calculateDistance(n, me) * 100,
    posteriorFacialHeight: calculateDistance(s, go) * 100,
    
    // Dental angles
    upperIncisalAngle: calculateAngle(s, n, uie), // Upper incisor to S-N line
    lowerIncisalAngle: calculateAngle(go, me, lie), // Lower incisor to mandibular plane
    interincisalAngle: calculateAngle(uia, uie, lie), // Angle between upper and lower incisors
    
    // Soft tissue measurements
    nasolabialAngle: calculateAngle(
      findLandmark("Pn"), 
      findLandmark("Sn"), 
      findLandmark("Ls")
    ),
    
    // Wits appraisal (simplified)
    witsAppraisal: a && b && or && po ? 
      ((a.y - or.y) / (po.y - or.y) - (b.y - or.y) / (po.y - or.y)) * 100 : 0,
  };
  
  return measurements;
}