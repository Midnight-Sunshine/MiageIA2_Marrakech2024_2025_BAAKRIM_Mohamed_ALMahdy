// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// Crowd Path Following
// Via Reynolds: http://www.red3d.com/cwr/steer/CrowdPath.html

// Pour debug on/off affichage des lignes etc.
let debug = false;

// le chemin
let path;

// Tableau des véhicules
let vehicles = [];

function setup() {
  createCanvas(1600, 1000); // Enlarged canvas
  newPath();

  const nbVehicules = 1;

  for (let i = 0; i < nbVehicules; i++) {
    newVehicle(random(width), random(height));
  }
  createP(
    "Appuyez sur 'd' pour afficher les infos de debug.<br/>Click souris pour générer de nouveaux véhicules."
  ); 
}

function draw() {
  background(240);
  path.display();

  for (let v of vehicles) {
    v.applyBehaviors(vehicles, path);
    v.run();
  }
}

function newPath() {
  path = new Path();
  let offset = 100;
  path.addPoint(offset, offset);
  path.addPoint(300, 180);
  path.addPoint(600, 100);
  path.addPoint(width - offset, 300);
  path.addPoint(width - offset, height - 300);
  path.addPoint(300, height - offset);
  path.addPoint(width / 2, height - offset * 3);
  path.addPoint(200, 550);
  path.addPoint(offset, height - offset);
  path.addPoint(600, 600); // Adding more complexity
  path.addPoint(800, 400);
  path.addPoint(1000, 700);
  path.addPoint(1300, 500);
  path.addPoint(1100, 300);
  path.addPoint(900, 100);
  path.addPoint(700, 300);
  path.addPoint(500, 100);
  path.addPoint(offset, offset); // Closing the loop for circuit
}

function newVehicle(x, y) {
  let maxspeed = random(2, 4);
  let maxforce = 0.3;
  let v = new Vehicle(x, y, maxspeed, maxforce);
  vehicles.push(v);
  return v;
}

function keyPressed() {
  if (key == "d") {
    debug = !debug;
    Vehicle.debug = !debug;
  } else if(key == "s") {
    let v = newVehicle(mouseX, mouseY);
    v.maxspeed = 7;
    v.couleur = color(255, 0, 0);
  } else if (key == "w") {
    // On crée un véhicule wander
    let v = newVehicle(mouseX, mouseY);
    v.wanderWeight = 10;
    v.separateWeight = 0;
    v.alignWeight = 0;
    v.couleur = color(0, 255, 0);
  }
}

function mouseDragged() {
  newVehicle(mouseX, mouseY);
}
