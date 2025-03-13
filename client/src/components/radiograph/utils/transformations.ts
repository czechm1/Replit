import { Point } from '../types';

export function rotatePoint(
  pointX: number,
  pointY: number,
  originX: number,
  originY: number,
  angle: number,
): Point {
  const angleRad = (angle * Math.PI) / 180.0;
  return {
    x:
      Math.cos(angleRad) * (pointX - originX) -
      Math.sin(angleRad) * (pointY - originY) +
      originX,
    y:
      Math.sin(angleRad) * (pointX - originX) +
      Math.cos(angleRad) * (pointY - originY) +
      originY,
  };
}

export function scalePoint(
  pointX: number,
  pointY: number,
  originX: number,
  originY: number,
  scale: number,
): Point {
  return {
    x: scale * (pointX - originX) + originX,
    y: scale * (pointY - originY) + originY,
  };
}

export function translatePoint(
  pointX: number,
  pointY: number,
  transX: number,
  transY: number,
): Point {
  return {
    x: pointX + transX,
    y: pointY + transY,
  };
}
