// Imports
import Utils from "./utils.mjs";
import Vector2 from "./vector.mjs";

class baseAI {
    constructor(player, enemy, utils, collision) {
        // Validating my Imports
        this.player = player;
        this.enemy = enemy;
        this.collision = collision;
        this.utils = new Utils();

        // Initialization of rect
        this.rect = null; 
    }
 
    basicMove(speed) {
        // Getting Vector movement, and return the result
        return new Vector2(this.player.x - this.rect.x, this.player.y - this.rect.y).normalize().scale(speed);    
    }

    specificMove(speed, coordinates) {
        // Getting Vector movement, and return the result
        return new Vector2(coordinates[0] - this.rect.x, coordinates[1] - this.rect.y).normalize().scale(speed);    
    }

    circleMovement(center, target, speed, rotation) {
        const vectorToTarget = new Vector2(target.x - center.x, target.y - center.y);
    
        if (rotation) {
            // If rotation is true, rotate the vector smoothly
            const angle = Math.atan2(vectorToTarget.y, vectorToTarget.x) + speed;
            const magnitude = vectorToTarget.getMagnitude();
            vectorToTarget.x = magnitude * Math.cos(angle);
            vectorToTarget.y = magnitude * Math.sin(angle);
        } else {
            // If rotation is false, orbit around the target
            vectorToTarget.orbit(target, speed, vectorToTarget.getMagnitude());
        }
    
        return { x: vectorToTarget.x, y: vectorToTarget.y };
    }

    basicShoot(targetX, targetY, bulletSize, bulletSpeed, damage, bulletList, image, rect, target = 1) {
        //Getting Enemy Center, location Coords
        let enemyCenterX = rect.x + (rect.width / 2);
        let enemyCenterY = rect.y + (rect.height / 2);

        //Redining Into Librarys for Ease of use in the code
        const enemy_pos = { x: enemyCenterX, y: enemyCenterY};
        const target_pos = { x: targetX, y: targetY};

        // Making bullet Dimensions 
        const bulletDimensions = {
            x: enemy_pos.x,
            y: enemy_pos.y,
            width: bulletSize,
            height: bulletSize
        };

        // Getting bullet location
        const bullet_vector = new Vector2(target_pos.x - enemy_pos.x, target_pos.y - enemy_pos.y);
        bullet_vector.normalize();

        // Adding bullet to the bullet list
        bulletList.push({ rect: bulletDimensions, vector: bullet_vector, velocity: bulletSpeed, damage: damage, target, img: image});
    }
}

// Red AI Classes
class basicRedAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // State Information
        this.state = "follow";
    }

    AIBrain() {
        let newState;

        // Distance to Player
        let distanceToPlayer = this.utils.getDistance([this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2)], [this.player.x, this.player.y]);

        if (distanceToPlayer <= 125) {
            newState = "attack1";
        } else if (distanceToPlayer <= 150) {
            newState = "attack2";
        } else if (distanceToPlayer <= 250) {
            newState = "attack3";
        } else if (distanceToPlayer <= 1000) {
            newState = "attack4";
        } else if (distanceToPlayer <= 2000) {
            newState = "attack5";
        } else {
            newState = "follow";
        }
        
        return newState;
    }

    AIAction(player, rect, enemyBulletList) {
        // Changing State based on brain
        this.player = player;
        this.rect = rect;
        this.state = this.AIBrain();
    
        // AI Actions based on state
        if (this.state === "follow") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack1") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 2.25));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack2") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 2));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack3") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.80));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack4") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.45));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack5") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.25));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        }
    }
}

class mediumRedAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // Time Stamps
        this.lastDashTime = Date.now();
        this.dashWaitTime = 0;

        // Target Positions
        this.targetPosition = [0, 0];

        // State Information
        this.state = "follow";
        this.dashState = "stop"
        this.dashMark = null;
        this.dashNumber = 0;
        this.dashSpeed = 4;
    }

    AIBrain() {
        let newState;

        if (this.state !== "dash") {

            // Calculating Distance to player
            let distanceToPlayer = this.utils.getDistance([this.player.x, this.player.y], [this.rect.x, this.rect.y])

            // Chancging Speed Based on Distance
            if (distanceToPlayer >= 3000) {
                newState = "run";
            } else if (distanceToPlayer <= 250) {
                newState = "attack1";
            } else if (distanceToPlayer <= 1000) {
                newState = "attack2";
            } else if (distanceToPlayer <= 2000) {
                newState = "attack3";
            } else {
                newState = "follow";
            }

            // Setting Up Dash Chance
            
            if (distanceToPlayer <= 5000 && this.state != "dash" && this.utils.randint(1, 400) === 1) { 
                newState = "dash";
            }
            
        } else newState = "dash";

        return newState;
    }

    dashLogic() {
        // Setting Dash Number
        if (this.dashNumber === 0) {
            this.dashNumber = this.utils.randint(4, 9);
        }
        const timeElapsed = Date.now() - this.lastDashTime;

        // Getting Dash Mark if we need one
        if (this.dashMark == null && this.dashNumber >= 1 && timeElapsed > this.dashWaitTime) {
            let dashMarkX = this.player.x + this.utils.randint(-5, 5);
            let dashMarkY = this.player.y + this.utils.randint(-5, 5);

            if (dashMarkX < 0) dashMarkX = 0;
            else if (dashMarkX + this.rect.width > this.canvas.width) dashMarkX = this.canvas.width - this.rect.width;

            if (dashMarkY < 0) dashMarkY = 0;
            else if (dashMarkY + this.rect.height > this.canvas.height) dashMarkY = this.canvas.height - this.rect.height;
            
            this.dashMark = [dashMarkX, dashMarkY]; 
            this.dashWaitTime = this.utils.randint(50, 250);
            this.dashSpeed = this.utils.randFloat(1.75, 3.5);
            if (this.utils.randint(1,50) == 1) this.dashSpeed = 5;
        }
        if (this.dashMark !== null) {
        if (this.utils.getDistance([this.dashMark[0], this.dashMark[1]], [this.rect.x, this.rect.y]) >= 25 && timeElapsed >= this.dashWaitTime) {
            return this.specificMove(this.speed * this.dashSpeed, [this.dashMark[0], this.dashMark[1]]);
        } 
        else if (this.utils.getDistance([this.dashMark[0], this.dashMark[1]], [this.rect.x, this.rect.y]) <= 25) {
            this.dashNumber--;
            this.lastDashTime = Date.now();
            this.dashMark = null;
            if (this.dashNumber <= 0) {
                this.state = "dash";
            }
            return {x: 0, y: 0};
        } 
        else return {x: 0, y: 0};
        }
        return {x: 0, y: 0};
    }

    AIAction(player, rect, enemyBulletList) {
        // Resetting Values
        this.player = player;
        this.rect = rect;

        // Getting State
        this.state = this.AIBrain();

        // AI Actions based on state
        if (this.state === "run") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed * 1.35);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "follow") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack1") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.4));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack2") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.3));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack3") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.15));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "dash") {
            // Calculate the movement vector
            const movementVector = this.dashLogic((this.speed));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else return [0, 0];
    }
}

class complexRedAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // Time Stamps
        this.lastBasicDashTime = Date.now();
        this.lastFlurryDashTime = Date.now();
        this.dashWaitTime = 0;

        // Target Positions
        this.targetPosition = [0, 0];

        // State Information
        this.state = "follow";

        // Dash Information
        this.basicDashMark = null;
        this.basicDashNumber = 0;
        this.basicDashSpeed = 4;

        this.flurryDashMark = null;
        this.flurryDashNumber = 0;
        this.flurryDashSpeed = 5;
        this.flurryDashCenterMark = null;
        this.begginingFlurryDash = true;
        this.begginingFlurryDashWait = Date.now();
    }

    AIBrain() {
        let newState;

        // Calculating Distance to player
        let distanceToPlayer = this.utils.getDistance([this.player.x, this.player.y], [this.rect.x, this.rect.y])

        if (this.state != "basicDash" && this.state != "flurryDash") {
            // Basic Speed Mechanics
            if (distanceToPlayer >= 3000) {
                newState = "run";
            } else if (distanceToPlayer <= 100) {
                newState = "attack1";
            } else if (distanceToPlayer <= 250) {
                newState = "attack2";
            } else if (distanceToPlayer <= 1500) {
                newState = "attack3";
            } else {
                newState = "follow";
            }

            // Dash Chances
            if (this.utils.randint(1, 350) == 1) {
                newState = "flurryDash";
                this.lastFlurryDashTime = Date.now();
                this.begginingFlurryDashWait = Date.now();
                this.begginingFlurryDash = true;
            }
            if (this.utils.randint(1, 300) == 1) {
                newState = "basicDash";
                this.lastBasicDashTime = Date.now();
            }

        } else {
            newState = this.state;
        }

        return newState; 
    }

    basicDashLogic() {
        // Setting Dash Number
        if (this.basicDashNumber == 0) {
            this.basicDashNumber = this.utils.randint(3, 9); 
            if (this.utils.randint(1, 40) == 1) this.basicDashNumber = 25;
        }
        const timeElapsed = Date.now() - this.lastBasicDashTime;

        // Getting Dash Mark if we need one
        if (this.basicDashMark == null && this.basicDashNumber >= 1 && timeElapsed > this.dashWaitTime) {
            let dashMarkX = this.player.x;
            let dashMarkY = this.player.y;

            if (dashMarkX < 0) dashMarkX = 0;
            else if (dashMarkX + this.rect.width > this.canvas.width) dashMarkX = this.canvas.width - this.rect.width;

            if (dashMarkY < 0) dashMarkY = 0;
            else if (dashMarkY + this.rect.height > this.canvas.height) dashMarkY = this.canvas.height - this.rect.height;

            this.basicDashMark = [dashMarkX, dashMarkY];
            this.dashWaitTime = this.utils.randint(500, 1000);
            this.basicDashSpeed = this.utils.randint(4, 6.5);
        }
        if (this.basicDashMark !== null) {
            if (this.utils.getDistance([this.basicDashMark[0], this.basicDashMark[1]], [this.rect.x, this.rect.y]) >= 35 && timeElapsed >= this.dashWaitTime) {
                return this.specificMove(this.speed * this.basicDashSpeed, [this.basicDashMark[0], this.basicDashMark[1]]);
            } 
            else if (this.utils.getDistance([this.basicDashMark[0], this.basicDashMark[1]], [this.rect.x, this.rect.y]) <= 35) {
                this.basicDashNumber--;
                this.lastBasicDashTime = Date.now();
                this.basicDashMark = null;
                if (this.basicDashNumber <= 0) {
                    this.state = "follow";
                }
                return {x: 0, y: 0};
            } 
            else {
                return {x: 0, y: 0};
            }
        }
        return {x: 0, y: 0};
    }

    flurryDashLogic() {
        // Setting Up initial hesitation
        if (this.begginingFlurryDash) {
            const timeElapsed = Date.now() - this.begginingFlurryDashWait;
            if (timeElapsed < 2500) {
                return {x: 0, y: 0};
            } else {
                this.begginingFlurryDash = false;
            }
        }
        // Setting Dash Number
        if (this.flurryDashNumber == 0) {
            this.flurryDashNumber = this.utils.randint(8, 13); 
        }
        if (this.flurryDashCenterMark == null) {
            this.flurryDashCenterMark = [this.player.x, this.player.y];
        }
        const timeElapsed = Date.now() - this.lastFlurryDashTime;

        // Getting Dash Mark if we need one
        if (this.flurryDashMark == null && this.flurryDashNumber >= 1 && timeElapsed > this.dashWaitTime) {
            let dashMarkX = this.flurryDashCenterMark[0] + this.utils.randint(-250, 250);
            let dashMarkY = this.flurryDashCenterMark[1] + this.utils.randint(-250, 250);

            if (dashMarkX < 0) dashMarkX = 0;
            else if (dashMarkX + this.rect.width > this.canvas.width) dashMarkX = this.canvas.width - this.rect.width;

            if (dashMarkY < 0) dashMarkY = 0;
            else if (dashMarkY + this.rect.height > this.canvas.height) dashMarkY = this.canvas.height - this.rect.height;

            this.flurryDashMark = [dashMarkX, dashMarkY];
            this.dashWaitTime = this.utils.randint(0, 50);
            this.flurryDashSpeed = this.utils.randint(5, 7.5);
        }
        if (this.flurryDashMark !== null) {
            if (this.utils.getDistance([this.flurryDashMark[0], this.flurryDashMark[1]], [this.rect.x, this.rect.y]) >= 35 && timeElapsed >= this.dashWaitTime) {
                return this.specificMove(this.speed * this.flurryDashSpeed, [this.flurryDashMark[0], this.flurryDashMark[1]]);
            } 
            else if (this.utils.getDistance([this.flurryDashMark[0], this.flurryDashMark[1]], [this.rect.x, this.rect.y]) <= 35) {
                this.flurryDashNumber--;
                this.lastFlurryDashTime = Date.now();
                this.flurryDashMark = null;
                if (this.flurryDashNumber <= 0) {
                    this.state = "follow";
                    this.flurryDashCenterMark = null
                }
                return {x: 0, y: 0};
            } 
            else {
                return {x: 0, y: 0};
            }
        }
        return {x: 0, y: 0};
    }

    AIAction(player, rect, enemyBulletList) {
        // Resetting Values
        this.player = player;
        this.rect = rect;

        // Getting State
        this.state = this.AIBrain();

        // AI Actions based on state
        if (this.state === "run") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed * 1.35);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "follow") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack1") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.4));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack2") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.2));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack3") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.1));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "basicDash") {
            // Calculate the movement vector
            const movementVector = this.basicDashLogic((this.speed));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "flurryDash") {
            // Calculate the movement vector
            const movementVector = this.flurryDashLogic((this.speed));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else {            
            return [0, 0];
        }
    }
}

class basicBlueAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // State Information
        this.state = "closeIn";

        // Close In Distance
        this.closeInDistance = this.utils.randint(500, 150);
        this.runAwaySpeed = this.utils.randFloat(2, 5); 

        // Getting Orbit Rotation
        this.orbitRotation = 1;//this.utils.randint(0, 1);
        this.orbitChangeAnglePoint = 22.5

        // Bullet Times
        this.lastShootTime = Date.now();
        this.shootWaitTime = 1000;

        // Bullet Image
        this.bulletImage = new Image();
        this.bulletImage.src = "images/entities/enemies/basicBlueEnemies/basic-blue-enemy.png";
    }

    steady(enemyBulletList) {
        // Determing Shoot
        const timeElapsed = Date.now() - this.lastShootTime;
        if (timeElapsed > this.shootWaitTime) {
            this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(7, 8.5), this.utils.randint(3, 3.5), this.bulletDamage + this.utils.randint(-4, 1), enemyBulletList, this.bulletImage, this.rect, 1);
            this.lastShootTime = Date.now();
            this.shootWaitTime = this.utils.randint(1500, 2500);
        }

        // Setting up newPoint
        let newPoint;

        // Getting Distance to player
        let distanceToPlayer = this.utils.getDistance([this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2)], [this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2)], true);
        
        // Getting Angle To Player
        let angleToPlayer = this.utils.getAngleBetween(this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2), this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2), true);
        
        // Finding Target point
        if (this.orbitRotation == 1) {
            // Getting Angle for new Point
            let changedAngle = angleToPlayer + this.orbitChangeAnglePoint;

            // Getting Slope of new Point
            let newSlope = Math.tan((changedAngle * Math.PI) / 180);

            // Getting New point based on new Angle & Slope (Map out new point, which is current point of the player, with the new angle & slope, for the same amount of distance as before)
            newPoint = this.utils.calculateNewPoint([this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2)], newSlope, distanceToPlayer);
        }

        // Returning The Movement Feature
        return this.specificMove(this.speed, newPoint);
    }

    closeIn(enemyBulletList) {
        // Determing Shoot
        const timeElapsed = Date.now() - this.lastShootTime;
        if (timeElapsed > this.shootWaitTime) {
            this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(7, 8.5), this.utils.randint(3, 3.5), this.bulletDamage + this.utils.randint(-4, 1), enemyBulletList, this.bulletImage, this.rect, 1);
            this.lastShootTime = Date.now();
            this.shootWaitTime = this.utils.randint(1500, 2500);
        }

        // Returning The Movement Feature
        return this.basicMove(this.speed);
    }

    run(enemyBulletList) {
        // Determing Shoot
        const timeElapsed = Date.now() - this.lastShootTime;
        if (timeElapsed > this.shootWaitTime) {
            this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(7, 8.5), this.utils.randint(3, 3.5), this.bulletDamage + this.utils.randint(-4, 1), enemyBulletList, this.bulletImage, this.rect, 1);
            this.lastShootTime = Date.now();
            this.shootWaitTime = this.utils.randint(1500, 2500);
        }

        // Returning The Movement Feature
        return this.basicMove(-1 * (this.speed * (this.runAwaySpeed / 10 + 1)));
    }

    AIBrain() {
        let newState;

        // Distance to Player
        let distanceToPlayer = this.utils.getDistance([this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2)], [this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2)]);

        if (distanceToPlayer <= this.closeInDistance * 0.6) {
            newState = "run";
        } else if (distanceToPlayer <= this.closeInDistance) {
            newState = "steady";
        } else if (distanceToPlayer <= this.closeInDistance * 1.4 && this.state == "steady") {
            newState = "steady";
        } else {
            newState = "closeIn";
        }
        return newState;
    }

    AIAction(player, rect, enemyBulletList) {
        // Changing State based on brain
        this.player = player;
        this.rect = rect;
        this.state = this.AIBrain();
    
        // AI Actions based on state
        if (this.state === "closeIn") {
            // Calculate the movement vector
            const movementVector = this.closeIn(enemyBulletList);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "steady") {
            // Calculate the movement vector
            const movementVector = this.steady(enemyBulletList);
    
            // Update the enemy position based on the movement vector
            return [movementVector.y, movementVector.x];
        } else if (this.state === "run") {
            // Calculate the movement vector
            const movementVector = this.run(enemyBulletList);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else return [0, 0];
    }
}

class mediumBlueAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // State Information
        this.state = "closeIn";

        // close In Data
        this.closeInDistance = this.utils.randint(250, 400)
        this.runAwaySpeed = this.utils.randFloat(1.3, 1.5);

        // Bullet Times
        this.lastBasicShootTime = Date.now();
        this.basicShootWaitTime = 1000;

        // Turret Shoot Times
        this.turretOneShootTime = Date.now();
        this.turretTwoShootTime = Date.now();

        this.turretOneWaitTime = this.utils.randint(50, 150);
        this.turretTwoWaitTime = this.utils.randint(50, 150);

        this.turretShootTime = Date.now();
        this.turretShootDuration = null;

        // Dash Shot Data
        this.dashAttackTime = Date.now();
        this.dashAttackWaitTime = this.utils.randint(2000, 2500);
        
        this.dashShootTime = Date.now();
        this.dashShootWaitTime = this.utils.randint(75, 150); 
        
        this.dashAttackMark = null;

        // Bullet Image
        this.bulletImage = new Image();
        this.bulletImage.src = "images/entities/enemies/basicBlueEnemies/basic-blue-enemy.png";
    }

    normalShoot(bulletList) {
        // Determing Shoot
        const timeElapsed = Date.now() - this.lastBasicShootTime;
        if (timeElapsed > this.basicShootWaitTime) {
            this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(13, 15), this.utils.randint(9, 12), this.bulletDamage + this.utils.randint(2, 6), bulletList, this.bulletImage, this.rect, 1);
            this.lastBasicShootTime = Date.now();
            this.BasicshootWaitTime = this.utils.randint(1500, 2500);
        }
    }

    turretShoot(bulletList) {
        const timeElapsed = Date.now() - this.turretShootTime;
        const turretOneElapsed = Date.now() - this.turretOneShootTime;
        const turretTwoElapsed = Date.now() - this.turretTwoShootTime;
        if (this.turretShootDuration == null) {
            this.turretShootDuration = this.utils.randint(2250, 2750);
            return {x: 0, y: 0};
        }
        if (timeElapsed < 1750) {

        } else if (timeElapsed < this.turretShootDuration) {
            if (turretOneElapsed > this.turretOneWaitTime) {
                this.turretOneShootTime = Date.now()
                this.turretOneWaitTime = this.utils.randint(50, 125);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(19, 20), this.bulletDamage + this.utils.randint(-5, -10), bulletList, this.bulletImage, {x: this.rect.x - 15, y: this.rect.y - 15, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.turretTwoWaitTime) {
                this.turretTwoShootTime = Date.now();
                this.turretTwoWaitTime = this.utils.randint(50, 125);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(19, 20), this.bulletDamage + this.utils.randint(-5, -10), bulletList, this.bulletImage, {x: this.rect.x + 15, y: this.rect.y + 15, height: this.rect.height, width: this.rect.width}, 1);
            }
        } else if (timeElapsed > this.turretShootDuration) {
            this.turretShootDuration = null;
            this.basicShootWaitTime = Date.now();
            this.state = "closeIn";
        }
        return {x: 0, y: 0};
    }

    dashShot(bulletList) {
        const dashAttackTimeElapsed = Date.now() - this.dashAttackTime;
        const dashShootTimeElapsed = Date.now() - this.dashShootTime;

        // Checking to see if the enemy needs to wait
        if (dashAttackTimeElapsed < this.dashAttackWaitTime) return {x: 0, y: 0};

        // Getting DashMark if need be
        if (this.dashAttackMark == null) {
            this.dashAttackMark = [this.player.x + this.utils.randint(1, 75), this.player.y + this.utils.randint(1, 75)];
            if (this.dashAttackMark[0] < 0) this.dashAttackMark = [0, this.dashAttackMark[1]];
            else if (this.dashAttackMark[0] > this.canvas.width - this.rect.width) [this.canvas.width - this.rect.width, this.dashAttackMark[1]];
            if (this.dashAttackMark[1] < 0) this.dashAttackMark = [this.dashAttackMark[0], 0];
            else if (this.dashAttackMark[1] > this.canvas.height - this.rect.height) this.dashAttackMark = [this.dashAttackMark[0], this.canvas.height - this.rect.height];
            return {x: 0, y: 0};
        }

        // Checking to see if enemy is near its pont
        const distanceToMark = this.utils.getDistance([this.rect.x - (this.rect.width / 2), this.rect.y - (this.rect.height / 2)], this.dashAttackMark);
        if (distanceToMark < 76) {
            this.dashAttackMark = null;
            this.state = "closeIn"
            return {x: 0, y: 0};
        } else if (distanceToMark >= 76) {
            if (dashShootTimeElapsed > this.dashShootWaitTime) {
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(14, 16), this.utils.randint(14, 25), this.bulletDamage + this.utils.randint(-2, 3), bulletList, this.bulletImage, {x: this.rect.x - 15, y: this.rect.y - 15, height: this.rect.height, width: this.rect.width}, 1);
                this.dashShootWaitTime = this.utils.randint(125, 175);
                this.dashShootTime = Date.now();
            }
            return this.specificMove(this.speed * 1.8, this.dashAttackMark)
        } else { return {x: 0, y: 0} }
    }

    AIBrain() {
        let newState;

        // Distance to Player
        let distanceToPlayer = this.utils.getDistance([this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2)], [this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2)]);

        if (this.state !== "turretShoot" && this.state !== "dashShot") {
            if (distanceToPlayer <= this.closeInDistance * 0.6) {
                newState = "run";
            } else if (distanceToPlayer <= this.closeInDistance) {
                newState = "steady";
            } else {
                newState = "closeIn";
            }
            if (this.utils.randint(1, 500) == 1) {
                newState = "turretShoot";
                this.turretShootTime = Date.now();
            }
            if (this.utils.randint(1, 600) == 1) {
                newState = "dashShot";
                this.dashShootTime = Date.now();
                this.dashAttackTime = Date.now();
            }
        } else newState = this.state;
        return newState;
    }

    AIAction(player, rect, enemyBulletList) {
        // Changing State based on brain
        this.player = player;
        this.rect = rect;
        this.state = this.AIBrain();
    
        // Normal Shoot When Spare Time
        if (this.state != "run" && this.state != "turretShoot" && this.state != "dashShot") this.normalShoot(enemyBulletList);

        // AI Actions based on state
        if (this.state == "closeIn") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state == "run") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed * -1);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state == "steady") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 0.8) * this.runAwaySpeed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.y, movementVector.x];
        } else if (this.state == "turretShoot") {
                // Calculate the movement vector
                const movementVector = this.turretShoot(enemyBulletList);

                // Update the enemy position based on the movement vector
                return [movementVector.y, movementVector.x];
        } else if (this.state == "dashShot") {
            // Calculate the movement vector
            const movementVector = this.dashShot(enemyBulletList);

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        }
        return [0, 0]
    }
}

class complexBlueAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage, canvas) {
        // Call the constructor of the superclass
        super();
        this.player = null;
        this.canvas = canvas;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // State Information
        this.state = "closeIn";

        // close In Data
        this.closeInDistance = this.utils.randint(250, 400)
        this.runAwaySpeed = this.utils.randFloat(1.3, 1.5);

        // Bullet Times
        this.lastBasicShootTime = Date.now();
        this.basicShootWaitTime = 1000;

        // Quick Turret Shoot Times
        this.quickTurretOneShootTime = Date.now();
        this.quickTurretTwoShootTime = Date.now();

        this.quickTurretOneWaitTime = this.utils.randint(50, 150);
        this.quickTurretTwoWaitTime = this.utils.randint(50, 150);

        this.quickTurretShootTime = Date.now();
        this.quickTurretShootDuration = null;

        // Long Turet Shoot Times
        this.longTurretOneShootTime = Date.now();
        this.longTurretTwoShootTime = Date.now();
        this.longTurretThreeShootTime = Date.now();
        this.longTurretFourShootTime = Date.now();
        this.longTurretFiveShootTime = Date.now();

        this.longTurretOneWaitTime = this.utils.randint(50, 150);
        this.longTurretTwoWaitTime = this.utils.randint(50, 150);
        this.longTurretThreeWaitTime = this.utils.randint(50, 150);
        this.longTurretFourWaitTime = this.utils.randint(50, 150);
        this.longTurretFiveWaitTime = this.utils.randint(50, 150);

        this.longTurretShootTime = Date.now();
        this.longTurretShootDuration = null;

        // Dash Shot Data
        this.dashAttackTime = Date.now();
        this.dashAttackWaitTime = this.utils.randint(1000, 1500);
        
        this.dashShootOneTime = Date.now();
        this.dashShootOneWaitTime = this.utils.randint(75, 150); 

        this.dashShootTwoTime = Date.now();
        this.dashShootTwoWaitTime = this.utils.randint(75, 150);

        this.dashShootThreeTime = Date.now();
        this.dashShootThreeWaitTime = this.utils.randint(75, 150);
        
        this.dashAttackMark = null;

