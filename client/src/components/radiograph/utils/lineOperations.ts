import { Point, Line, LandmarkPoint } from '../types';

export function pointToLineDistance(
  linePointA: Point,
  linePointB: Point,
  point: Point,
): number {
  const slope = (linePointB.y - linePointA.y) / (linePointB.x - linePointA.x);
  return (
    Math.abs(slope * (point.x - linePointA.x) - (point.y - linePointA.y)) /
    Math.sqrt(Math.pow(slope, 2) + 1)
  );
}

export function pointToRickettsELine(
  eLinePointA: LandmarkPoint,
  eLinePointB: LandmarkPoint,
  point: LandmarkPoint,
): number {
  const slope =
    (eLinePointB.coordinates.y - eLinePointA.coordinates.y) /
    (eLinePointB.coordinates.x - eLinePointA.coordinates.x);

  if (slope === Infinity) {
    return point.coordinates.x - eLinePointA.coordinates.x;
  }

  const distance =
    (slope * (point.coordinates.x - eLinePointA.coordinates.x) -
      (point.coordinates.y - eLinePointA.coordinates.y)) /
    Math.sqrt(Math.pow(slope, 2) + 1);

  return slope > 0 ? distance : -distance;
}
