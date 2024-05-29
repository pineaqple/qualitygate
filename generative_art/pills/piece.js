

const cS = Math.min(window.innerWidth, window.innerHeight);

let mode = fxrand() >= 0.2;
let bgClr = [];
let special = fxrand() <= 0.017 ? true : false;
let bgMode = "";
let colorChoice = fxrand();
bgClr = mode? [cusrand(0, 360), 50, 70]:[cusrand(0, 360), 40, 5];
let fills = ["none", "hachure", "zigzag", "cross-hatch", "dashed", "zigzag-line", "solid"]
let squareType = cusrand(0, 6);
let rare = fxrand() <= 0.2 ? true : false;
let accent1 = "white", accent2 = "black";
let accent_temp1 = accent1, accent_temp2 = accent2;
var shadowOn = true; 
offsY = 85;

pillSprites = [];

let fixed = 1000;
const cH = 37;

function setup() {


  if (/Mobi|Android/i.test(navigator.userAgent)) {
    shadowOn = false;
  }'  '

  cnvs =  new Canvas(fixed, fixed);

  base = createGraphics(fixed, fixed);

  randomSeed(fxrand() * 99999);
  noiseSeed(fxrand() * 99999);                                     
  base.colorMode(HSL, 360, 100, 100);
  base.background(bgClr[0], bgClr[1], bgClr[2]);
  base.stroke(bgClr[0], bgClr[1]-20, bgClr[2]+27);
  base.fill(bgClr[0], bgClr[1]-10, bgClr[2]+20)
  let counter = 0;
  for (let i = 0; i < fixed; i += 6) {
    for (let j = 0; j < fixed; j += 3) {
      base.ellipse(counter % 2 == 0 ? i : i + 3, j, random(3, 5));
      counter++;
    }
  }




  graphics = createGraphics(fixed, fixed);



 box = createGraphics(fixed, fixed)
capCnvs = createGraphics(350, 50)
capRough = rough.canvas(capCnvs.elt)
capClr = clrs.random()

capRough.curve([[20, cH], [5, cH], [5, 15], [5, 5], [20, 5], [110, 5], [260, 5],[300, 5], [310, 5], [310, 15], [310, cH], [300, cH],[270, cH], [250, cH], [20, cH]], {strokeWidth:3, stroke:!mode?"white":"black", fillStyle:"hachure", fill:capClr, hachureGap: 5, 
hachureAngle:0})
let boxRough = rough.canvas(box.elt)

boxRough.curve([[360, 366], [360, 383], [342, 404], [313, 460], [313, 600], [313, 806], [360, 842], [500, 855], [633, 842], [686, 806], [686, 600], [686, 460], [ 656,404], [633, 383], [633, 366]], {strokeWidth:3, stroke:!mode?"white":"black"})

boxRough.curve([[360, 366], [633, 366]] , {strokeWidth:3, stroke:!mode?"white":"black"})

world.gravity.y = 5;
world.allowSleeping = true;


if (shadowOn){
shadow = createGraphics(fixed, fixed)
let shadowRough = rough.canvas(shadow.elt)
shadowRough.curve([[650, 840],[500, 855], [335, 835], [310, 850], [340, 870], [510, 890], [670, 870], [690, 850], [680, 830]], {fill:"black", fillStyle:"solid"})
shadow.filter(BLUR, 10)
push()
box.tint(255, 45);
box.image(shadow, 0, 0)
pop()
}


//#region colliders

left0 = new Sprite(360, 374-offsY, 5, 15, "static")
left0.visible = false;
left1 = new Sprite(335, 410-offsY, 5, 80, "static")
left1.rotation = 37;
left1.visible = false;
left2 = new Sprite(313, 640-offsY, 5, 400, "static")
left2.visible = false;
left3 = new Sprite(330, 835-offsY, 4, 40, "static")
left3.rotation = - 60;
left3.visible = false;
left4 = new Sprite(430, 852-offsY, 5, 180, "static")
left4.rotation = - 86;
left4.visible = false;

right0 = new Sprite(360+272, 375-offsY, 5, 15, "static")
right0.visible = false;
right1 = new Sprite(334+325, 410-offsY, 5, 80, "static")
right1.rotation = -40;
right1.visible = false;
right2 = new Sprite(313+375, 640-offsY, 5, 400, "static")
right2.visible = false;
right3 = new Sprite(330+340, 835-offsY, 4, 40, "static")
right3.rotation = 50;
right3.visible = false;
right4 = new Sprite(430+180, 847-offsY, 5, 180, "static")
right4.rotation = 83;
right4.visible = false;
//#endregion


}

