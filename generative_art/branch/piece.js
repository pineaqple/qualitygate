const getComplementaryColorSet = () => {
  const hues = [Math.random() * 360, Math.random() * 360, Math.random() * 360];
  
  const saturatedLightness = [
    Math.random() * 20 + 40, 
    Math.random() * 20 + 40,
    Math.random() * 20 + 40
  ];
  
  const desaturatedLightness = [
    Math.random() * 20 + 70,
    Math.random() * 20 + 70, 
    Math.random() * 20 + 70    
  ];

  const colors = [];

  for (let i = 0; i < 3; i++) {
    colors.push({
      h: hues[i],
      s: 100,
      l: saturatedLightness[i]
    });

    colors.push({
      h: (hues[i] + 180) % 360,
      s: 100,
      l: desaturatedLightness[i] 
    });
  }

  return colors;
}


const cS = Math.min(window.innerWidth, window.innerHeight);
const colorSet = getComplementaryColorSet();
const mode = fxrand() <= 0.9;
let bgClr = [];
let special = fxrand() <= 0.017 ? true : false;
let bgMode = "";
let colorChoice = fxrand();
bgClr = mode? [cusrand(0, 360), 50, cusrand(75, 90)]:[cusrand(0, 360), 40, 0];
//bgClr = [colorSet[1].h, 30, 0]
let squareType = cusrand(0, 6);
let rare = fxrand() <= 0.2 ? true : false;
let accent1 = "white", accent2 = "black";
let accent_temp1 = accent1, accent_temp2 = accent2;
var shadowOn = true; 

offsY = 85;
pillSprites = [];

let cnvsX = 600, cnvsY = 1000;
const cH = 37;



const lines = { segments: [] };
const extralines = [];
function createLineSegments(start, end, seg, len, ang, depth) {

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  let segmentLength = Math.sqrt(dx**2 + dy**2) / seg;
  let sCounter = 0;
  let tempOffset = 0;
  for (let i = 0; i < seg; i++) {
    let bRand = fxrand()

    if(depth == 3){
      ang1 = -cusrand(110, 90);
      ang2 = cusrand(-10, 20);
      segmentLength *= 0.97;
      const x1 = (start[0] + i * segmentLength * (dx / Math.sqrt(dx**2 + dy**2))) + tempOffset;
      const y1 = (start[1] + i * segmentLength * (dy / Math.sqrt(dx**2 + dy**2)));
      tempOffset = cusrand(0, segmentLength/cusrand(7, 11)) * flip();
      const x2 = start[0] + (i + 1) * segmentLength * (dx / Math.sqrt(dx**2 + dy**2)) + tempOffset;
      const y2 = start[1] + (i + 1) * segmentLength * (dy / Math.sqrt(dx**2 + dy**2));
       
        const newLen = (len / 2.7)-sCounter*len/35;
        const newEnd = [x2, y2];
        const newAng1 = ang1 - 40;
        const newAng2 = ang2 - 40;
        const newDepth = depth - 1;
        const [newX2, newY2] = getPointOnAngle(newEnd, newLen, newAng1);
        const [newX3, newY3] = getPointOnAngle(newEnd, newLen, newAng2);
        test = divideDistance([x2, y2], [newX2, newY2], seg/2)
        
        test2 = divideDistance([x2, y2], [newX3, newY3], seg/2)

 
        
        lines.segments.push([[x1, y1], [x2, y2], depth, i, Math.abs(i - seg)]);
        
        if (bRand <= 0.5){
          for (let s = 0; s < test.length; s++) {
            const el = test[s];
            lines.segments.push([el[0], el[1], depth-1, i, Math.abs(i - seg), s]);
          }

          for (let s = 0; s < test2.length; s++) {
            const el = test2[s];
            lines.segments.push([el[0], el[1], depth-1, i, Math.abs(i - seg), s]);
          }
  
        createLineSegments([x2, y2], [newX2, newY2], seg/2, newLen, newAng1, newDepth);
        createLineSegments([x2, y2], [newX3, newY3], seg/2, newLen, newAng2, newDepth);
      }
      else if (bRand <= 0.75){
        for (let s = 0; s < test.length; s++) {
          const el = test[s];
          lines.segments.push([el[0], el[1], depth-1, i, Math.abs(i - seg), s]);
        }
        createLineSegments([x2, y2], [newX2, newY2], seg/2, newLen, newAng1, newDepth);
      }
      else {
        for (let s = 0; s < test2.length; s++) {
          const el = test2[s];
          lines.segments.push([el[0], el[1], depth-1, i, Math.abs(i - seg), s]);
        }

        createLineSegments([x2, y2], [newX3, newY3], seg/2, newLen, newAng2, newDepth);
      }

  }
    else {
      segmentLength *= 0.97;
      const x1 = (start[0] + i * segmentLength * (dx / Math.sqrt(dx**2 + dy**2))) + tempOffset;
      const y1 = (start[1] + i * segmentLength * (dy / Math.sqrt(dx**2 + dy**2)));
      tempOffset = cusrand(0, segmentLength/10) * flip();
      const x2 = start[0] + (i + 1) * segmentLength * (dx / Math.sqrt(dx**2 + dy**2)) + tempOffset;
      const y2 = start[1] + (i + 1) * segmentLength * (dy / Math.sqrt(dx**2 + dy**2));
  
      if (depth > 0) {
       
        const newLen = (len / 2.7)-sCounter*len/35;
        const newStart = [x1, y1];
        const newEnd = [x2, y2];
        const newAng = depth == 3 ? ang - 40 :  (fxrand() <= 0.5 ? ang - cusrand(25, 40) : ang+cusrand(25, 40));
        const newDepth = depth - 1;
        const [newX2, newY2] = getPointOnAngle(newEnd, newLen, newAng);
        test = divideDistance([x2, y2], [newX2, newY2], seg/2)
        for (let s = 0; s < test.length; s++) {
          const el = test[s];
          lines.segments.push([el[0], el[1], depth-1, i, Math.abs(i - seg), s]);
        }
        
        lines.segments.push([[x1, y1], [x2, y2], depth, i]);
          createLineSegments([x2, y2], [newX2, newY2], seg/2, newLen, newAng, newDepth);

      } 
    }


    sCounter++;
  }

}

