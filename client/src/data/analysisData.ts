// Sample data for the cephalometric analysis based on the screenshot
export interface CephalometricMeasurement {
  id: string;
  name: string;
  mean: number;
  sd: number;
  result: number;
  severity: string;
  polygonalChart?: boolean;
  meaning: string;
  inRange: boolean;
}

export const rickettsAnalysisData: CephalometricMeasurement[] = [
  {
    id: "facial_axis",
    name: "Facial axis",
    mean: 88.7,
    sd: 2.0,
    result: 85.51,
    severity: "",
    polygonalChart: true,
    meaning: "Vertically growing chin",
    inRange: false
  },
  {
    id: "facial_depth",
    name: "Facial depth",
    mean: 87.8,
    sd: 3.6,
    result: 86.48,
    severity: "",
    polygonalChart: true,
    meaning: "Normal Chin Prominence, Skeletal Class I",
    inRange: true
  },
  {
    id: "mandibular_plane_angle",
    name: "Mandibular plane angle(Ricketts)",
    mean: 25,
    sd: 4.5,
    result: 24.09,
    severity: "",
    polygonalChart: true,
    meaning: "Normodivergent facial pattern",
    inRange: true
  },
  {
    id: "facial_taper",
    name: "Facial taper",
    mean: 68,
    sd: 3.0,
    result: 71.29,
    severity: "",
    polygonalChart: true,
    meaning: "Long facial taper, Dolicholic tendency",
    inRange: false
  },
  {
    id: "mandibular_arc",
    name: "Mandibular arc",
    mean: 26,
    sd: 2.0,
    result: 28.95,
    severity: "",
    polygonalChart: true,
    meaning: "Acutely bent mandibular corpus and ramus",
    inRange: false
  },
  {
    id: "convexity_of_point_a",
    name: "Convexity of Point A",
    mean: 2,
    sd: 2.0,
    result: 1.90,
    severity: "",
    polygonalChart: true,
    meaning: "Skeletal Class I pattern",
    inRange: true
  },
  {
    id: "palatal_plane_angle",
    name: "Palatal plane angle",
    mean: 0,
    sd: 5.0,
    result: 4.45,
    severity: "",
    polygonalChart: true,
    meaning: "Normal palatal plane angle",
    inRange: true
  },
  {
    id: "denture_height",
    name: "Denture height(Lower facial height)",
    mean: 47,
    sd: 4.0,
    result: 49.53,
    severity: "",
    polygonalChart: true,
    meaning: "Normal lower facial height",
    inRange: true
  },
  {
    id: "l1_to_a_po_deg",
    name: "L1 to A-Po(deg)",
    mean: 22,
    sd: 4.0,
    result: 19.87,
    severity: "",
    polygonalChart: true,
    meaning: "Normal lower incisor inclination",
    inRange: true
  },
  {
    id: "l1_to_a_po_mm",
    name: "L1 to A-Po(mm)",
    mean: 1,
    sd: 2.0,
    result: 4.33,
    severity: "",
    polygonalChart: true,
    meaning: "Protruded lower incisor",
    inRange: false
  },
  {
    id: "upper_molar_to_ptv",
    name: "Upper molar to PTV",
    mean: 21.1,
    sd: 3.0,
    result: 19.72,
    severity: "",
    polygonalChart: true,
    meaning: "Normal upper molar position (A-P direction)",
    inRange: true
  },
  {
    id: "interincisal_angle",
    name: "Interincisal angle",
    mean: 128,
    sd: 5.3,
    result: 134.32,
    severity: "",
    polygonalChart: true,
    meaning: "Upright interincisal angle",
    inRange: false
  },
  {
    id: "lower_lip_to_e_plane",
    name: "Lower lip to E-plane",
    mean: 0,
    sd: 2.0,
    result: 1.72,
    severity: "",
    polygonalChart: true,
    meaning: "Normal lower lip position",
    inRange: true
  }
];