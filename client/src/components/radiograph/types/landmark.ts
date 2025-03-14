export interface Point {
  x: number;
  y: number;
}

export interface LandmarkPoint {
  landmark: string;
  coordinates: Point;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
