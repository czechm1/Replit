import { landmarkDescriptions, getLandmarkDescription } from '../data/landmarkDescriptions';
import { groupLandmarks } from '../components/radiograph/utils/landmarkGroups';

/**
 * Format landmark name to a standardized abbreviation
 * @param landmarkName The landmark name to format into an abbreviation
 * @returns Standardized abbreviation string
 */
export function formatLandmarkAbbreviation(landmarkName: string): string {
  // First check if it already has a defined abbreviation in the descriptions
  const description = getLandmarkDescription(landmarkName);
  if (description && description.abbreviation) {
    return description.abbreviation;
  }
  
  // For multi-word landmarks, use first letter of each word
  if (landmarkName.includes(' ')) {
    return landmarkName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }
  
  // For single letter landmarks like A, B, use as is
  if (landmarkName.length === 1) {
    return landmarkName.toUpperCase();
  }
  
  // For landmarks with hyphen or underscore
  if (landmarkName.includes('-') || landmarkName.includes('_')) {
    const separator = landmarkName.includes('-') ? '-' : '_';
    return landmarkName
      .split(separator)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }
  
  // For long names, use first 3 characters
  if (landmarkName.length > 3) {
    return landmarkName.substring(0, 3);
  }
  
  // Default: return as is
  return landmarkName;
}

/**
 * Get landmark type (dental, soft tissue, or skeletal) based on landmark identifier
 * @param landmarkName The landmark name or abbreviation 
 * @returns 'dental' | 'soft' | 'skeletal' landmark type
 */
export function getLandmarkType(landmarkName: string): 'dental' | 'soft' | 'skeletal' {
  // First try to get from landmark descriptions
  const description = getLandmarkDescription(landmarkName);
  if (description) {
    const region = description.anatomicalRegion.toLowerCase();
    
    if (region.includes('dentition') || region.includes('dental')) {
      return 'dental';
    }
    
    if (
      region.includes('tissue') || 
      region.includes('lip') || 
      region.includes('nose') || 
      region.includes('chin') ||
      region.includes('forehead')
    ) {
      return 'soft';
    }
    
    return 'skeletal';
  }
  
  // Fallback to hardcoded groups
  const groups = groupLandmarks();
  
  if (groups.dental.includes(landmarkName)) {
    return 'dental';
  }
  
  if (groups.softTissue.includes(landmarkName)) {
    return 'soft';
  }
  
  // Check for specific landmark abbreviations
  if (
    landmarkName.includes('1') || 
    landmarkName.includes('6') ||
    landmarkName.toLowerCase().includes('dental')
  ) {
    return 'dental';
  }
  
  if (
    landmarkName === 'G' ||
    landmarkName === 'Prn' ||
    landmarkName === 'Sn' ||
    landmarkName === 'Ls' ||
    landmarkName === 'Li' ||
    landmarkName === 'Cm' ||
    landmarkName.toLowerCase().includes('soft') ||
    landmarkName.includes('Lip')
  ) {
    return 'soft';
  }
  
  return 'skeletal';
}

/**
 * Get color for landmark based on its anatomical type
 * @param landmarkName The landmark name or abbreviation
 * @returns CSS color string for the landmark 
 */
export function getLandmarkColor(landmarkName: string): string {
  const type = getLandmarkType(landmarkName);
  
  switch (type) {
    case 'dental':
      return '#22c55e'; // green for dental
    case 'soft':
      return '#3b82f6'; // blue for soft tissue
    case 'skeletal':
    default:
      return '#ef4444'; // red for skeletal
  }
}

/**
 * Get highlight color for landmark when selected
 * @param landmarkName The landmark name or abbreviation
 * @returns CSS color string for the selected landmark 
 */
export function getSelectedLandmarkColor(landmarkName: string): string {
  const type = getLandmarkType(landmarkName);
  
  switch (type) {
    case 'dental':
      return '#16a34a'; // darker green for dental
    case 'soft':
      return '#2563eb'; // darker blue for soft tissue
    case 'skeletal':
    default:
      return '#dc2626'; // darker red for skeletal
  }
}

/**
 * Get human-readable anatomical region for a landmark
 * @param landmarkName The landmark name or abbreviation
 * @returns Anatomical region description string
 */
export function getAnatomicalRegion(landmarkName: string): string {
  const description = getLandmarkDescription(landmarkName);
  
  if (description) {
    return description.anatomicalRegion;
  }
  
  const type = getLandmarkType(landmarkName);
  
  switch (type) {
    case 'dental':
      return 'Dental';
    case 'soft':
      return 'Soft Tissue';
    case 'skeletal':
    default:
      return 'Skeletal';
  }
}

/**
 * Get label position offset based on landmark type
 * @param landmarkName The landmark name or abbreviation
 * @returns Position offset object {x, y} 
 */
export function getLabelOffset(landmarkName: string): {x: number, y: number} {
  const type = getLandmarkType(landmarkName);
  
  switch (type) {
    case 'dental':
      return { x: 24, y: 0 }; // Dental landmarks labels to the right
    case 'soft':
      return { x: -24, y: 0 }; // Soft tissue landmarks labels to the left
    case 'skeletal':
      return { x: 0, y: -24 }; // Skeletal landmarks labels above
    default:
      return { x: 0, y: 24 }; // Default labels below
  }
}