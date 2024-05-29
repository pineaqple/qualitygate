

console.log("Algo credits: arsenijesavic & Jackie Wang.");
console.log("Made by @p1neaqp1e.");

function coin(){
  var c = fxrand();
  if (c < 0.5)
  return false;
  else
  return true;
}

function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

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

const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

function minmax(min, max){
  return Math.round(fxrand() * (max-min) + min);
}

function minmaxdouble(min, max){
  return fxrand() * (max-min) + min;
}


function linearGradient(sX, sY, eX, eY, colorS, colorE){
  let gradient = drawingContext.createLinearGradient(
    sX, sY, eX, eY
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}


let canvasH = window.innerHeight;
let canvasW = window.innerWidth;

var Y_AXIS = 1;
var X_AXIS = 2;
var c1, c2;

var crackAgent= [];
var crackPath= [];
var agentNum,pathNum;
var speed;
var switchColors = coin();
var crackN = minmax(2, 5);
var m = [];
var sound1;

function preload(){
sound1 = createAudio('./long.mp3');

}

function setup()
{
  sound1.volume(0.5);
  noiseSeed(minmax(0, 10000))
  createCanvas(canvasW+8, canvasH+8);
  background(255);


  frameRate(60);

  let w = HSLToRGB(190,minmax(40, 80), minmax(85, 90));
  let b = HSLToRGB(minmax(170, 200), 70, minmax(40, 65));
  c1 = color(w[0], w[1], w[2]);
  c2 = color(b[0], b[1], b[2]);



let sX, sY, eX, eY;

switch(minmax(0,1)){
  case 0:
  sX = 0;
  sY = minmax(0, height)
  eX = width;
  eY = height - sY;
  break;
  case 1:
  sX = minmax(0, width);
  sY = 0;
  eX = width - sX;
  eY = height;
  break;
}

push();
angleMode(DEGREES);

if (switchColors){
linearGradient(
  sX, sY,
   eX, eY,
   c1,
   c2,
 );
}
else{
  linearGradient(
    sX, sY,
     eX, eY,
     c2,
     c1,
   );
}

  rect(-4, -4, width+4, height+4);
pop();



angleMode(RADIANS);

  strokeCap(PROJECT);

  agentNum=0;
  pathNum=0;
  speed= 2.5;



  for (var i = 0; i < 300; i++) {
     m[i] = new Mover(minmaxdouble(-4, width+4), minmaxdouble(-4, height+4));
   }



}

let counter = 4;
let firstTime = true;






function draw()
{


  if (counter >= 0){
    counter--;
  for (var i = 0; i < m.length - 1; i++) {

    m[i].move();
    m[i].show();
blendMode(ADD)
    stroke(255, 255, 255, 1);



    line(m[i].position.x, m[i].position.y, m[i + 1].position.x, m[i + 1].position.y);
  }
	}

blendMode(BLEND)

if (firstTime && frameCount >= 120){
for(var i = 0; i < crackN; i++){
   createPath(width*(0.5+0.3*minmaxdouble(-1.0,1.0)),height*(0.5+0.3*minmaxdouble(-1.0,1.0)));
   sound1.play();
//   setTimeout(startLoop, 4100);
}
firstTime = false;
}



  pathDevelop();
  deepenCrack();

}

function createAgent(x,y)
{
  let angle= HALF_PI;
  let index=-1;
  for(let i=0; i<agentNum; i++)
    if(!crackAgent[i].alive)
    {
      index= i;
      break;
    }
  if(index == -1) index= agentNum++;
  crackAgent[index]= new Agent(x,y,minmax(2,3),angle,1,true);
}

function createPath(x,y)
{
  let angle= minmaxdouble(0, TWO_PI);
  crackPath[pathNum++]= new Path(x,y,angle,speed,true);
  crackPath[pathNum++]= new Path(x,y,angle+PI*2/3+minmaxdouble(-0.3,0.3),speed,true);
  crackPath[pathNum++]= new Path(x,y,angle-PI*2/3+minmaxdouble(-0.3,0.3),speed,true);

}

function pathDevelop()
{
  let alives = [];
  for(let i=0; i<pathNum; i++)
    if(crackPath[i].alive){
      alives.push(i);
if (crackPath[i].x < 0 || crackPath[i].x > width || crackPath[i].y < 0 || crackPath[i].y > height){
  crackPath[i].alive = false;

}
      if(minmaxdouble(0, 1.0) > 0.0009)
      {
        createAgent(crackPath[i].x,crackPath[i].y);
        let tempX= crackPath[i].x +  crackPath[i].spd*cos(crackPath[i].dir);
        let tempY= crackPath[i].y +  crackPath[i].spd*sin(crackPath[i].dir);
				let c = get(tempX,tempY);
	let c1 = get(crackPath[i].x, crackPath[i].y);
				if(tempX<0 || tempX>width || tempY<0 || tempY>height-60 || c[0] > 20 || c1[0] > 20)
				{
          stroke(c[0]+40, c[1]+40, c[2]+40);
          strokeWeight(0.3  +2*noise(tempX*8/width,tempY*8/height));
          line(tempX,tempY,crackPath[i].x,crackPath[i].y);
					crackPath[i].x= tempX;
					crackPath[i].y= tempY;
          crackPath[i].dir+= minmaxdouble(-0.08,0.08);
				}
        else {
          crackPath[i].alive= false;}
      }
      else
      {
        let dirChange= QUARTER_PI+minmaxdouble(-0.15,0.15);
        crackPath[i].dir+= dirChange;
        crackPath[pathNum++]= new Path(crackPath[i].x,crackPath[i].y,crackPath[i].dir-dirChange,crackPath[i].spd,true);
      }

    }


if (alives.length == 0){
  sound1.stop();
}

}

function deepenCrack()
{
  for(let i=0; i<agentNum; i++)
    if(crackAgent[i].alive)
    {
      crackAgent[i].display();
      crackAgent[i].update();
    }


}


class Agent
{
  constructor(x,y,r,dir,spd,alive)
  {
    this.x= x;
    this.y= y;
    this.r= r;
    this.dir= dir;
    this.spd= spd;
    this.alive= alive;
    this.factor= 0;
    this.alp= minmax(50,100);
  }

  update()
  {
    this.x+= this.spd*cos(this.dir);
    this.y+= this.spd*sin(this.dir);

    this.dir= HALF_PI;
    this.r*= 0.98;
    this.alp*= 0.98;
    this.factor+= 0.05;

    if(this.r<0.1 || this.alp<0.1 || this.x < 0 || this.x > width || this.y < 0 || this.y > height)
      this.alive= false;

  }

  display()
  {
    noStroke();

  let p = get(this.x, this.y)
  if (p[0] > 20){
  fill(p[0]+50, p[1]+50, p[2]+50, this.alp);
    circle(this.x,this.y,this.r);
}

  }
}

class Path
{
  constructor(x,y,dir,spd,alive)
  {
    this.x= x;
    this.y= y;
    this.dir= dir;
    this.spd= spd;
    this.alive= alive;
  }
}


function Mover (x, y) {
  this.position = createVector(x, y);
  this.velocity = createVector(0.01, 0.1);
  this.acceleration = createVector(0, 0);
  this.mass = 0.11;

  this.applyForce = function(force) {
    var f = p5.Vector.div(force,this.mass);
    this.acceleration.add(f);
  };

  this.move = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  this.show = function() {

    noStroke();
    fill(255);
  };

  this.checkEdges = function() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  };
};
