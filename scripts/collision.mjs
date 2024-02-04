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

    wallCollision(canvas, enemyBullets) {
        //Checking Player Wall Collisions
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > canvas.width - this.player.width) this.player.x = canvas.width - this.player.width;
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > canvas.height - this.player.height) this.player.y = canvas.height - this.player.height;

        //Checking Bullet Collisions
        if (this.player.bullets.length > 0) {
            this.player.bullets.forEach(bullet => {
                if (bullet.rect.x < -20 || bullet.rect.x > canvas.width - bullet.rect.width + 20 ||
                    bullet.rect.y < -20 || bullet.rect.y > canvas.height - bullet.rect.height + 20) {
                    // Remove the bullet from the array
                    this.player.bullets.splice(this.player.bullets.indexOf(bullet), 1);
                }
            });
        }
        enemyBullets.forEach(bullet => {
            if (bullet.rect.x < -100 || bullet.rect.x > canvas.width - bullet.rect.width + 100 ||
                bullet.rect.y < -100 || bullet.rect.y > canvas.height - bullet.rect.height + 100) {
                // Remove the bullet from the array
                enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
            }
        });
    }

    enemyWallCollision(basicEnemyList, canvas) {
        if (basicEnemyList.length > 0) {
            basicEnemyList.forEach(enemy => {
                if (enemy[1].x < 0) enemy[1].x = 0;
                else if ((enemy[1].x + enemy[1].width )> canvas.width) enemy[1].x = (canvas.width - enemy[1].width);

                if (enemy[1].y < 0) enemy[1].y = 0;
                else if ((enemy[1].y + enemy[1].height) > canvas.height) enemy[1].y = (canvas.height - enemy[1].height - 1);
            });
        }
    }


    playerBulletCollision() {
        // Dealing Damage to the enemy if it hits
        if (this.enemy.basicEnemies.length > 0 && this.player.bullets.length > 0) {
            this.enemy.basicEnemies.forEach(enemy => {
                this.player.bullets.forEach(bullet => {
                    if (this.utils.rectIntersect(bullet.rect, enemy[1])) {
                        enemy[2][0] -= bullet.damage;
                        this.player.bullets.splice(this.player.bullets.indexOf(bullet), 1);
                    }
                });
            });

        }
        
    }

    enemyBulletCollision(bulletList, player) {
        this.player = player;
        // Dealing Damage to the enemy if it hits
        if (bulletList.length > 0) {
            bulletList.forEach(bullet => {
            if (this.utils.rectIntersect(bullet.rect, {x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height})) {
                this.player.health -= bullet.damage; 
                bulletList.splice(bulletList.indexOf(bullet), 1); 
            }
            });
        } 
    }

    enemyHitboxCollision() {
        if (this.enemy.basicEnemies.length > 0) {
            this.enemy.basicEnemies.forEach(enemy => {
                if (this.utils.rectIntersect({width: enemy[1].width, height: enemy[1].height, x: enemy[1].x, y: enemy[1].y}, {width: this.player.width, height: this.player.height, x: this.player.x, y: this.player.y})) {
                    this.player.health -= enemy[4];
                    
                    // Calculating Player Contact Damage
                    let maxLeftDamage;
                    let maxRightDamage;
                    if (this.player.currentWeapon.leftShoot["type"] === "shotgun") {
                        maxLeftDamage = (this.player.currentWeapon.leftShoot["bullets"]["max"] * this.player.currentWeapon.leftShoot["damage"]["max"]);
                    } else if (this.player.currentWeapon.leftShoot["type"] === "shoot") {
                        maxLeftDamage = this.player.currentWeapon.leftShoot["damage"]["max"];
                    } else maxLeftDamage = 0;
                    if (this.player.currentWeapon.rightShoot["type"] === "shotgun") {
                        maxRightDamage = (this.player.currentWeapon.rightShoot["bullets"]["max"] * this.player.currentWeapon.rightShoot["damage"]["max"]);
                    } else if (this.player.currentWeapon.rightShoot["type"] === "shoot") {
                        maxRightDamage = this.player.currentWeapon.rightShoot["damage"]["max"];
                    } else maxRightDamage = 0;
                    enemy[2][0] -= 2 * (maxLeftDamage + maxRightDamage);
                }
            });
        }
    }
}

//Exporting To the Game Class
export { Collision };