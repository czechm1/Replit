import { Point, LandmarkPoint } from '../types';

export function angleVectors(
  A: LandmarkPoint,
  B: LandmarkPoint,
  C: LandmarkPoint,
  D: LandmarkPoint,
): number {
  const vector1 = {
    x: B.coordinates.x - A.coordinates.x,
    y: B.coordinates.y - A.coordinates.y,
  };

  const vector2 = {
    x: D.coordinates.x - C.coordinates.x,
    y: D.coordinates.y - C.coordinates.y,
  };

  const radAngle =
    Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
  return (radAngle * 180) / Math.PI;
}

export function angle(
  A: LandmarkPoint,
  B: LandmarkPoint,
  C: LandmarkPoint,
): number {
  const AB = Math.sqrt(
    Math.pow(B.coordinates.x - A.coordinates.x, 2) +
      Math.pow(B.coordinates.y - A.coordinates.y, 2),
  );

  const BC = Math.sqrt(
    Math.pow(B.coordinates.x - C.coordinates.x, 2) +
      Math.pow(B.coordinates.y - C.coordinates.y, 2),
  );

  const AC = Math.sqrt(
    Math.pow(C.coordinates.x - A.coordinates.x, 2) +
      Math.pow(C.coordinates.y - A.coordinates.y, 2),
  );

  const radian = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  return radianToAngle(radian);
}

export function radianToAngle(radian: number): number {
  return radian * (180 / Math.PI);
}
