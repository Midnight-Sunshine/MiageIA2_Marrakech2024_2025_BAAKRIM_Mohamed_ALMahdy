class Vehicle {
  static debug = false;

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 6;
    this.maxForce = 0.25;
    this.r = 16;
    this.rayonZoneDeFreinage = 100;
  }

  applyBehaviors(target, d=0) {
    let force = this.arrive(target, d);
    this.applyForce(force);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  arrive(target, safeDistance=0) {
    return this.seek(target, true, safeDistance);
  }

  flee(target) {
    // recopier code de flee de l'exemple précédent
  }

  seek(target, arrival=false, safeDistance=0) {
    let desiredSpeed = p5.Vector.sub(target, this.pos);
    let desiredSpeedMagnitude = this.maxSpeed;

    if (arrival) {
      // on dessine un cercle de rayon 100 
      // centré sur le point d'arrivée

      
      
      // on calcule la distance du véhicule
      // par rapport au centre du cercle
      const dist = p5.Vector.dist(this.pos, target);

      if (dist < this.rayonZoneDeFreinage) {
        // on va diminuer de manière proportionnelle à
        // la distance, la vitesse
        // on va utiliser la fonction map(...) de P5
        // qui permet de modifier une valeur dans un 
        // intervalle initial, vers la même valeur dans un
        // autre intervalle
        // newVal = map(value, start1, stop1, start2, stop2,)
        // en français : on prend une valeur entre start1 et stop1, et on la transforme pour qu'elle soit
        // entre start2 et stop2
        // ici dist est entre 0 et le razyon du cercle de freinage, et on transforme cette valeur
        // pour qu'elle soit entre 0 et maxSpeed
        desiredSpeedMagnitude = map(dist, safeDistance, this.rayonZoneDeFreinage, 0, this.maxSpeed)
      }
    }

    if (Vehicle.debug) {
      noFill();
      stroke("white")
      circle(this.pos.x, this.pos.y, this.rayonZoneDeFreinage)
    }

    // equation force = vitesseDesiree - vitesseActuelle
    desiredSpeed.setMag(desiredSpeedMagnitude);
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    // et on limite la force
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    //circle(0, 0, this.r * 2);
    
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
  }
}
