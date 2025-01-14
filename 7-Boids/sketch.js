// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

let score = 0;
let highscore = 0;
const flock = [];
const obstacles = [];
const sharks = [];
let eels = [];
let fish = [];
let fishImages = [];
let fishImage;
let greenFishImage;
let yellowFishImage;
let redFishImage;
let requinImage;
let eelImage;

let alignSlider, cohesionSlider, separationSlider;
let labelNbBoids;

let target;

function preload() {
  greenFishImage = loadImage('assets/green.png');
  fishImages.push(greenFishImage);
  yellowFishImage = loadImage('assets/yellow.png');
  fishImages.push(yellowFishImage);
  redFishImage = loadImage('assets/red.png');
  fishImages.push(redFishImage);
  fishImage = loadImage('assets/niceFishtransparent.png');
  fishImages.push(fishImage);
  requinImage = loadImage('assets/requin.png');
  eelImage = loadImage('assets/eel.png');
}

function setup() {

  highscore = int(localStorage.getItem('highscore')) || 0;

  createCanvas(windowWidth, windowHeight);

  const posYSliderDeDepart = 10;
  creerUnSlider("Poids alignment", flock, 0, 2, 1.5, 0.1, 10, posYSliderDeDepart, "alignWeight");
  creerUnSlider("Poids cohesion", flock, 0, 2, 1, 0.1, 10, posYSliderDeDepart + 30, "cohesionWeight");
  creerUnSlider("Poids séparation", flock, 0, 15, 3, 0.1, 10, posYSliderDeDepart + 60, "separationWeight");
  creerUnSlider("Poids boundaries", flock, 0, 15, 10, 1, 10, posYSliderDeDepart + 90, "boundariesWeight");

  creerUnSlider("Rayon des boids", flock, 4, 40, 6, 1, 10, posYSliderDeDepart + 120, "r");
  creerUnSlider("Perception radius", flock, 15, 60, 25, 1, 10, posYSliderDeDepart + 150, "perceptionRadius");

  for (let i = 0; i < 2; i++) {
    const b = new Boid(random(width), random(height), fishImage);
    b.r = random(8, 40);
    flock.push(b);
  }

  labelNbBoids = createP("Nombre de boids : " + flock.length);
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(10, posYSliderDeDepart + 180);

  target = createVector(mouseX, mouseY);
  target.r = 50;

  // Create the first shark
  let initialShark = new Boid(width / 2, height / 2, requinImage);
  initialShark.r = 80;
  initialShark.maxSpeed = 6;
  initialShark.maxForce = 0.5;
  sharks.push(initialShark);

  let snakeFish = new Boid(mouseX, mouseY, eelImage, random(150, 255), random(150, 255), random(150, 255));
    snakeFish.isSnakeFish = true;
    snakeFish.r = 50;
    snakeFish.maxSpeed = 8;
    snakeFish.maxForce = 0.2;
    eels.push(snakeFish);

  updateFishArray();

  // Spawn initial food particles
  for (let i = 0; i < 10; i++) {
    spawnFood();
  }
}

function creerUnSlider(label, tabVehicules, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    tabVehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });

  return slider;
}

