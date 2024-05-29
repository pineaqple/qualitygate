function flip() {
  var c = fxrand();
  if (c < 0.5)
    return false;
  else
    return true;
}

function rand(min, max) {
  return Math.round(fxrand() * (max - min) + min);
}

function randdouble(min, max) {
  return fxrand() * (max - min) + min;
}

const to_radians = deg => (deg * Math.PI) / 180.0;

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

function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}


function polygon(x, y, radius, npoints) {
  //made by @codecand
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function curveBetween(x1, y1, x2, y2, d, h, flip) {
  var original = p5.Vector.sub(createVector(x2, y2), createVector(x1, y1));
  var inline = original.copy().normalize().mult(original.mag() * d);
  var rotated = inline.copy().rotate(radians(90) + flip * radians(180)).normalize().mult(original.mag() * h);
  var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), createVector(x1, y1));
  rotated.mult(-1);
  var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), createVector(x2, y2));
  bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2)
}


function excludeDirtColor(min, max) {
  var num = Math.floor(fxrand() * (max - min + 1)) + min;
  return (num >= 25 && num <= 75) ? excludeDirtColor(min, max) : num;
}

function weightedRand(weights) {
  var totalWeight = 0,
    i, random;

  for (i = 0; i < weights.length; i++) {
    totalWeight += weights[i];
  }

  random = fxrand() * totalWeight;

  for (i = 0; i < weights.length; i++) {
    if (random < weights[i]) {
      return i;
    }

    random -= weights[i];
  }

  return -1;
};



let transparency = rand(150, 250)
let hasBlush = fxrand() <= 0.8, hasArms = fxrand() <= 0.7

let eyeType = rand(0, 12);
let mouthType = rand(0, 9);
let smileIntensity = randdouble(0.2, 0.5)
let glassColor = HSLToHex(rand(0, 360), 70, 80);
let blushType = rand(0, 2);
let winkleX = [], winkleY = []
let rndPattern;

let pinkShades = chroma.scale(['#ffc0cb', '#893843'])
  .mode('lch').colors(8)
let pinkShades2 = chroma.scale(['#ffa6c9', '#de9dac']).mode('lch').colors(8)
let pinkShades3 = chroma.scale(['#ffa6c9', '#F64A8A']).mode('lch').colors(6)
let heartShades = chroma.scale(['#9E1B32', '#EE6C8A']).mode('lch').colors(8)
let starShades = chroma.scale(['#ffd800', '#e1ad01']).mode('lch').colors(6)
let starColor = starShades[rand(0, starShades.length - 1)]
let blushColor = pinkShades[rand(0, pinkShades.length - 1)]
let blushColor2 = pinkShades2[[rand(0, pinkShades2.length - 1)]]
let blushColor3 = pinkShades3[[rand(0, pinkShades3.length - 1)]]
let noseColor = pinkShades[rand(0, pinkShades.length - 1)]
let blushAlpha = rand(150, 250);
let heartColor = heartShades[rand(0, heartShades.length - 1)]
let isBlack = fxrand() <= 1 / 20;
let tieColor = isBlack ? "#282828" : HSLToHex(excludeDirtColor(0, 360), rand(50, 100), rand(20, 25));
let bowColor1 = isBlack ? "#282828" : HSLToHex(excludeDirtColor(0, 360), rand(50, 100), rand(20, 25));
let bowColor2 = isBlack ? "#282828" : HSLToHex(excludeDirtColor(0, 360), rand(50, 100), rand(20, 25));
let bowType = rand(0, 1);
let apparelType = weightedRand([0.25, 0.5, 0.25])

