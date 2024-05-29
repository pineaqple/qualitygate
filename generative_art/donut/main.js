function coin(){
  var c = fxrand();
  if (c < 0.5)
  return false;
  else
  return true;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(clr) {
  return "#" + componentToHex(clr[0]) + componentToHex(clr[1]) + componentToHex(clr[2]);
}


const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};


function minmax(min, max){
  return Math.round(fxrand() * (max-min) + min);
}

function minmaxdouble(min, max){
  return fxrand() * (max-min) + min;
}

let scl = 3;
let decoration = [];
let angle = 0;
let angs = [];
let d = 50;
let candyN  = minmax(90, 230);
let nLayers = 1;
let txtr;
let koef = [];
let decorType = minmax(0,4);
let hue = [];
let multyC = fxrand() < 0.3 ? true : false;
let dHUE = minmax(0, 360);
let ellipseData = [minmax(13, 20), minmax(13, 20), minmax(13, 25), minmax(13, 25), -25, 25, 0, 35];
let dir = coin();
let clrs = [minmax(0, 360), minmax(0, 360)];

function setup() {

	createCanvas(800, 800, WEBGL);

frameRate(30);

  txtr = createGraphics(100 * scl, 100 * scl, WEBGL);
	txtr.colorMode(HSB);
  txtr.background(29, minmax(45, 75), 90);
  txtr.strokeWeight(0.5);


  for(var x = -300; x < 300; x++){
    for (var y = -300; y < 300; y++){
        txtr.stroke(29, minmax(45, 75), 70);
      if(fxrand() < 0.1){
          txtr.point(x, y);
      }
    }
  }


let initialB = minmax(75, 90);
let donSat = minmax(35, 60);

  txtr.noStroke();
  txtr.fill(dHUE, donSat, initialB - 20);
  txtr.rect(-50 * scl, 49.5*scl, 100*scl, 50*scl);
  txtr.ellipse(ellipseData[6]*scl, 55*scl, 30*scl, (ellipseData[0]+1.5)*scl);
  txtr.ellipse(ellipseData[7]*scl, 55*scl, 30*scl, (ellipseData[1]+1.5)*scl);
  txtr.ellipse(ellipseData[4]*scl, 55*scl, 30*scl, (ellipseData[2]+1.5)*scl);
  txtr.ellipse(ellipseData[5]*scl, 55*scl, 30*scl, (ellipseData[3]+1.5)*scl);
  txtr.fill(dHUE, donSat, initialB);
  txtr.rect(-50 * scl, -50 *scl, 100*scl, 50*scl);
	txtr.ellipse(ellipseData[6]*scl, 55*scl, 30*scl, ellipseData[0]*scl);
	txtr.ellipse(ellipseData[7]*scl, 55*scl, 30*scl, ellipseData[1]*scl);
	txtr.ellipse(ellipseData[4]*scl, 55*scl, 30*scl, ellipseData[2]*scl);
	txtr.ellipse(ellipseData[5]*scl, 55*scl, 30*scl, ellipseData[3]*scl);


  for (let i=0; i < candyN; i++) {
  hue.push(minmax(0, 360));
  let decorData = {
    sphere: [minmax(2,4)],
    cylinder: [minmaxdouble(2, 3), minmax(5,10)],
    cone: [minmax(3,4), minmax(10, 15)],
    box: [minmax(3,4 ), minmax(8, 14)],
    torus: [2, 3],
    color: coin() ? clrs[0] : clrs[1],
    bright: minmax(80, 100),
    sat: minmax(55, 75)
  }
  decoration.push(decorData);
  angs.push(createVector(minmaxdouble(0, TWO_PI), minmaxdouble(0, TWO_PI), minmaxdouble(0, TWO_PI)));
  koef.push(minmaxdouble(0, PI));
}


}


let bgType = minmax(0, 1);
let stripeHue = minmax(0, 360);
let diff = (20, 150);
let stripe2 = stripeHue - diff < 0 ? stripeHue + minmax(20, diff) : stripeHue - minmax(20, diff);
let stk1 = minmax(5, 15);
let stk2 = minmax(15, 25);
let r1 = minmax(10, 20);
let r2 = minmax(30, 40);
let r = 30;




