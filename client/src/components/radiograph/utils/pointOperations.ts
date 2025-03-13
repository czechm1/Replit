import { Point } from '../types';

export function midPoint(A: Point, B: Point): Point {
  return {
    x: (A.x + B.x) / 2,
    y: (A.y + B.y) / 2,
  };
}

export function dividingPoint(A: Point, B: Point, m: number, n: number): Point {
  return {
    x: (m * A.x + n * B.x) / (m + n),
    y: (m * A.y + n * B.y) / (m + n),
  };
}

export function externalDividingPoint(
  A: Point,
  B: Point,
  m: number,
  n: number,
): Point {
  return {
    x: (m * B.x - n * A.x) / (m - n),
    y: (m * B.y - n * A.y) / (m - n),
  };
}

export function pointToPointDistance(point1: Point, point2: Point): number {
  const xDiff = point1.x - point2.x;
  const yDiff = point1.y - point2.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