let txt;
let hue1 = fxrand() < 0.09 ? rand(0, 25) : rand(100, 360);
let sat1 = rand(25, 70);
let bri1 = rand(70, 70);
let lightHue = HSLToHex(hue1, sat1, bri1 + sat1 * 0.1);
let txtColor = HSLToHex(hue1, rand(50, 50), rand(55, 55));
let mode = fxrand() <= 0.7 ? true : false;
let bgLight = HSLToHex(hue1, rand(20, 55), rand(70, 85));
let bgDark = HSLToHex(hue1, rand(20, 30), rand(20, 30));
let rot = rand(-5, 5)
let bottomHeight = rand(5, 15)
let bottomWidth = rand(3, 10)
let ctx;
let bgColor = mode ? bgLight : bgDark;


function setup() {


  ctx = canvas.getContext('2d');
  randomSeed(Math.round(fxrand() * 9999))
  noiseSeed(Math.round(fxrand() * 9999))

  createCanvas(800, 800);





  txtr = createGraphics(width, height)
  txtr.loadPixels()
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {

      txtr.set(i, j, color(120, noise(i / 3, j / 3, i * j / 30) * rand(10, 80)))
    }
  }
  txtr.updatePixels()



}

let t = 0;
let gradWidth = rand(70, 220);
let gradHeight = rand(170, 300);
let ghostHue = rand(0, 360)
let ghostSatLight = rand(30, 90);
let ghostSatDark = rand(15, 35);
let ghostLight = HSLToHex(ghostHue, ghostSatLight, 90);
let ghostDark = HSLToHex(ghostHue, ghostSatDark, 30);
let offsetSpeed = rand(10, 15)
let spiralAngle = rand(11, 14)

let eyeWidth = rand(2, 5), eyeHeight = randdouble(3.5, 4.5);


let ghostWidth = gradWidth / 2;
let ghostHeight = gradHeight / 2;