function draw() {
  background(0);

  textSize(24);
  text(`Score: ${score}`, (windowWidth/2)-100, 30);
  text(`Highscore: ${highscore}`, (windowWidth/2)-100, 60);

  labelNbBoids.html("Nombre de boids : " + flock.length);

  target.x = mouseX;
  target.y = mouseY;

  push();
  fill("lightgreen");
  noStroke();
  ellipse(target.x, target.y, target.r, target.r);
  pop();

  for (let boid of flock) {
    boid.flock(flock);
    for (let shark of sharks) {
      boid.fleeWithTargetRadius(shark);
    }
    boid.avoid(obstacles);
    boid.update();
    boid.show();
  }

  for (let shark of sharks) {
    let wanderForce = shark.wander();
    wanderForce.mult(1);
    shark.applyForce(wanderForce);

    let rayonDeDetection = 140;
    noFill();
    stroke("yellow");
    ellipse(shark.pos.x, shark.pos.y, rayonDeDetection * 2, rayonDeDetection * 2);

    let closest = shark.getVehiculeLePlusProche(fish);

    if (closest) {
      let d = p5.Vector.dist(shark.pos, closest.pos);
      if (d < rayonDeDetection) {
        let seekForce = shark.seek(closest.pos);
        seekForce.mult(7);
        shark.applyForce(seekForce);
      }
      if (d < 5) {
        let index = fish.indexOf(closest);
        if (index > -1) {
          fish.splice(index, 1);
        }
        // Remove the fish from flock or eels array as well
        if (flock.includes(closest)) {
          flock.splice(flock.indexOf(closest), 1);
        } else if (eels.includes(closest)) {
          eels.splice(eels.indexOf(closest), 1);
          score -= 50;
          score = max(0, score);
        }
      }
    }

    shark.applyAvoidanceForce(obstacles);
    shark.edges();
    shark.update();
    shark.show();
  }

  if(eels.length > 0) {
    eels[0].applyBehaviors(target, obstacles);
    eels[0].edges();
    eels[0].update();
    eels[0].show();
    for (let i = 1; i < eels.length; i++) {
      eels[i].applyBehaviors(eels[i-1].pos, obstacles, eels);
      eels[i].update();
      eels[i].show();
      eels[i].edges();
  }
  }
  

  updateFishArray();

  for (let o of obstacles) {
    o.show();
  }

   // Show all food particles
   for (let food of foodParticles) {
    food.show();
  }

  // First eel eats food
  if (eels.length > 0) {
    let firstEel = eels[0];
    for (let i = foodParticles.length - 1; i >= 0; i--) {
      let food = foodParticles[i];
      if (firstEel.pos.dist(food.pos) < firstEel.r) {
        // Eel eats the food
        foodParticles.splice(i, 1);
        score += 10;

        if (score > highscore) {
          highscore = score;
          localStorage.setItem('highscore', highscore);
        }
        growLastEel();
        spawnFood(); // Spawn a new food particle after one is eaten
      }
    }
  }
}

function growLastEel() {
  let lastEel = eels[eels.length - 1];
  if (lastEel.r < 50) {
    lastEel.r += 10;
  } else {
    // Add a new eel if the last eel has reached size 50
    let newEel = new Boid(lastEel.pos.x, lastEel.pos.y, eelImage, random(150, 255), random(150, 255), random(150, 255));
    newEel.isSnakeFish = true;
    newEel.r = 10;
    newEel.maxSpeed = 4;
    newEel.maxForce = 0.2;
    eels.push(newEel);
  }
}

function updateFishArray() {
  fish = [...flock, ...eels];
}

function mouseDragged() {
  let randomFishImage = fishImages[Math.floor(random(fishImages.length))];
  const b = new Boid(mouseX, mouseY, randomFishImage);
  b.r = random(8, 40);
  flock.push(b);
}

function keyPressed() {
  if (key === 'd') {
    Boid.debug = !Boid.debug;
  } else if (key === 'r') {
    flock.forEach(b => {
      b.r = random(8, 40);
    });
  } else if (key === 's') {
    // Create a new shark at a random position
    let newShark = new Boid(random(width), random(height), requinImage, random(255), random(255), random(255));
    newShark.r = 80;
    newShark.maxSpeed = 6;
    newShark.maxForce = 0.5;
    sharks.push(newShark);
  } else if (key === 'o') {
    // Create a new obstacle at the mouse position
    obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "green"));
  } else if (key === 'f') {
    x = random(width);
    y = random(height);
    // Create 10 fish with random colors
    for (let i = 0; i < 10; i++) {
      let randomFishImage = fishImages[Math.floor(random(fishImages.length))];
      let newFish = new Boid(x, y, randomFishImage, random(255), random(255), random(255));
      newFish.r = random(8, 40);
      newFish.maxSpeed = random(2, 5);
      newFish.maxForce = random(0.1, 0.3);
      flock.push(newFish);
    }
  } else if (key === 'e') {
    // Create a snake-like fish
    let snakeFish = new Boid(mouseX, mouseY, eelImage, random(150, 255), random(150, 255), random(150, 255));
    snakeFish.isSnakeFish = true;
    snakeFish.r = 50;
    snakeFish.maxSpeed = 8;
    snakeFish.maxForce = 0.2;
    eels.push(snakeFish);
  }
}
