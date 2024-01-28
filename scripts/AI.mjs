// Imports
import { Player } from "./entities.mjs";
import { Enemy } from "./entities.mjs";
import Utils from "./utils.mjs";
import Vector2 from "./vector.mjs";
import { Collision } from "./collision.mjs";

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
}

// Red AI Classes
class basicRedAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage) {
        // Call the constructor of the superclass
        super();
        this.player = null;

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

    AIAction(player, rect) {
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
    constructor(rect, HP, speed, contactDamage, bulletDamage) {
        // Call the constructor of the superclass
        super();
        this.player = null;

        // Basic Info
        this.rect = rect;
        this.speed = speed;
        this.HP = HP;
        this.contactDamage = contactDamage;
        this.bulletDamage = bulletDamage;

        // Time Stamps
        this.lastDashTime = 0;
        this.dashWaitTime = 0;

        // Target Positions
        this.targetPosition = [0, 0];

        // State Information
        this.state = "follow";
        this.dashState = "stop"
        this.dashMark = [0, 0];
    }

    AIBrain() {
        let newState;

        // Calculating Distance to player
        let distanceToPlayer = this.utils.getDistance([this.player.x, this.player.y], [this.rect.x, this.rect.y])

        // Chancging Speed Based on Distance
        if (distanceToPlayer <= 250) {
            newState = "attack1";
        } else if (distanceToPlayer <= 1000) {
            newState = "attack2";
        } else if (distanceToPlayer <= 2000) {
            newState = "attack3";
        } else {
            newState = "follow";
        }

        // Setting Up Dash Chance
        
        if (distanceToPlayer <= 2000 && this.lastDashTime >= 10000 && this.state != "dash" && this.utils.randint(1, 3000) == 1) newState = "dash"

        return newState;
    }

    dashLogic() {
        
    }

    AIAction(player, rect) {
        // Resetting Values
        this.player = player;
        this.rect = rect;

        // Getting State
        this.state = this.AIBrain()

        // AI Actions based on state
        if (this.state === "follow") {
            // Calculate the movement vector
            const movementVector = this.basicMove(this.speed);
    
            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack1") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.25));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack2") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.15));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "attack3") {
            // Calculate the movement vector
            const movementVector = this.basicMove((this.speed * 1.05));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        } else if (this.state === "dash") {
            // Calculate the movement vector
            const movementVector = this.dashLogic((this.speed));

            // Update the enemy position based on the movement vector
            return [movementVector.x, movementVector.y];
        }
    }
}

export { 
    baseAI, 
    basicRedAI,
    mediumRedAI
};