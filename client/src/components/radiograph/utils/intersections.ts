import { Point, LandmarkPoint, Line } from '../types';

export function intersect(
  A: LandmarkPoint,
  B: LandmarkPoint,
  C: LandmarkPoint,
  D: LandmarkPoint,
): Point | false {
  const x1 = A.coordinates.x;
  const y1 = A.coordinates.y;
  const x2 = B.coordinates.x;
  const y2 = B.coordinates.y;
  const x3 = C.coordinates.x;
  const y3 = C.coordinates.y;
  const x4 = D.coordinates.x;
  const y4 = D.coordinates.y;

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
  };
}

export function lineLineIntersect(line1: Line, line2: Line): Point | string {
  const { x1, y1, x2, y2 } = line1;
  const { x3, y3, x4, y4 } = {
    x3: line2.x1,
    y3: line2.y1,
    x4: line2.x2,
    y4: line2.y2,
  };

  const ptDenom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const ptXNum =
    (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ptYNum =
    (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);

  if (ptDenom === 0) return 'parallel';

  const pt = {
    x: ptXNum / ptDenom,
    y: ptYNum / ptDenom,
  };

  if (
    between(pt.x, x1, x2) &&
    between(pt.y, y1, y2) &&
    between(pt.x, x3, x4) &&
    between(pt.y, y3, y4)
  ) {
    return pt;
  }

  return 'not in range';
}

function between(a: number, b1: number, b2: number): boolean {
  return (a >= b1 && a <= b2) || (a >= b2 && a <= b1);
}
