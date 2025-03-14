/**
 * Detailed medical descriptions for cephalometric landmarks
 * These descriptions provide anatomical context and clinical significance
 * for each landmark used in cephalometric analysis
 */

export interface LandmarkDescription {
  abbreviation: string;
  name: string;
  description: string;
  anatomicalRegion: string;
  clinicalSignificance: string;
}

export const landmarkDescriptions: Record<string, LandmarkDescription> = {
  // Skeletal landmarks
  Na: {
    abbreviation: 'Na',
    name: 'Nasion',
    description: 'The most anterior point of the frontonasal suture in the midsagittal plane.',
    anatomicalRegion: 'Frontonasal Suture',
    clinicalSignificance: 'Reference point for evaluating the position of the maxilla and mandible relative to the cranial base.'
  },
  S: {
    abbreviation: 'S',
    name: 'Sella',
    description: 'The midpoint of the pituitary fossa (sella turcica) of the sphenoid bone.',
    anatomicalRegion: 'Cranial Base',
    clinicalSignificance: 'Primary reference point for superimposing serial cephalometric tracings and measuring growth changes.'
  },
  Or: {
    abbreviation: 'Or',
    name: 'Orbitale',
    description: 'The lowest point on the infraorbital margin of the orbit.',
    anatomicalRegion: 'Infraorbital Rim',
    clinicalSignificance: 'Used to establish the Frankfort horizontal plane; important for orienting the head in a standardized position.'
  },
  Po: {
    abbreviation: 'Po',
    name: 'Porion',
    description: 'The most superior point of the external auditory meatus.',
    anatomicalRegion: 'Temporal Bone',
    clinicalSignificance: 'Used with Orbitale to establish the Frankfort horizontal plane; crucial for standardized head positioning.'
  },
  A: {
    abbreviation: 'A',
    name: 'A Point (Subspinale)',
    description: 'The most posterior point on the anterior contour of the maxillary alveolar process in the midsagittal plane.',
    anatomicalRegion: 'Maxilla',
    clinicalSignificance: 'Used to assess the anteroposterior position of the maxilla relative to the cranial base.'
  },
  B: {
    abbreviation: 'B',
    name: 'B Point (Supramentale)',
    description: 'The most posterior point on the anterior contour of the mandibular alveolar process in the midsagittal plane.',
    anatomicalRegion: 'Mandible',
    clinicalSignificance: 'Used to assess the anteroposterior position of the mandible relative to the cranial base.'
  },
  Pog: {
    abbreviation: 'Pog',
    name: 'Pogonion',
    description: 'The most anterior point of the mandibular symphysis in the midsagittal plane.',
    anatomicalRegion: 'Mandibular Symphysis',
    clinicalSignificance: 'Used to evaluate chin prominence and mandibular growth direction.'
  },
  Gn: {
    abbreviation: 'Gn',
    name: 'Gnathion',
    description: 'The most anteroinferior point on the mandibular symphysis in the midsagittal plane.',
    anatomicalRegion: 'Mandibular Symphysis',
    clinicalSignificance: 'Used to evaluate mandibular growth and facial height.'
  },
  Me: {
    abbreviation: 'Me',
    name: 'Menton',
    description: 'The most inferior point of the mandibular symphysis in the midsagittal plane.',
    anatomicalRegion: 'Mandibular Symphysis',
    clinicalSignificance: 'Used to measure anterior facial height and evaluate vertical facial proportions.'
  },
  Go: {
    abbreviation: 'Go',
    name: 'Gonion',
    description: 'The most posterior and inferior point on the angle of the mandible.',
    anatomicalRegion: 'Mandibular Angle',
    clinicalSignificance: 'Used to evaluate mandibular growth direction and facial type (vertical or horizontal).'
  },
  ANS: {
    abbreviation: 'ANS',
    name: 'Anterior Nasal Spine',
    description: 'The most anterior point of the nasal floor at the tip of the premaxilla on the midsagittal plane.',
    anatomicalRegion: 'Maxilla',
    clinicalSignificance: 'Used to evaluate nasal floor inclination and anterior maxillary height.'
  },
  PNS: {
    abbreviation: 'PNS',
    name: 'Posterior Nasal Spine',
    description: 'The most posterior point at the sagittal plane on the bony hard palate.',
    anatomicalRegion: 'Maxilla',
    clinicalSignificance: 'Used to evaluate the length of the maxillary base and palatal plane inclination.'
  },
  Ar: {
    abbreviation: 'Ar',
    name: 'Articulare',
    description: 'The point of intersection of the posterior border of the condylar process of the mandible and the temporal bone.',
    anatomicalRegion: 'Temporomandibular Joint',
    clinicalSignificance: 'Used to evaluate the position of the condyle and measure the posterior facial height.'
  },
  Ba: {
    abbreviation: 'Ba',
    name: 'Basion',
    description: 'The most posterior and inferior point on the anterior margin of the foramen magnum in the midsagittal plane.',
    anatomicalRegion: 'Occipital Bone',
    clinicalSignificance: 'Used to evaluate cranial base flexure and cranial morphology.'
  },
  Xi: {
    abbreviation: 'Xi',
    name: 'Xi Point',
    description: 'The point located at the center of the ramus determined by geometric construction.',
    anatomicalRegion: 'Mandibular Ramus',
    clinicalSignificance: 'Used in Ricketts analysis to evaluate mandibular growth direction and lower facial height.'
  },
  PM: {
    abbreviation: 'PM',
    name: 'Protuberance Menti',
    description: 'The point where the curvature of the anterior border of the symphysis changes from concave to convex.',
    anatomicalRegion: 'Mandibular Symphysis',
    clinicalSignificance: 'Used to evaluate chin morphology and mandibular growth pattern.'
  },

  // Dental landmarks
  U1IncisalTip: {
    abbreviation: 'U1',
    name: 'Upper Incisor Incisal Edge',
    description: 'The tip of the crown of the most prominent upper central incisor.',
    anatomicalRegion: 'Maxillary Dentition',
    clinicalSignificance: 'Used to evaluate upper incisor position, inclination, and vertical position.'
  },
  U1RootTip: {
    abbreviation: 'U1R',
    name: 'Upper Incisor Root Apex',
    description: 'The root apex of the most prominent upper central incisor.',
    anatomicalRegion: 'Maxillary Dentition',
    clinicalSignificance: 'Used with the incisal edge to determine upper incisor inclination.'
  },
  L1IncisalTip: {
    abbreviation: 'L1',
    name: 'Lower Incisor Incisal Edge',
    description: 'The tip of the crown of the most prominent lower central incisor.',
    anatomicalRegion: 'Mandibular Dentition',
    clinicalSignificance: 'Used to evaluate lower incisor position, inclination, and vertical position.'
  },
  L1RootTip: {
    abbreviation: 'L1R',
    name: 'Lower Incisor Root Apex',
    description: 'The root apex of the most prominent lower central incisor.',
    anatomicalRegion: 'Mandibular Dentition',
    clinicalSignificance: 'Used with the incisal edge to determine lower incisor inclination.'
  },
  U6Mesial: {
    abbreviation: 'U6M',
    name: 'Upper First Molar Mesial Contact',
    description: 'The most mesial point on the crown of the upper first molar at the level of the occlusal plane.',
    anatomicalRegion: 'Maxillary Dentition',
    clinicalSignificance: 'Used to evaluate upper molar position and dental relationships.'
  },
  U6Distal: {
    abbreviation: 'U6D',
    name: 'Upper First Molar Distal Contact',
    description: 'The most distal point on the crown of the upper first molar at the level of the occlusal plane.',
    anatomicalRegion: 'Maxillary Dentition',
    clinicalSignificance: 'Used to evaluate upper molar position and dental relationships.'
  },
  L6Mesial: {
    abbreviation: 'L6M',
    name: 'Lower First Molar Mesial Contact',
    description: 'The most mesial point on the crown of the lower first molar at the level of the occlusal plane.',
    anatomicalRegion: 'Mandibular Dentition',
    clinicalSignificance: 'Used to evaluate lower molar position and dental relationships.'
  },
  L6Distal: {
    abbreviation: 'L6D',
    name: 'Lower First Molar Distal Contact',
    description: 'The most distal point on the crown of the lower first molar at the level of the occlusal plane.',
    anatomicalRegion: 'Mandibular Dentition',
    clinicalSignificance: 'Used to evaluate lower molar position and dental relationships.'
  },

  // Soft tissue landmarks
  G: {
    abbreviation: 'G',
    name: 'Glabella',
    description: 'The most prominent point on the frontal bone in the midsagittal plane.',
    anatomicalRegion: 'Forehead',
    clinicalSignificance: 'Used to evaluate forehead contour and soft tissue profile.'
  },
  Prn: {
    abbreviation: 'Prn',
    name: 'Pronasale',
    description: 'The most anterior point of the nose in the midsagittal plane.',
    anatomicalRegion: 'Nose',
    clinicalSignificance: 'Used to evaluate nasal projection and profile.'
  },
  Subnasale: {
    abbreviation: 'Sn',
    name: 'Subnasale',
    description: 'The point where the columella of the nose meets the upper lip in the midsagittal plane.',
    anatomicalRegion: 'Nasolabial Region',
    clinicalSignificance: 'Used to evaluate nasolabial angle and upper lip position.'
  },
  SoftTissueA: {
    abbreviation: 'A\'',
    name: 'Soft Tissue A Point',
    description: 'The point of greatest concavity in the midline of the upper lip between Subnasale and Labrale Superius.',
    anatomicalRegion: 'Upper Lip',
    clinicalSignificance: 'Used to evaluate upper lip support and soft tissue profile.'
  },
  LabraleSuperius: {
    abbreviation: 'Ls',
    name: 'Labrale Superius',
    description: 'The most anterior point of the upper lip in the midsagittal plane.',
    anatomicalRegion: 'Upper Lip',
    clinicalSignificance: 'Used to evaluate upper lip position and projection.'
  },
  LabraleInferius: {
    abbreviation: 'Li',
    name: 'Labrale Inferius',
    description: 'The most anterior point of the lower lip in the midsagittal plane.',
    anatomicalRegion: 'Lower Lip',
    clinicalSignificance: 'Used to evaluate lower lip position and projection.'
  },
  SoftTissueB: {
    abbreviation: 'B\'',
    name: 'Soft Tissue B Point',
    description: 'The point of greatest concavity in the midline of the lower lip between Labrale Inferius and Soft Tissue Pogonion.',
    anatomicalRegion: 'Lower Lip',
    clinicalSignificance: 'Used to evaluate lower lip support and soft tissue profile.'
  },
  SoftTissuePog: {
    abbreviation: 'Pog\'',
    name: 'Soft Tissue Pogonion',
    description: 'The most anterior point on the soft tissue chin in the midsagittal plane.',
    anatomicalRegion: 'Chin',
    clinicalSignificance: 'Used to evaluate chin projection and soft tissue profile.'
  },
  SoftTissueGn: {
    abbreviation: 'Gn\'',
    name: 'Soft Tissue Gnathion',
    description: 'The most anteroinferior point on the soft tissue chin in the midsagittal plane.',
    anatomicalRegion: 'Chin',
    clinicalSignificance: 'Used to evaluate chin morphology and soft tissue profile.'
  },
  SoftTissueMe: {
    abbreviation: 'Me\'',
    name: 'Soft Tissue Menton',
    description: 'The most inferior point on the soft tissue chin in the midsagittal plane.',
    anatomicalRegion: 'Chin',
    clinicalSignificance: 'Used to evaluate the vertical dimension of the soft tissue lower face.'
  },
  SoftTissueNa: {
    abbreviation: 'Na\'',
    name: 'Soft Tissue Nasion',
    description: 'The deepest point of the soft tissue concavity between the forehead and the nose.',
    anatomicalRegion: 'Bridge of Nose',
    clinicalSignificance: 'Used as a reference point for soft tissue analysis of the face.'
  },
  DorsumOfNose: {
    abbreviation: 'Dn',
    name: 'Dorsum of Nose',
    description: 'The most prominent point on the bridge of the nose.',
    anatomicalRegion: 'Nose',
    clinicalSignificance: 'Used to evaluate nasal profile and dorsal hump.'
  },
  Columella: {
    abbreviation: 'Cm',
    name: 'Columella',
    description: 'The most anterior point of the columella of the nose.',
    anatomicalRegion: 'Nose',
    clinicalSignificance: 'Used to evaluate nasal base and columella-labial angle.'
  },
  
  // Other landmarks that might not have standard descriptions
  UpperLip: {
    abbreviation: 'UL',
    name: 'Upper Lip',
    description: 'The midpoint of the upper vermilion border.',
    anatomicalRegion: 'Lips',
    clinicalSignificance: 'Used to evaluate lip position and contour.'
  },
  LowerLip: {
    abbreviation: 'LL',
    name: 'Lower Lip',
    description: 'The midpoint of the lower vermilion border.',
    anatomicalRegion: 'Lips',
    clinicalSignificance: 'Used to evaluate lip position and contour.'
  },
  Stms: {
    abbreviation: 'Stms',
    name: 'Stomion Superius',
    description: 'The lowest point of the upper lip in the midsagittal plane.',
    anatomicalRegion: 'Lips',
    clinicalSignificance: 'Used to evaluate the position of the upper lip and interlabial gap.'
  },
  Stmi: {
    abbreviation: 'Stmi',
    name: 'Stomion Inferius',
    description: 'The highest point of the lower lip in the midsagittal plane.',
    anatomicalRegion: 'Lips',
    clinicalSignificance: 'Used to evaluate the position of the lower lip and interlabial gap.'
  },
  Pt: {
    abbreviation: 'Pt',
    name: 'Pterygomaxillary Fissure',
    description: 'The most posterior and superior point of the pterygomaxillary fissure.',
    anatomicalRegion: 'Maxilla',
    clinicalSignificance: 'Used as a reference point for evaluation of maxillary growth and position.'
  },
  NasalBridgePoint: {
    abbreviation: 'NBP',
    name: 'Nasal Bridge Point',
    description: 'A point on the bridge of the nose between Nasion and Pronasale.',
    anatomicalRegion: 'Nose',
    clinicalSignificance: 'Used to evaluate nasal profile and bridge contour.'
  },
  SubmandibularPoint: {
    abbreviation: 'SMP',
    name: 'Submandibular Point',
    description: 'The point of maximum concavity on the inferior border of the mandible.',
    anatomicalRegion: 'Mandible',
    clinicalSignificance: 'Used to evaluate the submandibular contour and neck-chin angle.'
  },
  Co: {
    abbreviation: 'Co',
    name: 'Condylion',
    description: 'The most superior and posterior point on the condyle of the mandible.',
    anatomicalRegion: 'Mandibular Condyle',
    clinicalSignificance: 'Used to measure the effective length of the mandible and evaluate condylar position.'
  },
};

/**
 * Get landmark description by abbreviation or landmark name
 * @param landmarkKey The landmark abbreviation or full name
 * @returns LandmarkDescription object or undefined if not found
 */
export function getLandmarkDescription(landmarkKey: string): LandmarkDescription | undefined {
  // Try to find by exact match (case sensitive)
  if (landmarkDescriptions[landmarkKey]) {
    return landmarkDescriptions[landmarkKey];
  }
  
  // Try to find by abbreviation
  const byAbbreviation = Object.values(landmarkDescriptions).find(
    desc => desc.abbreviation.toLowerCase() === landmarkKey.toLowerCase()
  );
  if (byAbbreviation) return byAbbreviation;
  
  // Try to find by name
  return Object.values(landmarkDescriptions).find(
    desc => desc.name.toLowerCase() === landmarkKey.toLowerCase()
  );
}