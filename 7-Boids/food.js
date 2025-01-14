let foodParticles = [];

class Food {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.size = random(8, 15); // Random size for food particles
      this.color = color(random(150, 255), random(150, 255), random(50, 100)); // Bright colors
    }
  
    show() {
      push();
      fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size);
      pop();
    }
  }
  
  function spawnFood() {
    let safeDistance = 50; // Minimum distance between food and obstacles
    let validPosition = false;
    let foodPosition;
  
    // Keep generating positions until a valid one is found
    while (!validPosition) {
      let x = random(width);
      let y = random(height);
      foodPosition = createVector(x, y);
  
      // Check if the position is far enough from all obstacles
      validPosition = true;
      for (let obstacle of obstacles) {
        let distanceToObstacle = p5.Vector.dist(foodPosition, obstacle.pos);
        if (distanceToObstacle < obstacle.r + safeDistance) {
          validPosition = false;
          break;
        }
      }
    }
  
    // Create a new food particle at the valid position
    let food = new Food(foodPosition.x, foodPosition.y, 8, "orange");
    foodParticles.push(food);
  }
  