const startPoint = [500/1.6, 800];
const treeHeight = cusrand(200, 250)
const endPoint = [cusrand(450, 525)/1.5, treeHeight];
const segNum = getSegmentNumber(treeHeight);
const depth = 5;
createLineSegments(startPoint, endPoint, segNum, 300, null, 3);


const r_num = 5; 
const r_dis = 2;

function setup() {

  createCanvas(cnvsX, cnvsY);

  base = createGraphics(cnvsX, cnvsY);

  randomSeed(fxrand() * 99999);
  noiseSeed(fxrand() * 99999);                                     
  base.colorMode(HSL, 360, 100, 100);
  base.background(bgClr[0], bgClr[1], bgClr[2]);
  base.stroke(bgClr[0], bgClr[1]-30, bgClr[2]+5);
  base.fill(bgClr[0], bgClr[1]-20, bgClr[2]+10)
  let counter = 0;
  for (let i = 0; i < cnvsX; i += 6) {
    for (let j = 0; j < cnvsY; j += 3) {
      base.ellipse(counter % 2 == 0 ? i : i + 3, j, random(3, 5));
      counter++;
    }
  }

  image(base, 0, 0)


  lines.segments.forEach(s => {
      if (s[2] == 3 && fxrand() <= 0.7){
          let newP = getPointOnLine(s[0], s[1])
          const newP2 = getPointOnAngle(newP, cusrand(5, 10), fxrand() <= 0.5 ? -cusrand(125, 145):-cusrand(35, 55));
          strokeWeight(max(2, abs(s[3] - segNum/1.3)))
          stroke(mode ? 0 : 255);
          line(newP[0], newP[1], newP2[0], newP2[1])
      }
  })


  lines.segments.forEach(seg => {
    if (seg[2] < 2){


    // let leaves = generatePoints(seg[0], seg[1], r_num * seg[4] * 10, r_dis * seg[4] * 2);
    // leaves.forEach(e => {
    //   strokeWeight(min(seg[4]*1.5, 2 ));
    //   colorMode(HSL);
    //   stroke(80, 60, 80);
    //   point(e[0], e[1])
    // });


    let bloom = generatePoints(seg[0], seg[1], r_num * seg[4]* 2, r_dis * seg[4]);
    bloom.forEach(e => {
      strokeWeight(min(seg[4]*2, 3.5 ));
      colorMode(HSL);
      let p_rand = getRandomPink();
      stroke(p_rand[0], p_rand[1], p_rand[2]);
      point(e[0], e[1])
    });
  
  }
    else if (seg[2] == 3){
      let random_points1 = generatePoints(seg[0], seg[1], r_num * seg[4] /2, r_dis * seg[4] / 3);
      random_points1.forEach(e => {
        strokeWeight(min(seg[4]*2, 3));
        stroke(mode ? 0 : 255);
        point(e[0], e[1])
      });
    }

    stroke(mode ? 0 : 255)
    if (seg[2] == 3){
      strokeWeight(abs(seg[3] - segNum*1.1))
   line(seg[0][0], seg[0][1], seg[1][0], seg [1][1])
  }
   else if (seg[2] == 2){
    //strokeWeight(max(min(abs(seg[3] - segNum/2), seg[4]), 1))
    strokeWeight(min(seg[4], abs(segNum/1.4-seg[5])))      
   line(seg[0][0], seg[0][1], seg[1][0], seg [1][1]) 
  }
   else if (seg[2] == 1){
    strokeWeight(abs(seg[3] - segNum/4))
   line(seg[0][0], seg[0][1], seg[1][0], seg [1][1])
  }
   else {
    strokeWeight(abs(seg[3] - segNum/5  ))
   line(seg[0][0], seg[0][1], seg[1][0], seg [1][1])
  }

    

  });

push()
  stroke(mode ? 0 : 255)
  strokeWeight(2)
  fill(mode ? 0 : 255)
  let eWidth = cusrand(60, 90), eHeight = cusrand(25, 45)
  ellipse(startPoint[0], startPoint[1], eWidth-5, eHeight-12)
  noFill()
  ellipse(startPoint[0], startPoint[1]-5, eWidth, eHeight)
pop()

 
let ePoints = getEllipsePoints(startPoint, eWidth, eHeight, 8)

ePoints.forEach(p => {
  strokeWeight(2)
  stroke(mode ? 0 : 255)
  line(p[0], p[1]+10, p[0], p[1] + 20)

});
}


