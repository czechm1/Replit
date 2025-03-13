var pointData = [];

// image mm to px conversion ratio
var mm_px_ratio;

// return pointData
function point(landmark) {
  return pointData[arrayObjectIndexOf(pointData, landmark, 'landmark')];
}

//return an index of a certain item in array which is composed of object literals.
function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

// angle in degrees, Vector1: AB, Vector2: CD
function angle_vectors(A, B, C, D) {
  var vector_1 = {
    x: B.coordinates.x - A.coordinates.x,
    y: B.coordinates.y - A.coordinates.y,
  };

  var vector_2 = {
    x: D.coordinates.x - C.coordinates.x,
    y: D.coordinates.y - C.coordinates.y,
  };

  var rad_angle =
    Math.atan2(vector_2.y, vector_2.x) - Math.atan2(vector_1.y, vector_1.x);

  return (rad_angle * 180) / Math.PI;
}

function rotate_point(pointX, pointY, originX, originY, angle) {
  angle = (angle * Math.PI) / 180.0;
  return {
    x:
      Math.cos(angle) * (pointX - originX) -
      Math.sin(angle) * (pointY - originY) +
      originX,
    y:
      Math.sin(angle) * (pointX - originX) +
      Math.cos(angle) * (pointY - originY) +
      originY,
  };
}

function scale_point(pointX, pointY, originX, originY, scale) {
  return {
    x: scale * (pointX - originX) + originX,
    y: scale * (pointY - originY) + originY,
  };
}

function trans_point(pointX, pointY, transX, transY) {
  return {
    x: pointX + transX,
    y: pointY + transY,
  };
}

function mid_point(A, B) {
  var mid_x = (A.x + B.x) / 2;
  var mid_y = (A.y + B.y) / 2;
  var point = {
    x: mid_x,
    y: mid_y,
  };
  return point;
}

function dividing_point(A, B, m, n) {
  var div_x = (m * A.x + n * B.x) / (m + n);
  var div_y = (m * A.y + n * B.y) / (m + n);
  var point = {
    x: div_x,
    y: div_y,
  };
  return point;
}

function external_dividing_point(A, B, m, n) {
  var div_x = (m * B.x - n * A.x) / (m - n);
  var div_y = (m * B.y - n * A.y) / (m - n);
  var point = {
    x: div_x,
    y: div_y,
  };
  return point;
}

function rotate(A, O, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    new_x = cos * (A.x - O.x) + sin * (A.y - O.y) + O.x,
    new_y = cos * (A.y - O.y) - sin * (A.x - O.x) + O.y;
  return [new_x, new_y];
}

// function point(RefName){
//   // return pointData[selectedItems.indexOf(RefName)];
//   return pointData[arrayObjectIndexOf(pointData,RefName,"refName")];
// }

function angle(A, B, C) {
  //B is center
  var AB = Math.sqrt(
    Math.pow(B.coordinates.x - A.coordinates.x, 2) +
      Math.pow(B.coordinates.y - A.coordinates.y, 2),
  );
  var BC = Math.sqrt(
    Math.pow(B.coordinates.x - C.coordinates.x, 2) +
      Math.pow(B.coordinates.y - C.coordinates.y, 2),
  );
  var AC = Math.sqrt(
    Math.pow(C.coordinates.x - A.coordinates.x, 2) +
      Math.pow(C.coordinates.y - A.coordinates.y, 2),
  );
  var radian = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  return radianToAngle(radian);
}

function radianToAngle(radian) {
  return radian * (180 / Math.PI);
}

function pointToPointDistance(point1, point2) {
  var xdif = point1.x - point2.x;
  var ydif = point1.y - point2.y;

  xdif = xdif * xdif;
  ydif = ydif * ydif;

  return Math.sqrt(xdif + ydif);
}

// * occurs errors many times for some reason.*
function pointToLineDistance(linePointA, linePointB, point) {
  var slope = (linePointB.y - linePointA.y) / (linePointB.x - linePointA.x);
  var distance =
    Math.abs(slope * (point.x - linePointA.x) - (point.y - linePointA.y)) /
    Math.sqrt(Math.pow(slope, 2) + 1);

  return distance;
}

function pointLineDistance(linePoint1, linePoint2, point) {
  var xdif = linePoint2.x - linePoint1.x;
  var ydif = linePoint2.y - linePoint1.y;
  var lineLength = Math.sqrt(xdif * xdif + ydif * ydif);

  var u = ydif * point.x - xdif * point.y;
  var e = linePoint1.y * linePoint2.x - linePoint1.x * linePoint2.y;

  return Math.abs((u + e) / lineLength);
}

