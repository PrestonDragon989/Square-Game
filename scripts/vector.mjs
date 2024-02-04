class Vector2 {
    constructor(x, y) {
        if (typeof x === 'object' && x !== null) {
          // If the first argument is an object, assume it has 'x' and 'y' properties
          this.x = x.x || 0;
          this.y = x.y || 0;
        } else {
          // Otherwise, use the provided x and y values (or default to 0)
          this.x = x || 0;
          this.y = y || 0;
        }
      }

  // Calculate the magnitude (length) of the vector
  getMagnitude() {
      return Math.hypot(this.x, this.y);
  }

  // Normalize the vector (make its length 1)
  normalize() {
      const magnitude = this.getMagnitude();
      if (magnitude !== 0) {
          this.x /= magnitude;
          this.y /= magnitude;
      }
      return this; // Return the current instance after normalization
  } 

  rotate(angle) {
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      const newX = this.x * cosAngle - this.y * sinAngle;
      const newY = this.x * sinAngle + this.y * cosAngle;
      this.x = newX;
      this.y = newY;
      return this; // Return the current instance after rotation
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this; // Return the current instance after scaling
    }

    orbit(center, angle, radius) {
        // Calculate the position on the orbit
        const orbitPosition = new Vector2(radius, 0).rotate(angle);
    
        // Set the absolute position by adding the center coordinates
        this.x = center.x + orbitPosition.x;
        this.y = center.y + orbitPosition.y;
    
        return this;
      }
}

export default Vector2;
