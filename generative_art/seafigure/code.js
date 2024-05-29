

function rndm(min, max) {
  return Math.round(fxrand() * (max - min) + min);
}

function rndm_double(min, max) {
  return fxrand() * (max - min) + min;
}

function halfChance() {
  var c = fxrand();
  if (c < 0.5)
    return false;
  else
    return true;
}

function vecField(x, y) {

  x = map(x, 0, fixCnvs.width, 0, vectorScale);
  y = map(y, 0, fixCnvs.height, 0, vectorScale);
  let k1 = map(x, -vectorScale, vectorScale, vR[0], vR[1]);
  let k2 = map(y, -vectorScale, vectorScale, vR[2], vR[3]);

  let u = sin(k1 * y) + cos(k2 * y);
  let v = sin(k2 * x) - cos(k1 * x);

  return createVector(u, v);
}

console.log("Hello, curious! 😊");
console.log("Enjoy this spaghetti! 🍝 (code)");

let colors = [];
let canvS = Math.min(window.innerWidth, window.innerHeight);
const fixS = 1000;
let colorNum = 0;
let mode = fxrand() <= 0.15 ? 1 : 0;
let satMin = 50, satMax = 85;
var vectorScale = 3;
var tentN = fxrand() <= 0.1 ? 600 : 500;
let tents = [];
var drctn = halfChance() ? 1 : -1;
let frame = Math.round(fixS / 4.44);
let dencity = fxrand() <= 0.07 ? 0.7 : 0.5;
let bgColor = "#ffffff";
let rare = fxrand() <= 0.01 ? true : false;

if (rare) {
  bgColor = "#ffffff";
}
else {
  if (mode == 0) {
    bgColor = HSLToHex(rndm(0, 360), 70, 98);
  }
  else {
    bgColor = "#000000";;
  }
}


if (fxrand() <= 0.15) {
  colorNum = 3;
}
else if (fxrand() <= 0.45) {
  colorNum = 2;
}
else if (fxrand() <= 0.75) {
  colorNum = 1;
}
else if (fxrand() <= 1) {
  colorNum = 0;
}

switch (colorNum) {
  case 0:
    let initC = HSLToHex(rndm(0, 360), rndm(satMin, satMax), 80)
    let scl = chroma.scale(['#ffffff', initC, '#000000']).colors(10);
    scl.shift();
    scl.pop();
    colors = scl;
    break;

  case 1:
    let hue1 = rndm(0, 360);
    let hue2 = rndm(0, 360);
    while (Math.abs(hue2 - hue1) <= 40) {
      hue2 = rndm(0, 360);
    }
    let clr1 = HSLToHex(hue1, rndm(satMin, satMax), 80)
    let clr2 = HSLToHex(hue2, rndm(satMin, satMax), 80)

    let scl1 = chroma.scale(['#ffffff', clr1, '#000000']).colors(10);
    let scl2 = chroma.scale(['#ffffff', clr2, '#000000']).colors(10);
    scl1.shift();
    scl1.splice(-2);
    scl2.shift();
    scl2.splice(-2);
    colors = scl1.concat(scl2);

    break;

  case 2:
    let hue11 = rndm(0, 360);
    let hue22 = rndm(0, 360);
    let hue3 = rndm(0, 360);

    while (Math.abs(hue22 - hue11) <= 40) {
      hue22 = rndm(0, 360);
    }

    while (Math.abs(hue22 - hue3) <= 20 || Math.abs(hue11 - hue3) <= 20) {
      hue3 = rndm(0, 360);
    }
    let clr11 = HSLToHex(hue11, rndm(satMin, satMax), 80)
    let clr22 = HSLToHex(hue22, rndm(satMin, satMax), 80)
    let clr3 = HSLToHex(hue3, rndm(satMin, satMax), 80)
    let scl11 = chroma.scale(['#ffffff', clr11, '#000000']).colors(10);
    let scl22 = chroma.scale(['#ffffff', clr22, '#000000']).colors(10);
    let scl3 = chroma.scale(['#ffffff', clr3, '#000000']).colors(10);
    scl11.shift();
    scl11.splice(-2);
    scl22.shift();
    scl22.splice(-2);
    scl3.shift();
    scl3.splice(-2);
    colors = scl11.concat(scl22).concat(scl3);

    break;
  case 3:

    for (let i = 0; i < 10; i++) {
      colors.push(HSLToHex(rndm(0, 360), rndm(65, 90), rndm(60, 70)))
    }

    break;
}