fills = {
  "hachure":[6],
  "cross-hatch":[6],
  "zigzag":[6],
  "dots":[5],
  "dashed":[4],
  "zigzag-line":[3]
}


style = cusrand(0, 2)

pCount = 0;
screwCount = 0;
hues = []
for (let i = 0; i < 50; i++) {
  let hue = cusrand(0, 360)
  hues.push([mode?HSLToHex(hue, cusrand(60, 80), cusrand(50, 60)): HSLToHex(hue, cusrand(70, 90), cusrand(80, 95)), mode?HSLToHex(hue, cusrand(40, 50), cusrand(40, 50)): HSLToHex(hue, cusrand(60, 80), cusrand(50, 80))])
}

clr1 = cusrand(0, 360)
p_fill = HSLToHex(clr1, 70, 50);
clr2 = cusrand(0, 360)
p2_fill = HSLToHex(clr2, 70, 50)
p_d_fill = HSLToHex(clr1, 80, 30)

switch(style){
  case 0:
    let lightHue = mode? HSLToHex(clr1, cusrand(60, 80), cusrand(50, 60)) : HSLToHex(clr1, cusrand(70, 90), cusrand(70, 80));
 let darkHue = mode? HSLToHex(clr1, cusrand(40, 50), cusrand(40, 50)): HSLToHex(clr1, cusrand(60, 80), cusrand(50, 60));
 clrs = chroma.scale([lightHue, darkHue]).mode('lch').colors(8);
    break;
    case 1:
clrs = chroma.scale([hues[0][0], hues[1][1]]).mode('lch').colors(6);
      break;
case 2:
  let clrs1 = chroma.scale([hues[0][0], hues[1][1]]).mode('lch').colors(4);
  let clrs2 = chroma.scale([hues[2][0], hues[3][1]]).mode('lch').colors(4);
  clrs = clrs1.concat(clrs2);
  break;
}


 
capDown = false;
function draw() {
	clear();
image(base, 0, 0)
image(box, 0, -offsY)


p_style = ["cross-hatch", "zigzag", "hachure", "dashed", "zigzag-line" ].random()

p2_style = ["cross-hatch", "zigzag", "hachure", "dashed", "zigzag-line"].random()

pY = 100;

if (pCount <= 42 && frameCount % 10 == 0){

pillType = cusrand(0,2)
switch(pillType){
  case 0:
    pc0 = createGraphics(100, 115);
    pillRoug0 = rough.canvas(pc0.elt);
  pw = 25
  ph = 80
  
  p_seed = cusrand(0, 99999)

  let clr_1 = clrs.random()
  let clrs_temp = [...clrs].filter(function(e) { return e !== clr_1 })

  pillRoug0.curve([[pc0.width/2-25, pc0.height/2], [pc0.width/2-25, pc0.height/2-20], [pc0.width/2-25, pc0.height/2-40], [pc0.width/2-15, pc0.height/2-50], [pc0.width/2, pc0.height/2-55], [pc0.width/2+15, pc0.height/2-50], [pc0.width/2+25, pc0.height/2-40], [pc0.width/2+25, pc0.height/2-20], [pc0.width/2+25, pc0.height/2]], 
  {fill:clr_1, fillStyle:p_style, strokeWidth:3, hachureGap:fills[p_style][0], fillWeight:0.9, roughness:0.7, seed:p_seed, stroke:!mode?"white":"black"})
  
  pillRoug0.curve([[pc0.width/2-25, pc0.height/2], [pc0.width/2-25, pc0.height/2+20], [pc0.width/2-25, pc0.height/2+40], [pc0.width/2-15, pc0.height/2+50], [pc0.width/2, pc0.height/2+55], [pc0.width/2+15, pc0.height/2+50], [pc0.width/2+25, pc0.height/2+40], [pc0.width/2+25, pc0.height/2+20], [pc0.width/2+25, pc0.height/2]], 
    {fill:clrs_temp.random(), fillStyle:p2_style, strokeWidth:3, hachureGap:fills[p2_style][0], fillWeight:0.9, roughness:0.7, seed:p_seed, stroke:!mode?"white":"black"})
  
    pillRoug0.line(pc0.width/2-25, pc0.height/2, pc0.width/2+25, pc0.height/2, {seed:p_seed, strokeWidth:3, stroke:!mode?"white":"black"})
  
  
      pill = new Sprite();
      pill.x =   cnvs.width/2;
      pill.y = -pY;
      pill.width = pw*2
      pill.height = ph*1.3
      pill.img = pc0.get();
      pill.friction = 0.1;
      pill.scale = 0.7
      pillSprites.push(pill)
      //pill.debug = true;
  break;
  case 1:

  pc1 = createGraphics(100, 200);
  pillRoug1 = rough.canvas(pc1.elt);


pw1 = 25
ph1 = 80



p_seed = cusrand(0, 99999)


pillRoug1.curve([[pc1.width/2-25, pc1.height/2], [pc1.width/2-25, pc1.height/2-20], [pc1.width/2-25, pc1.height/2-40], [pc1.width/2-15, pc1.height/2-50], [pc1.width/2, pc1.height/2-55], [pc1.width/2+15, pc1.height/2-50], [pc1.width/2+25, pc1.height/2-40], [pc1.width/2+25, pc1.height/2-20], [pc1.width/2+25, pc1.height/2], 
[pc1.width/2+25, pc1.height/2],
[pc1.width/2+25, pc1.height/2+20],
[pc1.width/2+25, pc1.height/2+40],
[pc1.width/2+15, pc1.height/2+50],
[pc1.width/2, pc1.height/2+55],
[pc1.width/2-15, pc1.height/2+50],
[pc1.width/2-25, pc1.height/2+40],
[pc1.width/2-25, pc1.height/2+20],
[pc1.width/2-25, pc1.height/2]], 
{fill:clrs.random(), fillStyle:p_style, strokeWidth:3, hachureGap:fills[p_style][0], fillWeight:0.9, roughness:0.7, seed:p_seed, stroke:!mode?"white":"black"})

pillRoug1.line(pc1.width/2-15, pc1.height/2, pc1.width/2+15, pc1.height/2, {seed:p_seed, strokeWidth:3, roughness:2, stroke:!mode?"white":"black"})



  pill = new Sprite();
  pill.x =   cnvs.width/2;
  pill.y = -pY;
  pill.width = pw1*2
  pill.height = ph1*1.3
  pill.img = pc1.get();
  pill.friction = 0.1;
  pill.scale = 0.7
  pillSprites.push(pill)
break;

case 2:

pc2 = createGraphics(85, 85);
pillRoug2 = rough.canvas(pc2.elt);


pw2 = 80
ph2 = 60



p_seed = cusrand(0, 99999)


pillRoug2.circle(pc2.width/2, pc2.height/2, pw2,
{fill:clrs.random(), fillStyle:p_style, strokeWidth:3, hachureGap:fills[p_style][0], fillWeight:0.9, roughness:0.7, seed:p_seed, stroke:!mode?"white":"black"})

pillRoug2.line(pc2.width/2-25, pc2.height/2, pc2.width/2+25, pc2.height/2, {seed:p_seed, strokeWidth:3, roughness:2, stroke:!mode?"white":"black"})


pill = new Sprite();
pill.r = 60;
pill.x =   cnvs.width/2;
pill.y = -pY;
pill.img = pc2.get();
pill.friction = 0.1;
pill.scale = 0.7
pill.debug = false;
pillSprites.push(pill)
break;

}
pCount++;
}

else if (pCount >= 42 && frameCount % 10 == 0 && capDown == false){
  
  pCount++;

  if (pCount >= 60){
  capDown = true;
  cap = new Sprite()
  cap.x =   cnvs.width/2+11;
  cap.y = -pY;
  cap.width = 350
  cap.height = 25
  cap.img = capCnvs.get();
  cap.friction = 0.1;
  cap.debug = false;
}

}

else if (capDown == true && frameCount % 5 == 0){
  if (cap.y >= -30){
    world.gravity.y = 1;
  }


if (cap.y >= 267 && screwCount <= 25){

  capCnvs.clear()
  capRough.curve([[20, cH], [5, cH], [5, 15], [5, 5], [20, 5], [110, 5], [260, 5],[300, 5], [310, 5], [310, 15], [310, cH], [300, cH],[270, cH], [250, cH], [20, cH]], {strokeWidth:3, stroke:!mode?"white":"black", fillStyle:"hachure", fill:capClr, hachureGap: 5, 
  hachureAngle:0})
cap.img = capCnvs.get()

screwCount++;


}

}

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


// features = [ntc.name(bgClr)[1], colorNum, bgMode, filled, fill_tres, special];

// $fx.features ({
//   background: `${features[0]}`,
//   number_colors: `${features[1]}`,
//   mode: `${features[2]}`,
//   filled: `${features[3]}`,
//   fill_tres: `${features[3] ? features[4] : "none"}`,
//   SPECIAL: `${features[5] ? "Yes" : "No"}`
// });

// function keyPressed() {
//   if (key === 'd') {
//      saveCanvas("lineamenta.png");
//   }
//  }


