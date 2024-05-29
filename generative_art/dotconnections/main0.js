
function flip(){
  var c = fxrand();
  if (c < 0.5)
  return false;
  else
  return true;
}

function minmax(min, max){
  return Math.round(fxrand() * (max-min) + min);
}

function minmaxdouble(min, max){
  return fxrand() * (max-min) + min;
}

function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
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

function linearGradient(sX, sY, eX, eY, colorS, colorE){
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}




let X = [];
let Y = [];
let cX = [];
let cY = [];
let x;
let y;
let a;
let dotColors = [];
let lineColors = [];
let lines = [];
let shapes = [];
let data = [];
let bgHue = fxrand() < 0.09 ? minmax(0, 25) : minmax(100, 360);
let bgSat = minmax(30, 75);
let bgBri = minmax(23, 26);
let txtr;
let bg;
let accentHue = minmax(0, 360)
let clrs = [], clrs2 = [], clrs3 = [];
let lineN = 0;
let dotN = 0;
let lightHue = HSLToHex(bgHue, minmax(25, 35), minmax(85, 95));
let darkHue = HSLToHex(bgHue, minmax(50, 70), minmax(35, 45))
let lightAccent = HSLToHex(accentHue, minmax(25, 35), minmax(85, 95));
let darkAccent = HSLToHex(accentHue, minmax(50, 70), minmax(35, 45))
let cnvs;
let sizes = [minmax(15, 25), minmax(10, 20), minmax(8, 12)];


  function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  function checker(a , b){
    cX.forEach((item, i) => {
    if (cX[i] == a && cY[i] == b){
      return true;
    }
    });
    return false;
  }

function setup(){

clrs = chroma.scale([lightHue, darkHue]).mode('lch').colors(8);
clrs2 = chroma.scale([lightAccent, darkAccent]).mode('lch').colors(8);
clrs3 = clrs.concat(clrs2);

  noiseSeed(minmax(0, 1000));
  createCanvas(800, 800);
  cnvs = createGraphics(700, 700)
colorMode(HSB);
  smooth();
strokeWeight(3);
background(bgHue, bgSat, bgBri);
colorMode(RGB);

  txtr=createGraphics(width, height)
	txtr.loadPixels()
	for(var i=0;i<width;i++){
		for(var j=0;j<height;j++){
				txtr.set(i,j,color(100,noise(i/3,j/3,i*j/50)*minmax(0, 100)))
		}
	}
	txtr.updatePixels()

push()
blendMode(MULTIPLY)
image(txtr, 0, 0)
image(txtr, 0, 0)
image(txtr, 0, 0)
pop()

colorMode(HSB);
frameRate(60);

for (var i = 0; i <5000; i++){
   dotColors.push(clrs3[minmax(0, clrs3.length-1)])
  lineColors.push(clrs3[minmax(0, clrs3.length-1)])
  shapes.push(minmax(0,2));
}
  X = [floor(400)];
  Y = [floor(400)];
  cX = [floor(400)];
  cY = [floor(400)];


}


function draw(){
cnvs.stroke(0);
if(frameCount <= 90){

  	a = floor(minmaxdouble(0, X.length));




  x = floor(X[a] + 50 * cos(floor(minmaxdouble(0, 9))*(TAU/4)));
  y = floor(Y[a] + 50 * sin(floor(minmaxdouble(0, 9))*(TAU/4)));


  cnvs.stroke(lineColors[floor(x)]);

if(!lines.find((el) => abs(el[0] - floor(X[a])) <= 4 && abs(el[1] - floor(Y[a])) <= 4 && abs(el[2] - x) <= 4 && abs(el[3] - y) <= 4)){

  line(floor(X[a]), floor(Y[a]), x, y);


  cX = append(cX, floor(X[a]));
  cY = append(cY,floor( Y[a]))



  cX = append(cX, x);
  cY = append(cY, y);



lines.push([floor(X[a]), floor(Y[a]), x, y])

}
else{

}

X = append(X, x);
Y = append(Y, y);



x = floor(X[X.length - 1] + 50 * cos(floor(minmaxdouble(0, 8))*(TAU/4)));
y = floor(Y[Y.length - 1] + 50 * sin(floor(minmaxdouble(0, 8))*(TAU/4)));



  if(!lines.find((el) => abs(el[0] - floor(X[X.length - 1])) <= 4 && abs(el[1] - floor(Y[Y.length - 1])) <= 4 && abs(el[2] - x) <= 4 && abs(el[3] - y)<=4)){

    line(floor(X[X.length - 1]), floor(Y[Y.length - 1]), x, y);


      cX = append(cX, floor(X[X.length - 1]));
      cY = append(cY, floor(Y[Y.length - 1]))



      cX = append(cX, x);
      cY = append(cY, y);
lines.push([floor(X[X.length - 1]), floor(Y[Y.length - 1]), x, y])
}



lineN += 2;


dotN = 0;
  for(var points = 0; points < cX.length; points++){

    let indx = data.findIndex((el) => abs(el[0] - floor(cX[points])) <= 5 && abs(el[1] - floor(cY[points])) <= 5);
    if (indx == -1){
      data.push([floor(cX[points]), floor(cY[points])]);
      indx = data.length-1;

      fill(dotColors[indx])
      cnvs.stroke(dotColors[indx+1])
      if (shapes[indx] == 0){
        ellipse(floor(cX[points]), floor(cY[points]), sizes[0], sizes[0]);

      }
      else if (shapes[indx] == 1)
  {    rectMode(CENTER);
      rect(floor(cX[points]), floor(cY[points]), sizes[1], sizes[1])
    }
      else if(shapes[indx] == 2){

        polygon(floor(cX[points]), floor(cY[points]), sizes[2], 6)
      }

    }
    else{
      let indx2 = data.findIndex((el) => abs(el[0] - floor(cX[points])) == 0 && abs(el[1] - floor(cY[points])) == 0);
      if (indx2 != -1){
        fill(dotColors[indx])
        stroke(dotColors[indx+1])
        if (shapes[indx] == 0){
          ellipse(floor(cX[points]), floor(cY[points]), sizes[0], sizes[0]);

        }
        else if (shapes[indx] == 1)
    {    rectMode(CENTER);
        rect(floor(cX[points]), floor(cY[points]), sizes[1], sizes[1])
      }
        else if(shapes[indx] == 2){

          polygon(floor(cX[points]), floor(cY[points]), sizes[2], 6)
        }

    }

}




dotN += 1;



  }


}


}


function keyPressed() {
  if (key === 's') {
    saveCanvas("CIRCUIT.png");
 }
}


features = [ntc.name(HSLToHex(bgHue, bgSat, bgBri))[1], ntc.name(lightHue)[1], ntc.name(darkHue)[1], ntc.name(lightAccent)[1], ntc.name(darkAccent)[1]];

window.$fxhashFeatures = {
  bgColor: `${features[0]}`,
color1: `${features[1]}`,
color2: `${features[2]}`,
color3: `${features[3]}`,
color4: `${features[4]}`
}