function draw() {
  background(bgColor);

  if (mode) {
    push()
    blendMode(MULTIPLY)
    image(txtr, 0, 0)
    pop()
  }
  else {
    push()
    blendMode(ADD)
    image(txtr, 0, 0)
    pop()
  }

  let offset = offsetSpeed * sin(t / 1.5)
  push();
  translate(width / 2, height / 2);
  rotate(to_radians(rot))
  push();
  translate(0, offset)



  let transDarK = color(ghostDark)
  transDarK.setAlpha(80)
  if (!hasArms) {
    ctx.shadowColor = transDarK;
    ctx.shadowBlur = 20;
  }

  let ghostGrad = drawingContext.createLinearGradient(gradWidth / 10 - 50, gradHeight / 10, gradWidth, gradHeight * 0.4);
  ghostGrad.addColorStop(0, ghostLight);
  ghostGrad.addColorStop(1, ghostDark);
  drawingContext.fillStyle = ghostGrad;

  let hK = ghostHeight / 2;
  let wK = ghostWidth / 2;
  let k = hK + wK;
  let sK = (wK + hK) / 2;

  noStroke();
  beginShape();
  if (hasArms) {
    curveBetween(ghostWidth - k / 2, -ghostHeight / 10, ghostWidth - 2, k / 2, 0.45, 0.9 + hK / 300, 1)
    curveBetween(-ghostWidth + k / 2, -ghostHeight / 10, -ghostWidth + 2, k / 2, 0.45, 0.9 + hK / 300, 0)
  }


  vertex(ghostWidth, 0);
  bezierVertex(ghostWidth, -ghostHeight, -ghostWidth, -ghostHeight, -ghostWidth, 0);
  vertex(-ghostWidth, ghostHeight)



  for (let i = ghostWidth * -1; i <= ghostWidth; i++) {

    let y = ghostHeight + sin(i / bottomWidth - t) * bottomHeight;
    vertex(i, y)
  }

  vertex(ghostWidth, 0)
  endShape();

  ctx.shadowBlur = 0;


  //eyes
  fill(40)
  switch (eyeType) {
    case 0:
      ellipse(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.7 + abs(offset / 5), ghostWidth / 5);
      ellipse(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.7 + abs(offset / 5), ghostWidth / 5);
      break;
    case 1:
      let multip = 1;
      for (let angle = 0; angle <= spiralAngle; angle += max(0.03 - ghostWidth / 4000, 0.01)) {
        x = cos(angle) * multip;
        y = sin(angle) * multip;
        multip += 0.01
        ellipse(x - wK + (offset / 2), y - hK / 1.35 + abs(offset / 5), 2);
      }
      let multip2 = 1;
      for (let angle = 0; angle <= spiralAngle; angle += max(0.03 - ghostWidth / 4000, 0.01)) {
        x = -cos(angle) * multip2;
        y = sin(angle) * multip2;
        multip2 += 0.01
        ellipse(x + wK / 2 + (offset / 2), y - hK / 1.35 + abs(offset / 5), 2);
      }
      break;
    case 2:
      push()
      translate(-ghostWidth / 2 + (offset / 2) - wK / 5, -ghostHeight / 3 + abs(offset / 5));
      strokeCap(ROUND)
      scale(ghostWidth / 75)
      triangle(0, 0, 2, -10, 20, -2)
      pop()

      push()
      translate(ghostWidth / 5 + (offset / 2) + wK / 5, -ghostHeight / 3 + abs(offset / 5));
      strokeCap(ROUND)
      scale(ghostWidth / 75)
      triangle(-20, -2, -2, -10, 0, 0)
      pop()
      break;

    case 3:
      ellipse(-ghostWidth / 2 + (offset / 2) + 1, -ghostHeight / 2.7 + abs(offset / 5), ghostWidth / 6.5, ghostWidth / eyeHeight);
      ellipse(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.7 + abs(offset / 5), ghostWidth / 6.5, ghostWidth / eyeHeight);
      break;
    case 4:
      ellipse(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.45 + abs(offset / 5), ghostWidth / 6);
      ellipse(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.45 + abs(offset / 5), ghostWidth / 6);

      push()
      noFill();
      stroke(40)
      strokeWeight(1.5)
      ellipse(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.4 + abs(offset / 5), ghostWidth / 3);
      ellipse(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.4 + abs(offset / 5), ghostWidth / 3);
      curveBetween(-ghostWidth / 2 + (offset / 2) + ghostWidth / 6, -ghostHeight / 2.4 + abs(offset / 5), ghostWidth / 5 + (offset / 2) - ghostWidth / 6, -ghostHeight / 2.4 + abs(offset / 5), 0.3, 0.1, 1)
      curveBetween(ghostWidth / 5 + (offset / 2) + ghostWidth / 6, -ghostHeight / 2.4 + abs(offset / 5), ghostWidth / 5 + (offset / 2) + ghostWidth / 6 + ghostWidth / 4.7, -ghostHeight / 2.3 + abs(offset / 5), 0.3, 0.2, 1)

      pop()
      break;

    case 5:
      fill(heartColor)
      heart(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.5 + abs(offset / 5), ghostWidth / 5)
      heart(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.5 + abs(offset / 5), ghostWidth / 5)
      break;

    case 6:

      push()
      stroke(40)
      strokeWeight(3)
      strokeCap(ROUND)

      line(-ghostWidth / 2 + (offset / 2) - ghostWidth / 12, -ghostHeight / 2.2 + abs(offset / 5), -ghostWidth / 2 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5))
      line(-ghostWidth / 2 + (offset / 2) + ghostWidth / 12, -ghostHeight / 2.2 + abs(offset / 5), -ghostWidth / 2 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5))

      line(ghostWidth / 5 + (offset / 2) - ghostWidth / 12, -ghostHeight / 2.2 + abs(offset / 5), ghostWidth / 5 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5))
      line(ghostWidth / 5 + (offset / 2) + ghostWidth / 12, -ghostHeight / 2.2 + abs(offset / 5), ghostWidth / 5 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5))

      pop()
      break;

    case 7:
      fill(starColor)
      push()
      strokeWeight(ghostWidth / 35)
      stroke(chroma(starColor).darken(0.2).hex())
      translate(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.6 + abs(offset / 5))
      rotate(to_radians(15))
      star(0, 0, ghostWidth / 6, ghostWidth / 12, 5)
      pop()
      push()
      strokeWeight(ghostWidth / 35)
      stroke(chroma(starColor).darken(0.2).hex())
      translate(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.6 + abs(offset / 5))
      rotate(to_radians(15))
      star(0, 0, ghostWidth / 6, ghostWidth / 12, 5)
      pop()
      break;
    case 8:

      push()
      stroke(40)
      strokeWeight(4)
      strokeJoin(ROUND)
      push()
      translate(-ghostWidth / 2 + (offset / 2), -ghostHeight / 2.2 + abs(offset / 5))
      rotate(to_radians(40))
      rect(0, 0, ghostWidth / 10, ghostWidth / 10)
      pop()

      push()
      translate(ghostWidth / 5 + (offset / 2), -ghostHeight / 2.23 + abs(offset / 5))
      rotate(to_radians(43))
      rect(0, 0, ghostWidth / 10, ghostWidth / 10)
      pop()

      pop()
      break;
    case 9:
      push()
      noFill()
      strokeWeight(2.5)
      stroke(40)
      curveBetween(-ghostWidth / 2 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), -ghostWidth / 2 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), 0.3, 0.5, 0)
      curveBetween(ghostWidth / 5 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), ghostWidth / 5 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), 0.3, 0.5, 0)
      pop()
      break;
    case 10:
      push()
      noFill()
      strokeWeight(2.5)
      stroke(40)
      curveBetween(-ghostWidth / 2 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), -ghostWidth / 2 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), 0.3, 0.5, 1)
      curveBetween(ghostWidth / 5 + (offset / 2) - ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), ghostWidth / 5 + (offset / 2) + ghostWidth / 12, -ghostHeight / 3 + abs(offset / 5), 0.3, 0.5, 1)
      pop()
      break;
    case 11:


      push()
      noFill()
      stroke(40)
      strokeWeight(wK / 12)

      translate(-ghostWidth / 3 + (offset / 2), -ghostHeight / 2 + abs(offset / 5))
      curveBetween(0, wK / 5, wK, wK / 4.2, 0.3, 0.1, 1)
      pop()

      push()
      fill(40)
      translate(-ghostWidth / 1.7 + (offset / 2), -ghostHeight / 2 + abs(offset / 5))
      rect(0, 0, ghostWidth / 3, ghostWidth / 5, wK / 10, wK / 10, wK / 5, wK / 5)
      pop()


      push()
      translate(- ghostWidth / 15 + (offset / 2), -ghostHeight / 2 + abs(offset / 5))
      rect(0, 0, ghostWidth / 3, ghostWidth / 5, wK / 10, wK / 10, wK / 5, wK / 5)
      pop()

      break;
    case 12:
      push()
      stroke(40)
      strokeWeight(4)
      strokeJoin(ROUND)
      push()
      translate(-ghostWidth / 2 + (offset / 2), -sK * 1.05 + abs(offset / 5))
      rotate(to_radians(-3))
      rect(0, 0, ghostWidth / 10, ghostWidth / 10)
      pop()

      push()
      translate(ghostWidth / 7 + (offset / 2), -sK * 1.02 + abs(offset / 5))
      rotate(to_radians(-2))
      rect(0, 0, ghostWidth / 10, ghostWidth / 10)
      pop()

      pop()
      break;
  }




  //blush

  let blushFill;
  if (hasBlush) {
    switch (blushType) {
      case 0:
        noStroke()
        blushFill = color(blushColor);
        blushFill.setAlpha(blushAlpha - 50);
        fill(blushFill)
        ellipse(-ghostWidth / 1.8 + (offset / 2), -ghostHeight / 3 + abs(offset / 5) + ghostWidth / 3.8, ghostWidth / 4, ghostWidth / 6);
        ellipse(ghostWidth / 3.5 + (offset / 2), -ghostHeight / 3 + abs(offset / 5) + ghostWidth / 3.8, ghostWidth / 4, ghostWidth / 6);
        break;
      case 1:
        noStroke()
        blushFill = color(blushColor2);
        blushFill.setAlpha(blushAlpha - 50);
        fill(blushFill)
        ctx = canvas.getContext('2d');
        ctx.shadowColor = blushColor2;
        ctx.shadowBlur = 10;
        push()
        translate(-ghostWidth / 1.5 + (offset / 2), -ghostHeight / 2.7 + abs(offset / 5) + ghostWidth / 3.8)
        rotate(to_radians(95))
        rect(0, 0, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        rect(0, -wK / 2.1, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        rect(0, -wK / 4.2, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        pop()

        push()

        translate(ghostWidth / 3.5 + (offset / 2), -ghostHeight / 2.7 + abs(offset / 5) + ghostWidth / 3.8)
        rotate(to_radians(90))
        rect(0, 0, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        rect(0, -wK / 2.1, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        rect(0, -wK / 4.2, 1.5 * ghostWidth / 10, ghostWidth / 15, 5)
        pop()
        ctx.shadowBlur = 0
        break;
      case 2:

        push()
        noStroke()
        ctx = canvas.getContext('2d');
        ctx.shadowColor = blushColor3;
        ctx.shadowBlur = 10;

        blushFill = color(blushColor3);
        blushFill.setAlpha(50);
        fill(blushFill)
        ellipse(-ghostWidth / 1.8 + (offset / 2), -ghostHeight / 3 + abs(offset / 5) + ghostWidth / 3.8, ghostWidth / 6, ghostWidth / 6);
        ellipse(ghostWidth / 3.5 + (offset / 2), -ghostHeight / 3 + abs(offset / 5) + ghostWidth / 3.8, ghostWidth / 6, ghostWidth / 6);
        pop()
        ctx.shadowBlur = 0

        break;
    }
  }


  noFill();
  stroke(40)
  strokeWeight(3)

  //mouth
  switch (mouthType) {
    case 0:
      curveBetween(-ghostWidth / 4.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5), -ghostWidth / 4 + (offset / 2) + ghostWidth / 5.5, -ghostHeight / 4.5 + abs(offset / 5), 0.1, smileIntensity, 0)
      break;
    case 1:
      curveBetween(-ghostWidth / 4.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5), -ghostWidth / 4 + (offset / 2) + ghostWidth / 5.5, -ghostHeight / 4.5 + abs(offset / 5), 0.1, smileIntensity, 1)
      break;
    case 2:
      line(-ghostWidth / 4.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5), -ghostWidth / 4 + (offset / 2) + ghostWidth / 5.5, -ghostHeight / 4.5 + abs(offset / 5))
      break;
    case 3:
      push()
      curveBetween(-ghostWidth / 4.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5), -ghostWidth / 4 + (offset / 2) + ghostWidth / 5.5, -ghostHeight / 4.5 + abs(offset / 5), 0.1, 0.2, 0)
      fill("pink")
      strokeWeight(2)
      curveBetween(-ghostWidth / 4.5 + (offset / 2) + wK / 4, -ghostHeight / 4.5 + abs(offset / 5) + 3, -ghostWidth / 4 + (offset / 2) - wK / 4 + ghostWidth / 5.5, -ghostHeight / 4.5 + abs(offset / 5) + 3, 0.1, 0.9, 1)
      pop()
      break;
    case 4:
      lX = -ghostWidth / 4.5 + (offset / 2)
      lY = -ghostHeight / 4.5 + abs(offset / 5)
      rX = -ghostWidth / 4 + (offset / 2) + ghostWidth / 5.5

      push()
      strokeWeight(1.5)
      fill("white")
      curveBetween(lX - wK / 20, lY + 1.8, lX + wK / 6 - wK / 15, lY + 2.3, 0.9, 0.9, 0)
      curveBetween(rX - wK / 10, lY + 2.3, rX + wK / 20, lY + 1.8, 0.9, 0.9, 0)
      pop()
      strokeWeight(1.8)
      curveBetween(-ghostWidth / 3.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5), -ghostWidth / 4 + (offset / 2) + ghostWidth / 4, -ghostHeight / 4.5 + abs(offset / 5), 0.1, 0.1, 0)

      break;
    case 5:

      push()
      fill(0)
      translate(-ghostWidth / 1.9 + (offset / 2), -sK * 1.1 + abs(offset / 5))
      scale(wK / 230)

      beginShape()
      bezier(10, 180, 50, 250, 130, 110, 180, 200);
      bezier(180, 200, 230, 115, 320, 250, 360, 180);
      bezier(10, 180, 40, 210, 100, 280, 180, 200);
      bezier(180, 200, 210, 230, 265, 280, 360, 180);
      endShape()
      pop()
      break;

    case 6:

      push()
      noStroke()
      fill(40)
      translate(-ghostWidth / 8 + (offset / 2), -ghostHeight / 5 + abs(offset / 5))
      scale(ghostWidth / 80)
      beginShape()
      curveBetween(-15, -1, 15, -1, 0.1, 0.60, 0)
      fill('white')
      curveBetween(-14, 0, 14, 0, 0.05, 0.3, 0)
      endShape()
      pop()



      break;
    case 7:
      push()
      stroke(40)
      strokeWeight(3.5)
      translate(-ghostWidth / 5.5 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5))
      scale(max(ghostWidth / 150, 0.45))
      beginShape()
      curveBetween(-10, 0, 5, 0, 0.4, 0.5, 0)
      curveBetween(5, 0, 20, 0, 0.4, 0.5, 0)
      endShape()
      pop()
      break;
    case 8:
      push()
      stroke(40)
      strokeWeight(3.5)
      translate(-ghostWidth / 8 + (offset / 2), -ghostHeight / 4.5 + abs(offset / 5))
      scale(ghostWidth / 85)
      fill('white')
      beginShape()
      line(-15, -1, 15, -1)
      curveBetween(-15, -1, 15, -1, 0.1, 0.6, 0)
      endShape()
      strokeWeight(2)
      noFill()
      curveBetween(-13, 2, 13, 1.9, 0.1, 0.2, 0)
      pop()
      break;
    case 9:
      push()
      translate(-ghostWidth / 7 + (offset / 2), -ghostHeight / 3.5 + abs(offset / 5) + ghostWidth / 3.8)
      scale(max(ghostWidth / 250, 0.24))
      stroke(40)
      strokeWeight(20)
      beginShape()
      curveBetween(-15, -10, 15, -10, 0.3, 0.3, 1)
      curveBetween(-15, -10, 15, -10, 0.1, 1.0, 1)
      endShape()
      fill(chroma('red').darken(2).hex())
      noStroke()
      ellipse(0, -17, 20, 12)
      pop()
      break;

  }




  switch (apparelType) {
    case 1:

      push()
      let customGhostWidth = ghostWidth;
      if (ghostWidth < 50) {
        customGhostWidth = 50;
      }

      stroke(bowColor2)
      strokeWeight(3)
      strokeJoin(ROUND);
      fill(bowColor2)
      push()
      polygon(-customGhostWidth / 4 + (offset / 2), ghostHeight / 6 + abs(offset / 5) - hK / 15, customGhostWidth / 15, 3)
      translate(-customGhostWidth / 5.5 + (offset / 2) + customGhostWidth / 5.5, ghostHeight / 6 + abs(offset / 5) - hK / 15)
      rotate(-45)
      polygon(0, 0, customGhostWidth / 15, 3)
      pop()
      stroke(bowColor1)
      fill(bowColor1)
      if (bowType == 1) {
        ellipse(-customGhostWidth / 8 + (offset / 2), ghostHeight / 6 + abs(offset / 5) - hK / 15, customGhostWidth / 10, customGhostWidth / 10)
      }
      else {
        rectMode(CENTER)
        rect(-customGhostWidth / 8 + (offset / 2), ghostHeight / 6 + abs(offset / 5) - hK / 15, customGhostWidth / 10, customGhostWidth / 16, 1)
      }
      pop()
      break;
    case 2:

      noStroke()
      push()

      translate(-ghostWidth / 8 + (offset / 2), ghostHeight / 9 + abs(offset / 5))
      scale(sK / 30, sK / 30)
      fill(tieColor)
      beginShape()
      vertex(0, 0)
      vertex(-4, 0)
      vertex(-2, 5)

      vertex(-4, 35)
      vertex(0, 40)
      vertex(4, 35)

      vertex(2, 5)
      vertex(3.5, 0)
      vertex(0, 0)
      endShape()

      pop()
      break;
    default:
      break;
  }

  pop();

  pop();

  t += 0.1;

}

