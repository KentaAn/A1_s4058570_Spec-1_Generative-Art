/*
* Assignment 1
* Theme: SDG 14 - Life Below Water (Coral Reef Protection)
* Citation: DANH ANH (2016) Thu Minh dọn rác ở biển cùng bạn trẻ, TUOI TRE ONLINE, https://tuoitre.vn/thu-minh-don-rac-o-bien-cung-ban-tre-1103071.htm?fbclid=IwY2xjawQuMzVleHRuA2FlbQIxMABicmlkETFwVlVYTlY0elI4NGxmRDVUc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHu8JmhdebjIkNAJTbUCtmgm3VZEGpe7wwcw_65B-gQ0G7tcKA631WkFaPW3V_aem__07IRWrzwIsPyotP6fuVBQ, accessed 25 March 2026.
* Concept: "The Biological Vault" - Branching DNA Corals
* License: Released under the GNU General Public License v3.0 (GPL-3.0)
*/

// --- GLOBAL VARIABLES & DATA SETS ---
let healthyData = ['A', 'C', 'T', 'G', '∑', '∞', '∆', '$'];
let corruptedData = ['0', '1', 'X', '-', '_', '/', '\\', 'N', 'U', 'L'];
let healthyPalette = ['#00FFCC', '#00BFFF', '#FF00FF', '#FFD700'];
let glitchPalette = ['#FF0033', '#444444', '#777777'];
let callToAction = "ERROR: DATA BREACH\nDON'T TOUCH CORAL REEFS!";

let spacing = 16;
let dataNodes = [];
let pillars = [];

// --- MAIN P5.JS FUNCTIONS ---

function setup() {
  let canvas = createCanvas(1920, 1080);
  canvas.parent('p5-container');

  textFont('monospace');
  initPillars();
  generateDataNodes();
}

function draw() {
  background(4, 14, 32);
  textAlign(CENTER, CENTER);
  updateAndDrawNodes();
  drawScannerBox();
  drawWarningLabel();
}

// --- SETUP HELPER FUNCTIONS ---
/* AI CITATION: The following setup functions were refactored with the assistance of Gemini AI to ensure compliance with the "< 15 lines per function".*/

function initPillars() {
  // Define 5 X positions as percentages of the screen width (15%, 32%, 50%, 68%, 85%)
  // Using percentages ensures the corals are evenly spaced regardless of canvas size.
  let xPositions = [0.15, 0.32, 0.50, 0.68, 0.85];

  // Loop exactly 5 times to create 5 coral pillars
  for (let i = 0; i < 5; i++) {
    // 1. Create the base shape (main trunk) at the corresponding X position
    let pillar = createPillarBase(xPositions[i]);
    // 2. Call the function to grow branches attached to this specific trunk
    addBranchesToPillar(pillar);
    // 3. Store the entire coral object into the global pillars[] array
    pillars.push(pillar);
  }
}

function createPillarBase(xPos) {
  // Returns an Object containing the "blueprint" of the main trunk
  return {
    x: xPos,                      // The central X-axis of the trunk
    top: random(0.1, 0.5),        // The peak of the coral (starts randomly between 10% to 50% of screen height)
    widthMult: random(60, 120),   // The amplitude of the bulge (prevents the trunk from being a straight cylinder)
    baseWidth: random(15, 35),    // The minimum width (the narrowest "waist" of the coral)
    branches: []                  // An empty array to store the branches later
  };
}

function addBranchesToPillar(pillar) {
  // Randomize the number of branches per trunk (between 1 and 3 branches)
  let numBranches = floor(random(1, 4));

  // Loop to generate that specific number of branches
  for (let b = 0; b < numBranches; b++) {
    // Push the configuration of each branch into the trunk's branches[] array
    pillar.branches.push({
      startY: random(0.4, 0.8),      // Where does it sprout from the trunk? (40% to 80% down the screen)
      length: random(0.15, 0.35),    // How far up does the branch grow?
      dir: random() > 0.5 ? 1 : -1,  // Growth direction: 50% chance to grow right (1), 50% left (-1)
      slope: random(0.6, 1.8),       // How far outward does it lean? (Higher = more horizontal)
      baseThickness: random(15, 35)  // Thickness at the base (used later to taper the branch towards the tip)
    });
  }
}

// --- STEP 2: POPULATING THE SKELETONS WITH DATA NODES (THE RENDER LAYER) ---

function generateDataNodes() {
  // Scan the entire screen using a Grid system, stepping by the 'spacing' variable
  // Scan top to bottom (y-axis)
  for (let y = 0; y < height; y += spacing) {
    // Scan left to right (x-axis)
    for (let x = 0; x < width; x += spacing) {

      // If the current (x, y) pixel falls INSIDE the skeleton of any coral...
      if (isInsideAnyPillar(x, y)) {
        // ...create a Data Node (ASCII character) there and push it to the dataNodes[] array
        dataNodes.push(createNewNode(x, y));
      }
    }
  }
}

