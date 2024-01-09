class Vector2 {
  constructor(x, y) {
      this.x = x;
      this.y = y;
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
}

export default Vector2;
