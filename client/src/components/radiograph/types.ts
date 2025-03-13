export type LayerOpacityType = {
  tracing: number;
  landmarks: number;
  measurements: number;
  profile?: number;
  // For comparison mode
  comparison?: number;
};

export type ImageControlsType = {
  brightness: number;
  contrast: number;
};

export type ComparisonImageType = {
  id: string;
  patientId: string;
  imageType: 'ceph' | 'profile' | 'other';
  timestamp: string;
  description?: string;
  url: string;
  visible: boolean;
  opacity: number;
  colorFilter?: string;
};

export type ComparisonModeType = 'sideBySide' | 'overlay';