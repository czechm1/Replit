export interface Point {
  x: number;
  y: number;
}

export interface LandmarkPoint {
  landmark: string;
  coordinates: Point;
  confidence?: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
