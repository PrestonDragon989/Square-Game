//Utils & Vectors
import { Enemy } from './entities.mjs';
import Utils from './utils.mjs';
import Vector2 from "./vector.mjs";

//Collision Handling
class Collision {
    constructor(Player, Enemy) {
        //Getting Player & Enemies
        this.player = Player;
        this.enemy = Enemy;

        //Utils
        this.utils = new Utils();
    }

    wallCollision(canvas) {
        //Checking Player Wall Collisions
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > canvas.width - this.player.width) this.player.x = canvas.width - this.player.width;
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > canvas.height - this.player.height) this.player.y = canvas.height - this.player.height;

        //Checking Player Bullet Collisions
        if (this.player.bullets.length > 0) {
            this.player.bullets.forEach(bullet => {
                if (bullet.rect.x < -20 || bullet.rect.x > canvas.width - bullet.rect.width + 20 ||
                    bullet.rect.y < -20 || bullet.rect.y > canvas.height - bullet.rect.height + 20) {
                    // Remove the bullet from the array
                    this.player.bullets.splice(this.player.bullets.indexOf(bullet), 1);
                }
            });
        }
    }

    bulletCollision() {
        // Dealing Damage to the enemy if it hits
        if (this.enemy.basicEnemies.length > 0 && this.player.bullets.length > 0) {
            this.enemy.basicEnemies.forEach(enemy => {
                this.player.bullets.forEach(bullet => {
                    if (this.utils.rectIntersect(bullet.rect, enemy[1]) && bullet[-1] == 1) {
                        enemy[2][0] -= bullet.damage;
                        this.player.bullets.splice(this.player.bullets.indexOf(bullet), 1);
                    }
                });
            });

        }
        
    }
}

//Exporting To the Game Class
export { Collision };