let fixCnvs;
function setup() {

  randomSeed(fxrand() * 99999);
  createCanvas(canvS, canvS);
  fixCnvs = createGraphics(fixS, fixS);

  if (mode == 0) {
    paperBg(bgColor, 35);
  }
  else {
    paperBg(bgColor, 20);
  }


  if (rare) {
    paperBg(bgColor, 40);
    colors = ["#000000"];
    dencity = 0.5;
    tentN = 550;
  }

  fixCnvs.rectMode(CENTER);
  fixCnvs.colorMode(HSB, 360, 100, 100);
  fixCnvs.strokeCap(SQUARE);
  fixCnvs.smooth(6);


  for (let i = 0; i < tentN; i++) {
    tents.push(new Tentacle());
  }


}

let finished = false;
function draw() {
  if (!finished) {
    counter = 0;
    for (let i = 0; i < tents.length; i++) {
      tents[i].update();
      if (tents[i].finished) {
        counter += 1;
      }
    }

    if (counter == tents.length) {
      finished = true;
      fxpreview();
    }

    image(fixCnvs, 0, 0, width, height);

  }

}

let minR = 5, maxR = 20;
if (fxrand() <= 0.07) {
  minR = 3;
  maxR = 15;
}

let vR = []
for (let i = 0; i < 4; i++) {
  vR[i] = rndm(-6, 6);
}

class Tentacle {
  constructor() {
    this.finished = false;
    this.p = createVector(random(frame, fixCnvs.width - frame), random(frame, fixCnvs.height - frame));
    this.p_prev = createVector(this.p.x, this.p.y);
    this.radius = random(minR, maxR);
    this.length = 0;
    this.step = random(0.3, 0.5);
    this.color = color(colors[floor(rndm(0, colors.length - 1))]);
    if (random(0, 1) > 0.5) {
      this.direction = 1;
    } else {
      this.direction = -1;
    }
    this.strokeWidth = 0.5;
    this.randy = random(0, 1);
    if (this.randy < dencity) {
      fixCnvs.fill(chroma(this.color.toString('#rrggbb')).darken(2).hex())
      fixCnvs.ellipse(this.p.x, this.p.y, this.radius * 1.25);
    }
  }
  getRad() {
    return this.radius;
  }

  update() {
    let dirX = vecField(this.p.x, this.p.y).x;
    let dirY = vecField(this.p.x, this.p.y).y;
    this.p.x += drctn * dirX * this.step;
    this.p.y += drctn * dirY * this.step;
    fixCnvs.strokeWeight(this.strokeWidth);
    fixCnvs.stroke(this.color);
    if (fixCnvs.brightness(this.color) < 50) fixCnvs.fill(200); else fixCnvs.fill(0);
    if (this.radius > 1) {
      if (this.randy < dencity) {
        fixCnvs.noStroke();
        fixCnvs.fill(this.color);
        fixCnvs.ellipse(this.p.x, this.p.y, this.radius);
        this.radius -= 0.1;
        this.length += 1;
      }
    }
    else {
      this.finished = true;
    }
    this.p_prev.set(this.p);
  }

}


const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  //made by @twirizzo
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


function paperBg(bg, in_val) {
  fixCnvs.background(bg);
  fixCnvs.noStroke();
  for (var i = 0; i < fixCnvs.width - 1; i += 2) {
    for (var j = 0; j < fixCnvs.height - 1; j += 2) {
      fixCnvs.fill(random(235 - 40, 235 + 30), in_val);
      fixCnvs.rect(i, j, 2, 2);
    }
  }

  for (var i = 0; i < 30; i++) {
    fixCnvs.fill(random(30, 170), random(in_val * 2.5, in_val * 3));
    fixCnvs.rect(random(0, fixCnvs.width - 2), random(0, fixCnvs.height - 2), random(1, 3), random(1, 3));
  }
}

function keyPressed() {
  if (key === 's') {
    save(fixCnvs, "esplorazione2000x2000.png");
  }
}

features = [ntc.name(bgColor)[1], colorNum, mode, dencity, maxR, tentN, rare];

window.$fxhashFeatures = {
  bgColor: `${features[0]}`,
  colorCount: `${features[1] == 3 ? "3+" : (features[1] + 1)}`,
  darkMode: `${features[2] == 1 ? "Yes" : "No"}`,
  dencity: `${features[3]}`,
  thin: `${features[4] == 20 ? "No" : "Yes"}`,
  tentNumber: `${features[5] == 500 ? "Default" : "Crowded"}`,
  colorful: `${features[1] == 3 ? "Yes" : "No"}`,
  RARE_BW: `${features[6] ? "Yes" : "No"}`
}