function getSegmentNumber(input) {



  const ranges = [
    { min: 380, max: 450, value: 6 },
    { min: 290, max: 379, value: 7 },
    { min: 100, max: 289, value: 8 }
  ];

  for (let i = 0; i < ranges.length; i++) {
    const { min, max, value } = ranges[i];
    if (input >= min && input <= max) {
      return value;
    }
  }
  

  return null;
}


function distanceBetweenPoints(p1, p2) {
  // Validate input
  if (p1.length !== 2 || p2.length !== 2) {
    throw new Error("Invalid input: Points must be in the form [x, y]");
  }
  
  // Extract coordinates
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  
  // Calculate distance
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  return Math.sqrt(dx * dx + dy * dy);
}


const getRandomPink = () => {
  // Hue value for pink is around 330 degrees
  const hue = colorSet[0].h; 
  
  // Saturation between 80-100%
  const saturation = Math.floor(Math.random() * 40) + 20;
  
  // Lightness between 50-80%
  const lightness = Math.floor(Math.random() * 60) + 30;

  return [hue, saturation, lightness];
}

function generatePoints(p1, p2, num, dis) {

  const points = [];

  for(let i = 0; i < num; i++) {

    const t = Math.random();
    const x = p1[0] + t * (p2[0] - p1[0]);
    const y = p1[1] + t * (p2[1] - p1[1]);
    const r1 = [x, y];

    const angle = Math.random() * Math.PI * 2; 
    const dx = Math.cos(angle) * Math.random() * dis;
    const dy = Math.sin(angle) * Math.random() * dis;
    const r2 = [r1[0] + dx, r1[1] + dy];

    points.push(r2);
  }

  return points;
}





function divideDistance(p1, p2, seg) {
  const dx = (p2[0] - p1[0]) / seg;
  const dy = (p2[1] - p1[1]) / seg;

  const div_segments = [];

  for (let i = 0; i < seg; i++) {
    const startX = p1[0] + dx * i;
    const startY = p1[1] + dy * i;
    const endX = startX + dx; 
    const endY = startY + dy;
    div_segments.push([[startX, startY], [endX, endY]]);
  }

  return div_segments;
}

function getPointOnLine(point1, point2) {
  // Generate a random value 't' between 0 and 1
  const t = Math.random();

  // Calculate the coordinates of the random point
  const randomX = point1[0] + t * (point2[0] - point1[0]);
  const randomY = point1[1] + t * (point2[1] - point1[1]);

  // Return the random point as an array [x, y]
  return [randomX, randomY];
}



function getPointOnAngle(s, len, ang) {

  const angleRad = ang * Math.PI / 180;
  const dx2 = len * Math.cos(angleRad);
  const dy2 = len * Math.sin(angleRad);
  const x = s[0] + dx2;
  const y = s[1] + dy2;
  return [x, y];
}




function getEllipsePoints(c, w, h, dis) {
  var [cx, cy] = c;
  cy -= 14;
  const points = [];
  const halfW = w / 2;
  const halfH = h / 2;


  let x = cx - halfW;


  while (x <= cx + halfW) {
      // Calculate the y-coordinate using the ellipse equation
      const y = cy - (halfH * Math.sqrt(1 - Math.pow(x - cx, 2) / Math.pow(halfW, 2)));
      
      points.push([x, y]);


      x += dis;
  }

  if (points.length > 0) {
    points.shift();
    points.pop();
}
  return points;
}

Array.prototype.random = function () {
  return this[Math.floor((fxrand() * this.length))];
}

function flip() {
  return fxrand() <= 0.5? -1 : 1;
}

function half(one, two) {
  if (one == undefined || two == undefined) {
    if (fxrand() < 0.5)
      return false;
    else
      return true;
  }
  else {
    if (fxrand() <= 0.5)
      return one;
    else
      return two;
  }
}

function cusrand(min, max, arr) {
  let result = Math.floor(fxrand() * (max - min + 1) + min);
  if (arr != undefined) {
    while (arr.includes(result)) {
      result = Math.floor(fxrand() * (max - min + 1) + min);
    }
  }
  return result;
}
function floatrand(min, max) {
  return fxrand() * (max - min) + min;
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);


  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(clr) {
  return "#" + componentToHex(clr[0]) + componentToHex(clr[1]) + componentToHex(clr[2]);
}



