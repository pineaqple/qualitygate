

let canvasSize;


let destination;
let currentPos;
let R, V, S;
let eyeCount = 10;

let eyes = []

const circles = createGrid(500, 500, 2, 2, 150);
let tries = 0;

function setup() {

  let params = getURLParams();

  if (params.cnvsSize) {
    canvasSize = int(params.cnvsSize);  
  } else {
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
  }

  createCanvas(canvasSize, canvasSize);

  let offX = 0, offY = 0;

  background(220);
  imageMode(CENTER);

  
  const radMin = 70;
  const radMax = 120;

  //generateRandomCircle(canvasSize, radMin, radMax);


for (let e = 0; e < circles.length; e++) {
  let eye = Object.create(null);
  eye.location = [circles[e].x, circles[e].y];
  eye.radius = cusrand(40, 50);
  eye.speed = 2;
  eye.destination = getRandomPoint(eye.radius);
  eye.current = createVector(0, 0);

  let e1 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
  let e1r = rough.canvas(e1.elt)
  let seed = cusrand(0, 9999)
  e1r.ellipse(e1.width/2, e1.height/2, eye.radius*2, eye.radius*2, {seed:seed, fill:"#c39ccc", stroke:"#521b87", strokWidth:2})
  // e1.strokeWeight(2)
  // e1.stroke("#521b87")
  // e1.fill("#c39ccc")
  // e1.ellipse(e1.width/2, e1.height/2, eye.radius*2)
  eye.e1 = e1;

  let e2 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
  e2.noStroke()
  e2.fill("#521b87")
  e2.ellipse(e2.width/2+offX, e2.height/2+offY, eye.radius)
  eye.e2 = e2;

   let e3 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
   e3.strokeWeight(2)
   e3.fill("#0aec6f")
   e3.stroke("#521b87")
   e3.ellipse(e3.width/2+offX, e3.height/2+offY, eye.radius*1.5)
  eye.e3 = e3;

 let  e4 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
 e4.noStroke()
 e4.ellipse(e4.width/2, e4.height/2, eye.radius*2)
 eye.e4 = e4;

   let e5 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
   e5.noStroke()
   e5.fill(255)
   e5.ellipse(e5.width/2+offX-3, e5.height/2+offY-3, eye.radius*2)
   eye.e5 = e5;

   let e6 = createGraphics(eye.radius*2 + 5, eye.radius*2 + 5)
   e6.noFill()
   e6.strokeWeight(3)
   e6.stroke("#521b87")
   e6.ellipse(e6.width/2, e6.height/2, eye.radius*2) 
    eye.e6 = e6;
  eyes.push(eye);

}
  
}


function draw() {
  if (frameCount % 1 == 0)
  {
  background(220);

  for (let e = 0; e < eyes.length; e++) {
    const eye = eyes[e];

    if (eye.destination && eye.current) {
      let dir = createVector(eye.destination.x - eye.current.x, eye.destination.y - eye.current.y);
      if (dir.mag() > eye.speed) {
        dir.setMag(eye.speed);
        eye.current.add(dir);
      } else {
        eye.current.set(eye.destination.x, eye.destination.y);
        eye.destination = null;
        setTimeout(() => {
          setRandomDestination(e, eye.radius);
        }, random(1000, 3000)); // Random time between 1-3 seconds
      }
    }
  
  
  image(eye.e1, eye.location[0], eye.location[1])
  
  
  eye.e2.clear()
  eye.e2.ellipse(eye.e2.width/2 + eye.current.x, eye.e2.height/2 +eye.current.y, eye.radius/1.1)
  
  
  eye.e3.clear()
  eye.e3.ellipse(eye.e3.width/2 +eye.current.x, eye.e3.height/2 +eye.current.y, eye.radius*1.5)
  
  eye.e5.clear()
  eye.e5.ellipse(eye.e5.width/2 +eye.current.x, eye.e5.height/2 +eye.current.y, eye.radius*2)
  
  e2i = eye.e2.get()
  e3i = eye.e3.get() 
  e5i = eye.e5.get()
  e4i = eye.e4.get()

  e2i.mask(e4i)
  e3i.mask(e4i)
  e5i.mask(e4i)
  
  image(e3i, eye.location[0], eye.location[1])
  image(e2i, eye.location[0], eye.location[1])
  push()
  tint(255, 127);
  blendMode(SOFT_LIGHT)
  image(e5i, eye.location[0], eye.location[1])
  blendMode(BLEND)
  pop()
  image(eye.e6, eye.location[0], eye.location[1]) 
  
  }

}

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
  if (circles.length <= 10){
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
  
  if (!params.cnvsSize) {
    
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
    resizeCanvas(canvasSize, canvasSize);
  }
}

function graphicsToImage(pg) {
  let img = createImage(pg.width, pg.height);
  img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
  return img;
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



