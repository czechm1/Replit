import { LandmarkPoint } from '../types';

export interface LandmarkGroups {
  skeletal: string[];
  dental: string[];
  softTissue: string[];
  outlines: {
    mandible: string[];
    maxilla: string[];
    symphysis: string[];
  };
}

export function groupLandmarks(): LandmarkGroups {
  return {
    skeletal: [
      'Na',
      'A',
      'B',
      'Me',
      'S',
      'Po',
      'Or',
      'ANS',
      'PNS',
      'Go',
      'Gn',
      'Ar',
      'Co',
      'Ba',
      'Pt',
      'R1',
      'R3',
    ],
    dental: [
      'U1IncisalTip',
      'U1RootTip',
      'L1IncisalTip',
      'L1RootTip',
      'U6Mesial',
      'U6Distal',
      'L6Mesial',
      'L6Distal',
    ],
    softTissue: [
      'SoftTissueNa',
      'SoftTissueA',
      'SoftTissueB',
      'SoftTissuePog',
      'SoftTissueGn',
      'SoftTissueMe',
      'UpperLip',
      'LowerLip',
      'Subnasale',
      'Columella',
      'DorsumOfNose',
      'Prn',
      'LabraleSuperius',
      'LabraleInferius',
    ],
    outlines: {
      mandible: Array.from(
        { length: 6 },
        (_, i) => `mandible_outline_${i + 1}`,
      ),
      maxilla: Array.from({ length: 11 }, (_, i) => `maxilla_outline_${i + 1}`),
      symphysis: Array.from(
        { length: 4 },
        (_, i) => `symphysis_outline_${i + 1}`,
      ),
    },
  };
}

export type LandmarkGroupKey = keyof LandmarkGroups | 'all';
export type OutlineGroupKey = keyof LandmarkGroups['outlines'];

export interface DisplayLandmarkGroupsOptions {
  selectedGroups: LandmarkGroupKey[];
  includeOutlines?: boolean;
  specificOutlines?: OutlineGroupKey[];
}

export function displayLandmarkGroups(
  points: LandmarkPoint[],
  options: DisplayLandmarkGroupsOptions,
): LandmarkPoint[] {
  const groups = groupLandmarks();
  const selectedPoints = new Set<LandmarkPoint>();

  options.selectedGroups.forEach((group) => {
    if (group === 'all') {
      points.forEach((point) => selectedPoints.add(point));
      return;
    }

    if (group === 'outlines' && options.includeOutlines) {
      const outlineGroups =
        options.specificOutlines ||
        (Object.keys(groups.outlines) as OutlineGroupKey[]);
      outlineGroups.forEach((outlineGroup) => {
        const outlinePoints = points.filter((p) =>
          groups.outlines[outlineGroup].includes(p.landmark),
        );
        outlinePoints.forEach((point) => selectedPoints.add(point));
      });
    } else if (group in groups && group !== 'outlines') {
      const groupPoints = points.filter((p) =>
        (
          groups[group as keyof Omit<LandmarkGroups, 'outlines'>] as string[]
        ).includes(p.landmark),
      );
      groupPoints.forEach((point) => selectedPoints.add(point));
    }
  });

  return Array.from(selectedPoints);
}

// Helper function to get landmarks by group
export function getLandmarksByGroup(group: LandmarkGroupKey): string[] {
  const groups = groupLandmarks();

  if (group === 'all') {
    return [
      ...groups.skeletal,
      ...groups.dental,
      ...groups.softTissue,
      ...Object.values(groups.outlines).flat(),
    ];
  }

  if (group === 'outlines') {
    return Object.values(groups.outlines).flat();
  }

  return groups[group] || [];
}

// Example usage:
/*
const allPoints: LandmarkPoint[] = []; // Your landmark points array

// Display only skeletal and dental landmarks
const anatomicalView = displayLandmarkGroups(allPoints, {
  selectedGroups: ['skeletal', 'dental']
});

// Display soft tissue profile with specific outlines
const profileView = displayLandmarkGroups(allPoints, {
  selectedGroups: ['softTissue', 'outlines'],
  includeOutlines: true,
  specificOutlines: ['mandible', 'maxilla']
});

// Display all landmarks
const completeView = displayLandmarkGroups(allPoints, {
  selectedGroups: ['all']
});
*/
