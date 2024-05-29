
let canvasSize;


let destination;
let currentPos;
let R, V, S;
let eyeCount = 10;

let eyes = []

let circles = [];
let tries = 0;
let params;

let type = 1;
let bgCnvs;
let e1r, e2r, e3r, e4r, e5r, e6r;
const SEED = cusrand(1, 9999)
function setup() {

  params = getURLParams();

  if (params.cnvsSize) {
    canvasSize = int(params.cnvsSize);  
  } else {
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
  }
//circles =  createGrid(canvasSize, canvasSize, 2, 2, canvasSize/2);
  createCanvas(canvasSize, canvasSize);
  bgCnvs = createGraphics(canvasSize, canvasSize);


  background(220);
  imageMode(CORNER)
  image(bgCnvs, 0, 0)
  imageMode(CENTER);


  
  const radMin = 70;
  const radMax = 120;

  generateRandomCircle(canvasSize, radMin, radMax);

shuffleArray(circles)

for (let e = 0; e < circles.length; e++) {
let hue = cusrand(0, 360), hue2 = cusrand(0, 360);
  let hsl = HSLToRGB(hue, cusrand(60, 100), cusrand(60, 80));
  let hsl2 = HSLToRGB(hue2, cusrand(50, 60), cusrand(20, 30));
  let pupilFill = `rgba(${hsl[0]}, ${hsl[1]}, ${hsl[2]}, 1)`;
  let ballFill = `rgba(${hsl2[0]}, ${hsl2[1]}, ${hsl2[2]}, 1)`;
  let eye = Object.create(null);
  eye.hue = hue;
  eye.hue2 = hue2;
  eye.location = [circles[e].x, circles[e].y];
  eye.radius = 100;
  eye.speed = 3;
  eye.destination = getRandomPoint(eye.radius);
  eye.current = createVector(0, 0);
  eye.style1 = {fill:"white", stroke:ballFill, fillStyle:"cross-hatch", hachureGap:1.5, fillWeight:1}
  eye.style2 = {fill:ballFill, stroke:"none", fillStyle:"solid"}
  eye.style3 = {fill:pupilFill, stroke:ballFill, fillStyle:"solid"}
  eye.style5 = {fill:"rgba(255, 255, 255, 0.4)", stroke:"none", fillStyle:"solid"}


  let e1 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
  e1r = rough.canvas(e1.elt)
  e1r.ellipse(e1.width/2, e1.height/2, eye.radius*2, eye.radius*2, {seed:e + SEED, fill: eye.style1.fill, stroke:  eye.style1.stroke, fillStyle: eye.style1.fillStyle, hachureGap:eye.style1.hachureGap, fillWeight:eye.style1.fillWeight})
  eye.e1 = e1;
  eye.e1r = rough.canvas(eye.e1.elt)

  let e2 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
  eye.e2 = e2;
  eye.e2r = rough.canvas(eye.e2.elt)

   let e3 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
  eye.e3 = e3;
  eye.e3r = rough.canvas(eye.e3.elt)

 let  e4 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
  e4r = rough.canvas(e4.elt)
 e4r.ellipse(e4.width/2, e4.height/2, eye.radius*2, eye.radius*2, {seed:e + SEED, fill:"white", stroke:"none", fillStyle:"solid"})
 eye.e4 = e4;
 eye.e4r = rough.canvas(eye.e4.elt)

   let e5 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
   eye.e5 = e5;
   eye.e5r = rough.canvas(eye.e5.elt)

   let e6 = createGraphics(eye.radius*2 + 15, eye.radius*2 + 15)
  e6r = rough.canvas(e6.elt)
   e6r.ellipse(e6.width/2, e6.height/2, eye.radius*2,eye.radius*2, {seed:e + SEED, stroke: ballFill, strokeWidth:3} ) 

    eye.e6 = e6;
    eye.e6r = rough.canvas(eye.e6.elt)
  eyes.push(eye);



  image(eye.e1, eye.location[0], eye.location[1])
  
  let offX = cusrand(0, eye.radius/1.5), offY = cusrand(0, eye.radius/1.5)
  let dirX = flip()
  let dirY = flip()
  eye.e2.clear()

  eye.e2r.ellipse(eye.e2.width/2+ offX*dirX, eye.e2.height/2+offY*dirY, eye.radius, eye.radius, {seed:e + SEED, fill: eye.style2.fill, stroke:  eye.style2.stroke, fillStyle: eye.style2.fillStyle})
  
  eye.e3.clear()
  eye.e3r.ellipse(eye.e3.width/2+offX*dirX, eye.e3.height/2+offY*dirY, eye.radius*1.5, eye.radius*1.5, {seed:e + SEED, fill: eye.style3.fill, stroke:  eye.style3.stroke, fillStyle:  eye.style3.fillStyle, strokeWidth:2})
  
  eye.e5.clear()
  eye.e5r.ellipse(eye.e5.width/2+offX*dirX, eye.e5.height/2+offY*dirY, eye.radius*2, eye.radius*2, {seed:e + SEED, fill: eye.style5.fill, stroke:  eye.style5.stroke, fillStyle:  eye.style5.fillStyle})
  
  e2i = eye.e2.get()
  e3i = eye.e3.get() 
  e5i = eye.e5.get()
  e4i = eye.e4.get()

  e2i.mask(e4i)
  e3i.mask(e4i)
  e5i.mask(e4i)

  push()
  //tint(255, 127);
  //blendMode(SOFT_LIGHT)
 image(e5i, eye.location[0], eye.location[1])
  blendMode(BLEND)
  pop()
  image(e3i, eye.location[0], eye.location[1])
  image(e2i, eye.location[0], eye.location[1])

  image(eye.e6, eye.location[0], eye.location[1]) 
  

}



  
}


