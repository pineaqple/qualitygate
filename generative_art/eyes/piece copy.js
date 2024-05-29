let canvasSize;


let destination;
let currentPos;
let R, V, S;
let eyeCount = 10;

let eyes = []

const circles = [];

function setup() {

  let params = getURLParams();

  if (params.cnvsSize) {
    canvasSize = int(params.cnvsSize);  
  } else {
    canvasSize = Math.min(window.innerWidth, window.innerHeight);
  }
  
  createCanvas(canvasSize, canvasSize);


  let offX = -50, offY = 50;

  background(220);
  imageMode(CENTER);
   c1 = createGraphics(105, 105)
  c1.strokeWeight(2)
  c1.stroke("#521b87")
  c1.fill("#c39ccc")
  c1.ellipse(c1.width/2, c1.height/2, 100)

   c2 = createGraphics(105, 105)
  c2.noStroke()
  c2.fill("#521b87")
  c2.ellipse(c2.width/2+offX, c2.height/2+offY, 50)

   c3 = createGraphics(105, 105)
  c3.strokeWeight(2)
  c3.fill("#0aec6f")
  c3.stroke("#521b87")
  c3.ellipse(c3.width/2+offX, c3.height/2+offY, 70)

   c4 = createGraphics(105, 105)
  c4.noStroke()
  c4.ellipse(c4.width/2, c4.height/2, 100)


   c5 = createGraphics(105, 105)
  c5.noStroke()
  c5.fill(255)
  c5.ellipse(c4.width/2+offX-3, c4.height/2+offY-3, 100)

   c6 = createGraphics(105, 105)
  c6.noFill()
  c6.strokeWeight(3)
  c6.stroke("#521b87")
  c6.ellipse(c6.width/2, c6.height/2, 100) 


c1i = c1.get() // violet bg
c2i = c2.get() // зіниця
c3i = c3.get() //райдужка
c4i = c4.get() //mask
c5i = c5.get() //white bg

c2i.mask(c4i)
c3i.mask(c4i)
c5i.mask(c4i)

  image(c1i, width/2, height/2)
  image(c3i, width/2, height/2)
  image(c2i, width/2, height/2)
  push()
  tint(255, 127);
  blendMode(SOFT_LIGHT)
  image(c5i, width/2, height/2)
  blendMode(BLEND)
  pop()
  image(c6, width/2, height/2) //outline

for (let e = 0; e < eyeCount; e++) {
  let eye = Object.create(null);
  eye.location = [cusrand(0, width), cusrand(0, height)];
  eye.size = cusrand(40, 50);
  eye.destination = null;
  eye.current = eye.location;

  let e1 = createGraphics(105, 105)
  e1.strokeWeight(2)
  e1.stroke("#521b87")
  e1.fill("#c39ccc")
  e1.ellipse(e1.width/2, e1.height/2, 100)
  eye.e1 = e1;

  let e2 = createGraphics(105, 105)
  e2.noStroke()
  e2.fill("#521b87")
  e2.ellipse(e2.width/2+offX, e2.height/2+offY, 50)
  eye.e2 = e2;

   let e3 = createGraphics(105, 105)
   e3.strokeWeight(2)
   e3.fill("#0aec6f")
   e3.stroke("#521b87")
   e3.ellipse(e3.width/2+offX, e3.height/2+offY, 70)
  eye.e3 = e3;
  
 let  e4 = createGraphics(105, 105)
 e4.noStroke()
 e4.ellipse(e4.width/2, e4.height/2, 100)
 eye.e4 = e4;

   let e5 = createGraphics(105, 105)
   e5.noStroke()
   e5.fill(255)
   e5.ellipse(e5.width/2+offX-3, e5.height/2+offY-3, 100)
   eye.e5 = e5;

   let e6 = createGraphics(105, 105)
   e6.noFill()
   e6.strokeWeight(3)
   e6.stroke("#521b87")
   e6.ellipse(e6.width/2, e6.height/2, 100) 
    eye.e6 = e6;
  eyes.push(eye);
}
  moveEllipse(50, 1.5, [0, 0]);
}


function draw() {
  background(220);

  for (let e = 0; e < eyes.length; e++) {
    const eye = eyes[e];

  }


  if (destination && currentPos) {
    let dir = createVector(destination.x - currentPos.x, destination.y - currentPos.y);
    if (dir.mag() > V) {
      dir.setMag(V);
      currentPos.add(dir);
    } else {
      currentPos.set(destination.x, destination.y);
      destination = null;
      setTimeout(() => {
        setRandomDestination(currentPos);
      }, random(1000, 3000)); 
    }
  }


image(c1i, width/2, height/2)


c2.clear()
c2.ellipse(c2.width/2 + currentPos.x, c2.height/2 +currentPos.y, 50)


c3.clear()
c3.ellipse(c3.width/2 +currentPos.x, c3.height/2 +currentPos.y, 70)

c5.clear()
c5.ellipse(c5.width/2 +currentPos.x, c5.height/2 +currentPos.y, 100)

c2i = c2.get()
c3i = c3.get() 
c5i = c5.get()

c2i.mask(c4i)
c3i.mask(c4i)
c5i.mask(c4i)

image(c3i, width/2, height/2)
image(c2i, width/2, height/2)
push()
tint(255, 127);
blendMode(SOFT_LIGHT)
image(c5i, width/2, height/2)
blendMode(BLEND)
pop()
image(c6, width/2, height/2) 

}





function moveEllipse(r, v, s) {
  R = r;
  V = v;
  S = createVector(s[0], s[1]);
  currentPos = S.copy();
  setRandomDestination(currentPos);
}

function setRandomDestination(pos) {
  destination = getRandomPoint(R);
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



