class Vehicle {
  static debug = false;
  
  constructor(x, y, image) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    
    // Generate a random size for each vehicle (within a specified range)
    this.r = random(30, 80);  // Random radius size between 30 and 80
  
    this.col = color(random(255), random(255), random(255));

    // Create a graphics object for the tinted image
    this.image = createGraphics(image.width, image.height);
    this.image.tint(this.col);
    this.image.image(image, 0, 0);

    // For wander behavior
    this.distanceCercle = 150;
    this.wanderRadius = 50;
    this.wanderTheta = 0;
    this.displaceRange = 0.1;

    // Trail feature: an array to store the past positions
    this.path = [];
    this.pathLength = 50; // Maximum size of the trail
  }

  applyBehaviors() {
    let force = this.wander();
    this.applyForce(force);
  }

  wander() {
    // Calculate the center of the wander circle
    let centreCercleDevant = this.vel.copy();
    centreCercleDevant.setMag(this.distanceCercle);
    centreCercleDevant.add(this.pos);

    if (Vehicle.debug) {
        // Draw the wander circle center as a red dot
        fill("red");
        noStroke();
        circle(centreCercleDevant.x, centreCercleDevant.y, 8);

        // Draw the wander circle
        noFill();
        stroke("white");
        circle(centreCercleDevant.x, centreCercleDevant.y, this.wanderRadius * 2);

        // Draw a line from the vehicle to the circle center
        line(this.pos.x, this.pos.y, centreCercleDevant.x, centreCercleDevant.y);
    }

    // Calculate the point on the circle
    let pointSurCercle = createVector(
        this.wanderRadius * cos(this.wanderTheta),
        this.wanderRadius * sin(this.wanderTheta)
    );
    pointSurCercle.add(centreCercleDevant);

    if (Vehicle.debug) {
        // Draw the green dot on the circle
        fill("lightGreen");
        noStroke();
        circle(pointSurCercle.x, pointSurCercle.y, 8);

        // Draw a line from the vehicle to the green dot
        stroke("green");
        line(this.pos.x, this.pos.y, pointSurCercle.x, pointSurCercle.y);
    }

    // Calculate desired speed towards the green dot
    let desiredSpeed = p5.Vector.sub(pointSurCercle, this.pos);
    desiredSpeed.setMag(this.maxSpeed);

    // Calculate steering force
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    force.limit(this.maxForce);

    // Update the wander angle
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);

    return force;
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

  arrive(target) {
    return this.seek(target, true);
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
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
  
    // Add the current position to the path (trail)
    this.path.push(this.pos.copy());
  
    // Handle wrapping for the path
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      this.path = []; // Clear the path to prevent lines across the screen
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
      this.path = [];
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
      this.path = [];
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
      this.path = [];
    }
  
    // Limit the trail length
    if (this.path.length > this.pathLength) {
      this.path.shift(); // Remove the oldest position to keep the trail size constant
    }
  }
  
  show() {
    // Set the color and thickness of the trail
    let trailColor = this.col; // Use the vehicle's color for the trail
    let trailThickness = 3; // Thickness of the trail
  
    // Draw the trail (path)
    noFill();
    stroke(trailColor);
    strokeWeight(trailThickness);
    beginShape();
    this.path.forEach((currentPos) => {
      vertex(currentPos.x, currentPos.y);
    });
    endShape();
  
    // Draw the vehicle with the image
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() - PI / 2);
    imageMode(CENTER);
    image(this.image, 0, 0, this.r * 2, this.r * 2);
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