function trapezoid(x, y) {
  push()
  scale(0.08)
  noStroke();
  beginShape(QUADS);
  vertex(x - 0, y - 0);
  vertex(x + 150, y - 0);
  vertex(x + 400, y - 150);
  vertex(x - 200, y - 150);
  endShape();
  pop()
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function randPattern(t) {
  const ptArr = [
    PTN.stripe(t / int(random(6, 12))),
    PTN.stripeCircle(t / int(random(6, 12))),
    PTN.stripePolygon(int(random(3, 7)), int(random(6, 12))),
    PTN.stripeRadial(TAU / int(random(6, 30))),
    PTN.wave(t / int(random(1, 3)), t / int(random(10, 20)), t / 5, t / 10),
    PTN.dot(t / 10, t / 10 * random(0.2, 1)),
    PTN.checked(t / int(random(5, 20)), t / int(random(5, 20))),
    PTN.cross(t / int(random(10, 20)), t / int(random(20, 40))),
    PTN.triangle(t / int(random(5, 20)), t / int(random(5, 20)))
  ]
  return random(ptArr);
}


function createCols(url) {
  let slaIndex = url.lastIndexOf("/");
  let colStr = url.slice(slaIndex + 1);
  let colArr = colStr.split("-");
  for (let i = 0; i < colArr.length; i++)colArr[i] = "#" + colArr[i];
  return colArr;
}

function pgMask(_content, _mask) {
  var img = createImage(_mask.width, _mask.height);
  img.copy(_mask, 0, 0, _mask.width, _mask.height, 0, 0, _mask.width, _mask.height);
  img.loadPixels();
  for (var i = 0; i < img.pixels.length; i += 4) {
    var v = img.pixels[i];
    img.pixels[i] = 0;
    img.pixels[i + 1] = 0;
    img.pixels[i + 2] = 0;
    img.pixels[i + 3] = v;
  }
  img.updatePixels();
  var contentImg = createImage(_content.width, _content.height);
  contentImg.copy(_content, 0, 0, _content.width, _content.height, 0, 0, _content.width, _content.height);
  contentImg.mask(img)
  return contentImg;
}

function keyPressed() {
  if (key === 's') {
    saveCanvas("art.png");
  }
}


features = [ntc.name(bgColor)[1], ntc.name(ghostDark)[1], mouthType, eyeType, apparelType, hasArms, hasBlush, ghostWidth, ghostHeight];

window.$fxhashFeatures = {
  bgColor: `${features[0]}`,
  ghostHue: `${features[1]}`,
  mouthType: `${features[2]}`,
  eyeType: `${features[3]}`,
  apparelType: `${features[4]}`,
  hasArms: `${features[5]}`,
  hasBlush: `${features[6]}`,
  ghostWidth: `${features[7]}`,
  ghostHeight: `${features[8]}`

}
