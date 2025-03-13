export interface LayerOpacityType {
  landmarks: number;
  measurements: number;
  tracing: number;
  profile?: number;
}

export interface ImageControlsType {
  brightness: number;
  contrast: number;
}

export * from './tracingLine'; 
export * from './landmark';