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
        this.utils = utils;
        this.collision = collision;

        // Initialization of rect
        this.rect = null; 
    }

    basicMove(pointA, speed) {
        // Getting Locations
        const pointAX = pointA[0];
        const pointAY = pointA[1];

        // Getting Vector movement, and return the result
        return new Vector2(pointAX, pointAY).normalize().scale(speed);
    }
}

// Red AI Classes
class basicRedAI extends baseAI {
    constructor(rect, HP, speed, contactDamage, bulletDamage) {
        // Call the constructor of the superclass
        super();

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
        const distanceToPlayer = this.utils.getDistance([this.rect.x + (this.width / 2), this.y + (this.height / 2)], [this.player.x, this.player.y]);

        if (distanceToPlayer < 120) {
            newState = "attack";
        } else {
            newState = "follow";
        }
        
        return newState;
    }

    AIAction() {
        // Changing State based on brain
        this.state = this.AIBrain();

        // AI Actions based on state
        if (this.state === "follow") {
            // Calculate the movement vector
            const movementVector = this.basicMove([this.player.x, this.player.y], this.speed);

            // Update the enemy position based on the movement vector
            this.rect.x += movementVector.x;
            this.rect.y += movementVector.y;
        }
    }
}

export { 
    baseAI, 
    basicRedAI 
};