function pointLineDifference(linePoint1, linePoint2, point) {
  var xdif = linePoint2.x - linePoint1.x;
  var ydif = linePoint2.y - linePoint1.y;
  var lineLength = Math.sqrt(xdif * xdif + ydif * ydif);

  var u = ydif * point.x - xdif * point.y;
  var e = linePoint1.y * linePoint2.x - linePoint1.x * linePoint2.y;

  return (u + e) / lineLength;
}

function pointToRickettsELine(e_linePointA, e_linePointB, point) {
  var slope =
    (e_linePointB.coordinates.y - e_linePointA.coordinates.y) /
    (e_linePointB.coordinates.x - e_linePointA.coordinates.x);

  if (slope == Infinity) {
    var distance = point.coordinates.x - e_linePointA.coordinates.x;
  } else if (slope > 0) {
    var distance =
      (slope * (point.coordinates.x - e_linePointA.coordinates.x) -
        (point.coordinates.y - e_linePointA.coordinates.y)) /
      Math.sqrt(Math.pow(slope, 2) + 1);
  } else {
    var distance =
      -(
        slope * (point.coordinates.x - e_linePointA.coordinates.x) -
        (point.coordinates.y - e_linePointA.coordinates.y)
      ) / Math.sqrt(Math.pow(slope, 2) + 1);
  }
  return distance;
}

function intersect(A, B, C, D) {
  var x1 = A.coordinates.x;
  var y1 = A.coordinates.y;
  var x2 = B.coordinates.x;
  var y2 = B.coordinates.y;
  var x3 = C.coordinates.x;
  var y3 = C.coordinates.y;
  var x4 = D.coordinates.x;
  var y4 = D.coordinates.y;

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  // if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
  //     return false
  // }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x: x, y: y };
}

//nearest point on line AB from point C
function getSpPoint(A, B, C) {
  var A = A.coordinates;
  var B = B.coordinates;
  var C = C.coordinates;

  var x1 = A.x,
    y1 = A.y,
    x2 = B.x,
    y2 = B.y,
    x3 = C.x,
    y3 = C.y;
  var px = x2 - x1,
    py = y2 - y1,
    dAB = px * px + py * py;
  var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
  var x = x1 + u * px,
    y = y1 + u * py;

  return { x: x, y: y }; //this is D
}

function btwn(a, b1, b2) {
  if (a >= b1 && a <= b2) {
    return true;
  }
  if (a >= b2 && a <= b1) {
    return true;
  }
  return false;
}

function path_line_intersections(pathEl, point_1, point_2) {
  var n_segments = 20;
  var pathLength = pathEl.getTotalLength();
  console.log(pathLength);
  var pts = [];
  for (var i = 0; i < n_segments; i++) {
    var pos1 = pathEl.getPointAtLength((pathLength * i) / n_segments);
    var pos2 = pathEl.getPointAtLength((pathLength * (i + 1)) / n_segments);
    var line1 = { x1: pos1.x, x2: pos2.x, y1: pos1.y, y2: pos2.y };
    var line2 = { x1: point_1.x, x2: point_2.x, y1: point_1.y, y2: point_2.y };
    var pt = line_line_intersect(line1, line2);
    if (typeof pt != 'string') {
      pts.push(pt);
    } else {
      console.log(pt);
    }
  }

  return pts;
}

// function draw_intersections(pts) {

//   highlights.selectAll("circle").remove();

//   pts.forEach(function(pt){
//     highlights.append("circle")
//        .attr("cx", pt.x)
//        .attr("cy", pt.y)
//        .attr("r", 8)
//        .attr("fill", "none")
//        .attr("stroke", "steelblue");

//     highlights.append("circle")
//        .attr("cx", pt.x)
//        .attr("cy", pt.y)
//        .attr("r", 2)
//        .attr("fill", "steelblue")
//        .attr("stroke", "none");

//   });

// }

function line_line_intersect(line1, line2) {
  var x1 = line1.x1,
    x2 = line1.x2,
    x3 = line2.x1,
    x4 = line2.x2;
  var y1 = line1.y1,
    y2 = line1.y2,
    y3 = line2.y1,
    y4 = line2.y2;
  var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  var pt_x_num =
    (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  var pt_y_num =
    (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  if (pt_denom == 0) {
    return 'parallel';
  } else {
    var pt = { x: pt_x_num / pt_denom, y: pt_y_num / pt_denom };
    if (
      btwn(pt.x, x1, x2) &&
      btwn(pt.y, y1, y2) &&
      btwn(pt.x, x3, x4) &&
      btwn(pt.y, y3, y4)
    ) {
      return pt;
    } else {
      return 'not in range';
    }
  }
}