function createNewNode(x, y) {
  // Returns an Object representing a single ASCII character on the screen
  return {
    baseX: x,                         // Anchor the original X position (crucial for wave animation)
    baseY: y,                         // Anchor the original Y position
    offset: (x * 0.05) + (y * 0.05),  // Phase shift: Prevents nodes from waving simultaneously, creating a ripple
    char: random(healthyData),        // Pick a random DNA or economic character (A, C, T, G, $, etc.)
    color: random(healthyPalette)     // Pick a random Cyber/Biology color
  };
}

// --- LOGIC HELPER FUNCTIONS ---

function isInsideAnyPillar(x, y) {
  for (let i = 0; i < pillars.length; i++) {
    let p = pillars[i];
    if (checkMainTrunk(x, y, p, i)) return true;
    if (checkBranches(x, y, p, i)) return true;
  }
  return false;
}

/* Perlin Noise: Unlike standard random(), noise() generates 
smooth, continuous sequences of values. This maps organic, wave-like curves 
to the width and center of the pillars, mimicking natural coral growth.*/

/*Technique (Perlin Noise): The Coding Train 2016, 'Perlin Noise in p5.js', YouTube, 23 June, viewed 26 March 2026, <https://youtu.be/Qf4dIN99e2w>.*/
/*Technique (Perlin Noise): The Coding Train 2016, 'Noise vs Random in p5.js', YouTube, 23 June, viewed 26 March 2026, <https://youtu.be/YcdldZ1E9gU>.*/
function checkMainTrunk(x, y, p, index) {
  let px = width * p.x;
  let py = height * p.top;
  let cx = px + (noise(y * 0.005, index) - 0.5) * 80;
  let pWidth = (noise(y * 0.01, index + 10) * p.widthMult) + p.baseWidth;

  if (y > py && abs(x - cx) < pWidth) {
    // 10% chance to drop a character, creating graphic negative spaces
    return random() > 0.1;
  }
  return false;
}

function checkBranches(x, y, p, index) {
  let px = width * p.x;
  let cx = px + (noise(y * 0.005, index) - 0.5) * 80;
  for (let j = 0; j < p.branches.length; j++) {
    if (isInsideBranch(x, y, p.branches[j], cx, j)) return true;
  }
  return false;
}

/* Tapering via map(): This calculates how far along the branch 
the current Y pixel is. It then uses map() to dynamically shrink the thickness 
from its thick base down to a 2px tip, creating a realistic biological branch.*/
function isInsideBranch(x, y, b, cx, bIndex) {
  let bStartY = height * b.startY;
  let bEndY = bStartY - (height * b.length);

  if (y < bStartY && y > bEndY) {
    let progress = bStartY - y;
    let branchCx = cx + (progress * b.slope * b.dir) + (noise(y * 0.02, bIndex) - 0.5) * 30;
    let thickness = map(y, bStartY, bEndY, b.baseThickness, 2);

    return (abs(x - branchCx) < thickness && random() > 0.1);
  }
  return false;
}

// --- DRAWING HELPER FUNCTIONS ---

function updateAndDrawNodes() {
  let time = frameCount * 0.03;
  for (let i = 0; i < dataNodes.length; i++) {
    let node = dataNodes[i];
    let currentX = node.baseX + sin(time + node.offset) * 5;
    let currentY = node.baseY;
    renderSingleNode(node, currentX, currentY);
  }
}

/* Square Hitbox: Instead of dist() for a circular radius, 
this uses absolute values (abs) to create a strict, brutalist square bounding box.*/
function renderSingleNode(node, currX, currY) {
  let inSquare = abs(mouseX - currX) < 150 && abs(mouseY - currY) < 150;
  let dChar = node.char;
  let dCol = node.color;

  if (inSquare) {
    currX += random(-8, 8);
    currY += random(-8, 8);
    dChar = random(corruptedData);
    dCol = random() < 0.15 ? color('#FF0033') : color(random(glitchPalette));
  } else if (random() < 0.02) {
    node.char = random(healthyData);
  }

  fill(dCol);
  textSize(spacing * 0.9);
  text(dChar, currX, currY);
}

function drawScannerBox() {
  noFill();
  stroke('#FF0033');
  strokeWeight(2);
  rectMode(CENTER);
  rect(mouseX + random(-2, 2), mouseY + random(-2, 2), 300, 300);
}

/* Perfect Centering: Uses rectMode(CENTER) and textAlign(CENTER, CENTER) 
locked to a single coordinate (boxCx, boxCy) to ensure text never clips outside the frame.*/
function drawWarningLabel() {
  let boxW = 520;
  let boxH = 110;
  let boxCx = 50 + boxW / 2;
  let boxCy = height - 50 - boxH / 2;

  drawLabelBackground(boxCx, boxCy, boxW, boxH);
  drawLabelText(boxCx, boxCy);
}

function drawLabelBackground(cx, cy, w, h) {
  rectMode(CENTER);
  fill(10, 12, 16, 220);
  stroke('#FF0033');
  strokeWeight(3);
  rect(cx, cy, w, h);
  noStroke();
}

function drawLabelText(cx, cy) {
  drawingContext.shadowOffsetY = 2;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = color(255, 0, 51, 150);

  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textStyle(BOLD);
  textSize(32);
  textLeading(42);

  fill('#FF0033');
  text(callToAction, cx, cy);
  drawingContext.shadowBlur = 0;
}