        // Bullet Image
        this.bulletImage = new Image();
        this.bulletImage.src = "images/entities/enemies/basicBlueEnemies/basic-blue-enemy.png";
    }

    normalShoot(bulletList) {
        // Determing Shoot
        const timeElapsed = Date.now() - this.lastBasicShootTime;
        if (timeElapsed > this.basicShootWaitTime) {
            this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(13, 15), this.utils.randint(9, 12), this.bulletDamage + this.utils.randint(2, 6), bulletList, this.bulletImage, this.rect, 1);
            this.lastBasicShootTime = Date.now();
            this.BasicshootWaitTime = this.utils.randint(1500, 2500);
        }
    }

    quickTurretShoot(bulletList) {
        const timeElapsed = Date.now() - this.quickTurretShootTime;
        const turretOneElapsed = Date.now() - this.quickTurretOneShootTime;
        const turretTwoElapsed = Date.now() - this.quickTurretTwoShootTime;
        if (this.quickTurretShootDuration == null) {
            this.quickTurretShootDuration = this.utils.randint(1750, 2000);
            return {x: 0, y: 0};
        }
        if (timeElapsed < 1000) {

        } else if (timeElapsed < this.quickTurretShootDuration) {
            if (turretOneElapsed > this.quickTurretOneWaitTime) {
                this.quickTurretOneShootTime = Date.now()
                this.quickTurretOneWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(19, 20), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x - 25, y: this.rect.y - 25, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.quickTurretTwoWaitTime) {
                this.quickTurretTwoShootTime = Date.now();
                this.quickTurretTwoWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(19, 20), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x + 25, y: this.rect.y + 25, height: this.rect.height, width: this.rect.width}, 1);
            }
        } else if (timeElapsed > this.quickTurretShootDuration) {
            this.quickTurretShootDuration = null;
            this.basicShootWaitTime = Date.now();
            this.state = "closeIn";
        }
        return {x: 0, y: 0};
    }

    longTurretShoot(bulletList) {
        const timeElapsed = Date.now() - this.longTurretShootTime;
        const turretOneElapsed = Date.now() - this.longTurretOneShootTime;
        const turretTwoElapsed = Date.now() - this.longTurretTwoShootTime;
        if (this.longTurretShootDuration == null) {
            this.longTurretShootDuration = this.utils.randint(3000, 3500);
            return {x: 0, y: 0};
        }
        if (timeElapsed < 2000) {

        } else if (timeElapsed < this.longTurretShootDuration) {
            if (turretOneElapsed > this.longTurretOneWaitTime) {
                this.longTurretOneShootTime = Date.now()
                this.longTurretOneWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(21, 27), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x - 25, y: this.rect.y - 25, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.longTurretTwoWaitTime) {
                this.longTurretTwoShootTime = Date.now();
                this.longTurretTwoWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(21, 27), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x + 25, y: this.rect.y + 25, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.longTurretTwoWaitTime) {
                this.longTurretThreeShootTime = Date.now();
                this.longTurretThreeWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(21, 27), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x + 25, y: this.rect.y - 25, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.longTurretTwoWaitTime) {
                this.longTurretFourShootTime = Date.now();
                this.longTurretFourWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(21, 27), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x - 25, y: this.rect.y + 25, height: this.rect.height, width: this.rect.width}, 1);
            }
            if (turretTwoElapsed > this.longTurretTwoWaitTime) {
                this.longTurretFiveShootTime = Date.now();
                this.longTurretFiveWaitTime = this.utils.randint(25, 75);
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(18, 19), this.utils.randint(21, 27), this.bulletDamage + this.utils.randint(-15, -20), bulletList, this.bulletImage, {x: this.rect.x - 25, y: this.rect.y + 25, height: this.rect.height, width: this.rect.width}, 1);
            }
        } else if (timeElapsed > this.longTurretShootDuration) {
            this.longTurretShootDuration = null;
            this.basicShootWaitTime = Date.now();
            this.state = "closeIn";
        }
        return {x: 0, y: 0};
    }

    dashShot(bulletList) {
        const dashAttackTimeElapsed = Date.now() - this.dashAttackTime;
        const dashOneShootTimeElapsed = Date.now() - this.dashShootOneTime;
        const dashShootTwoTimeElapsed = Date.now() - this.dashShootTwoTime;
        const dashShootThreeTimeElapsed = Date.now() - this.dashShootThreeTime;

        // Checking to see if the enemy needs to wait
        if (dashAttackTimeElapsed < this.dashAttackWaitTime) return {x: 0, y: 0};

        // Getting DashMark if need be
        if (this.dashAttackMark == null) {
            this.dashAttackMark = [this.player.x + this.utils.randint(1, 75), this.player.y + this.utils.randint(1, 75)];
            if (this.dashAttackMark[0] < 0) this.dashAttackMark = [0, this.dashAttackMark[1]];
            else if (this.dashAttackMark[0] > this.canvas.width - this.rect.width) [this.canvas.width - this.rect.width, this.dashAttackMark[1]];
            if (this.dashAttackMark[1] < 0) this.dashAttackMark = [this.dashAttackMark[0], 0];
            else if (this.dashAttackMark[1] > this.canvas.height - this.rect.height) this.dashAttackMark = [this.dashAttackMark[0], this.canvas.height - this.rect.height];
            return {x: 0, y: 0};
        }

        // Checking to see if enemy is near its pont
        const distanceToMark = this.utils.getDistance([this.rect.x - (this.rect.width / 2), this.rect.y - (this.rect.height / 2)], this.dashAttackMark);
        if (distanceToMark < 76) {
            this.dashAttackMark = null;
            this.state = "closeIn"
            return {x: 0, y: 0};
        } else if (distanceToMark >= 76) {
            if (dashOneShootTimeElapsed > this.dashShootOneWaitTime) {
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(14, 16), this.utils.randint(14, 25), this.bulletDamage + this.utils.randint(-2, 5), bulletList, this.bulletImage, {x: this.rect.x - 15, y: this.rect.y - 15, height: this.rect.height, width: this.rect.width}, 1);
                this.dashShootOneWaitTime = this.utils.randint(125, 175);
                this.dashShootOneTime = Date.now();
            }
            if (dashShootTwoTimeElapsed > this.dashShootTwoWaitTime) {
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(14, 16), this.utils.randint(14, 25), this.bulletDamage + this.utils.randint(-2, 5), bulletList, this.bulletImage, {x: this.rect.x + 15, y: this.rect.y - 15, height: this.rect.height, width: this.rect.width}, 1);
                this.dashShootTwoWaitTime = this.utils.randint(125, 175);
                this.dashShootTwoTime = Date.now();
            }
            if (dashShootThreeTimeElapsed > this.dashShootThreeWaitTime) {
                this.basicShoot(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.utils.randint(14, 16), this.utils.randint(14, 25), this.bulletDamage + this.utils.randint(-2, 5), bulletList, this.bulletImage, {x: this.rect.x + 7, y: this.rect.y + 7, height: this.rect.height, width: this.rect.width}, 1);
                this.dashShootThreeWaitTime = this.utils.randint(125, 175);
                this.dashShootThreeTime = Date.now();
            }
            return this.specificMove(this.speed * 2, this.dashAttackMark)
        } else { return {x: 0, y: 0} }
    }

    AIBrain() {
        let newState;

        // Distance to Player
        let distanceToPlayer = this.utils.getDistance([this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2)], [this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2)]);

        if (this.state !== "quickTurretShoot" && this.state !== "dashShot" && this.state !== "longTurretShoot") {
            if (distanceToPlayer <= this.closeInDistance * 0.6) {
                newState = "run";
            } else if (distanceToPlayer <= this.closeInDistance) {
                newState = "steady";
            } else {
                newState = "closeIn";
            }

            if (this.utils.randint(1, 500) == 1) {
                newState = "quickTurretShoot";
                this.quickTurretShootTime = Date.now();
            }
            if (this.utils.randint(1, 600) == 1) {
                newState = "dashShot";
                this.dashShootTime = Date.now();
                this.dashAttackTime = Date.now();
            }
            if (this.utils.randint(1, 800) == 1) {
                newState = "longTurretShoot";
                this.longTurretShootTime = Date.now();
            }
        } else newState = this.state;
        return newState;
    }

    AIAction(player, rect, enemyBulletList) {
        // Changing State based on brain
        this.player = player;
        this.rect = rect;
        this.state = this.AIBrain(); console.log(this.state);
    
        // Normal Shoot When Spare Time
        if (this.state != "quickTurretShoot" && this.state != "dashShot" && this.state != "longTurretShoot") this.normalShoot(enemyBulletList);

        // AI Actions based on state
        if (this.state == "closeIn") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state == "run") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed * -1);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state == "steady") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 0.8) * this.runAwaySpeed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.y, movementVector.x];
        } else if (this.state == "quickTurretShoot") {
                // Calculate the movement vector
                const movementVector = this.quickTurretShoot(enemyBulletList);

                // Update the enemy position based on the movement vector
                return [movementVector.y, movementVector.x];
        } else if (this.state == "longTurretShoot") {
            // Calculate the movement vector
            const movementVector = this.longTurretShoot(enemyBulletList);

            // Update the enemy position based on the movement vector
            return [movementVector.y, movementVector.x];
        } else if (this.state == "dashShot") {
            // Calculate the movement vector
            const movementVector = this.dashShot(enemyBulletList);

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        }
        return [0, 0]
    }
}


export { 
    baseAI, 
    basicRedAI,
    mediumRedAI,
    complexRedAI,
    basicBlueAI,
    mediumBlueAI,
    complexBlueAI
};