function draw() {

}






function createGrid(w, h, r, c, m) {

  // Step 1: Calculate the total width and height of the grid
  const gridWidth = (c - 1) * m;
  const gridHeight = (r - 1) * m;

  // Step 2: Calculate the starting point of the grid
  const startX = (w - gridWidth) / 2;
  const startY = (h - gridHeight) / 2;

  // Step 3: Create the array of coordinates
  let coordinates = [];
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      // Calculate the coordinates of each dot
      const x = startX + j * m;
      const y = startY + i * m;
      coordinates.push({ x, y });
    }
  }

  return coordinates;
}




let area = 100;
function generateRandomCircle(sqside, radMin, radMax) {
  if (circles.length <= 120){
    if (tries <= 100){

        let found = false;

        const circrad = getRandomNumber(radMin, radMax);
        const randLoc = getRandomLocation(area, canvasSize/2);
        found = false  ;

        for (const circle of circles) {
            if (isInsideCircle(randLoc, circle)) {
                found = true;
                break;
            }
        }
      
        tries++;
      
        if (!found) {
            circles.push({
                x: randLoc.x,
                y: randLoc.y,
                radius: circrad
            });
           return generateRandomCircle(area, radMin, radMax)
            
        }
        else {
         return generateRandomCircle(area, radMin, radMax)
        }

}
  else {
  if (area <= sqside){
  tries = 0;
        area += 100;

        let found = false;

        const circrad = getRandomNumber(radMin, radMax);
        const randLoc = getRandomLocation(area, canvasSize/2);
        found = false  ;

        for (const circle of circles) {
            if (isInsideCircle(randLoc, circle)) {
                found = true;
                break;
            }
        }
      
        tries++;
      
        if (!found) {
            circles.push({
                x: randLoc.x,
                y: randLoc.y,
                radius: circrad
            });
           return generateRandomCircle(area, radMin, radMax)
            
        }
        else {
         return generateRandomCircle(area, radMin, radMax)
        }
  
}

}

  }

}

function isInsideCircle(point, circle) {
    const distance = Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2);
    return distance < circle.radius;
}

function getRandomLocation(sqside, cnvsCenter) {
    return {
        x: getRandomNumber(cnvsCenter-sqside/2, cnvsCenter+sqside/2),
        y: getRandomNumber(cnvsCenter-sqside/2, cnvsCenter+sqside/2)
    };
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}





function setRandomDestination(e, r) {
  eyes[e].destination = getRandomPoint(r);
}

function getRandomPoint(R) {
    let x = random(-R, R);
    let y = random(-R, R);
    return { x: x, y: y };
}

function windowResized() {
  
  if (!params) {
    
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
    resizeCanvas(canvasSize, canvasSize);
  }
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



function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}