function draw() {

if (angle > TWO_PI){
  angle = 0;
}

let zzz = -100*scl;
  background(241, 250, 238);


if (bgType === 0){
  for (let i = 0; i <= height*2; i += 60) {
    push()
    translate(-width, -height);
    strokeWeight(stk1);
    colorMode(HSB)
    fill(stripeHue, 40, 80)
    stroke(stripeHue, 50, 90);
    line(0, i, zzz, width*2, i, zzz);
      strokeWeight(stk2);
      fill(stripe2, 56, 52);
    stroke(stripe2, 56, 52);
    line(0, i + 30, zzz, width*2,  i + 30, zzz);
    pop()
  }
}
else if (bgType === 1){


  for(var i=60; i>0 ;i--){
    push()
      colorMode(HSB)
    translate (0, 0, zzz);

    if(i%2==0 || i < 5){
          fill(105, 5, 98);
      ellipse(0,0,r*i,r*i, 200);
    }
    else if (i%3 == 0){
        fill(stripeHue, 50, 60);
        ellipse(0,0,r*i,r*i, 200);
    }
    else{
      fill(stripe2, 50, 60);
      ellipse(0,0,r*i,r*i, 200);
    }
    noFill();
    pop()
  }
}




	ambientLight (255-d, 255-d, 255-d)
	pointLight(128, 128, 128, 0, 400, 0);
	pointLight(128, 128, 128, 0, -400, 0);



	rotateX(angle);
	//rotateY(angle);
  if (dir){
	rotateZ(angle);
}
else {
  	rotateZ(-angle);
}

	texture(txtr);

	noStroke();

	torus(100,50, 40, 40);

  let ring = 100;
  let cyl = 50;


  for (let i=0; i<candyN; i++) {
  		push();
      	colorMode(HSB);
  		translate((ring+cyl*cos(koef[i]))*cos(TWO_PI*i/candyN), (ring+cyl*cos(koef[i]))*sin(TWO_PI*i/candyN), cyl*sin(koef[i]));
  		rotateX(angs[i].x);
  		rotateY(angs[i].y);
  		rotateZ(angs[i].z);
      if(multyC){
  		fill(hue[i], 55, 100);
      }
      else{
        fill(decoration[i].color, decoration[i].sat, decoration[i].bright);
      }

switch(decorType){
  case 0:
  torus(decoration[i].torus[0], decoration[i].torus[1], 3, 12);
  break;
  case 1:
  sphere(decoration[i].sphere[0]);
  break;
  case 2:
  cylinder(decoration[i].cylinder[0], decoration[i].cylinder[1]);
  break;
  case 3:
  cone(decoration[i].cone[0], decoration[i].cone[1]/2);
  break;
  case 4:
  box(decoration[i].box[0], decoration[i].box[1]/2)
  break;
}

  		pop();

  	}
    	colorMode(RGB);


if (angle < HALF_PI - PI/4 || angle > TWO_PI - PI/4){
	angle += 0.013;
}
else {
  	angle += 0.02;
}
}

let features;
if (!multyC){
features = [bgType, ntc.name(rgbToHex(HSLToRGB(stripeHue, 80, 90)))[1], ntc.name(rgbToHex(HSLToRGB(stripe2, 80, 90)))[1], ntc.name(rgbToHex(HSLToRGB(dHUE, 80, 80)))[1], ntc.name(rgbToHex(HSLToRGB(clrs[0], 80, 90)))[1], ntc.name(rgbToHex(HSLToRGB(clrs[1], 80, 90)))[1], decorType, candyN, false];
}
else {
  features = [bgType, ntc.name(rgbToHex(HSLToRGB(stripeHue, 80, 90)))[1], ntc.name(rgbToHex(HSLToRGB(stripe2, 80, 90)))[1], ntc.name(rgbToHex(HSLToRGB(dHUE, 80, 80)))[1], "none", "none", decorType, candyN, true];
}
window.$fxhashFeatures = {
    bgType: `${features[0]}`,
bgColor1: `${features[1]}`,
bgColor2: `${features[2]}`,
donutColor: `${features[3]}`,
decorColor1: `${features[4]}`,
decorColor2:`${features[5]}`,
decorType: `Type ${features[6]}`,
decorCount: `${features[7]} pieces`,
multicolored: `${features[8]}`

};
