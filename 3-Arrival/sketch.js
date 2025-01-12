let target, vehicle;
let font;

// Appelée avant de démarrer l'animation, utile pour l'exercice avec text2points
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

let vehicles = [];

function setup() {
  createCanvas(800, 800);

  target = createVector(0, 0);
  vehicles.push(new Vehicle(400, 400));
  vehicles.push(new Vehicle(200, 200));
  vehicles.push(new Vehicle(100, 100));
  vehicles.push(new Vehicle(100, 100));
  vehicles.push(new Vehicle(100, 100));
}



// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible en rouge
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

   // Le premier véhicule suit la souris
   vehicles[0].applyBehaviors(target);
   vehicles[0].update();
   vehicles[0].show();
   vehicles[0].edges();

    // Les autres véhicules suivent le premier
    for (let i = 1; i < vehicles.length; i++) {
      vehicles[i].applyBehaviors(vehicles[i-1].pos, 40);
      vehicles[i].update();
      vehicles[i].show();
      vehicles[i].edges();
    }
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}