
let canvasSize;

let bgCnvs;

let img;

var imageHolder;

document.getElementById('imageInput').addEventListener('change', function(event) {
  if (event.target.files.length > 0) {
    let file = event.target.files[0];
    if (file.type.match('image.*')) {
      img = loadImage(URL.createObjectURL(file), function() {
        drawImage();
      });
    }
  }
});


function executeCanvasSave() {
  saveCanvas('art-' + getWindowsSafeTime() + '.jpg');
};

function setup() {

  var canvas = createCanvas(800, 600);
  canvas.parent('canvas_holder');
  background(255)
  

 // applyNoise();

}

function drawImage(){


   imageHolder = createGraphics(img.width, img.height);
  img.loadPixels(); 
for (let x = 0; x < img.width; x++) {
  let nonTransparentY = -1;
  for (let y = 0; y < img.height; y++) {
    const index = (x + y * img.width) * 4;
    if (img.pixels[index + 3] !== 0) { // If the pixel is not transparent
      nonTransparentY = y;
      break;
    }
  }
  if (nonTransparentY !== -1) {
    const index = (x + nonTransparentY * img.width) * 4;
    const r = img.pixels[index];
    const g = img.pixels[index + 1];
    const b = img.pixels[index + 2];
    for (let y = 0; y < img.height; y++) {
      
      const index = (x + y * img.width) * 4;
      if (img.pixels[index + 3] <= 200) {
      img.pixels[index] = r;
      img.pixels[index + 1] = g;
      img.pixels[index + 2] = b;
      img.pixels[index + 3] = 255; // Set the alpha value to opaque
      }
    }
  }
}
img.updatePixels(); // Update the image pixels
imageHolder.image(img, 0, 0, img.width, img.height);
resizeCanvas(img.width, img.height);
image(imageHolder, 0, 0)

}


function applyNoise() {

  let noiseCnvs = createGraphics(canvasSize, canvasSize)

  for (let x = canvasSize /10 ; x < noiseCnvs.width; x++) {
    for (let y = canvasSize / 10; y < noiseCnvs.height; y++) {
      let gray = cusrand(120, 200);
      noiseCnvs.set(x, y, color(gray));
    }
  }

  noiseCnvs.updatePixels();

  blendMode(OVERLAY)

  image(noiseCnvs, -canvasSize/20, -canvasSize/20)
}


function getWindowsSafeTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formattedTime = `${year}-${month}-${day}_${hours}${minutes}${seconds}`;

  return formattedTime;
}


Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}

function flip() {
  return Math.random() <= 0.5? -1 : 1;
}

function half(one, two) {
  if (one == undefined || two == undefined) {
    if (Math.random() < 0.5)
      return false;
    else
      return true;
  }
  else {
    if (Math.random() <= 0.5)
      return one;
    else
      return two;
  }
}

function cusrand(min, max, arr) {
  let result = Math.floor(Math.random() * (max - min + 1) + min);
  if (arr != undefined) {
    while (arr.includes(result)) {
      result = Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
  return result;
}
function floatrand(min, max) {
  return Math.random() * (max - min) + min;
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



