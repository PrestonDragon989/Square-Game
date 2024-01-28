//Utils & Vectors
import Utils from './utils.mjs';
import Vector2 from "./vector.mjs";

//Entities
class Player {
    constructor(c, canvas, x, y) {
        //Getting Context and Canvas
        this.c = c;
        this.canvas = canvas;

        //Getting Utils
        this.utils = new Utils();
        
        //Getting Coordinates
        this.x = x;
        this.y = y;

        //Player width and height
        this.width = 50;
        this.height = 50;

        //Player Image
        this.img = new Image();
        this.img.src = "images/entities/player/player-square.png";

        // HP Bar Image
        this.healthBar = new Image();
        this.healthBar.src = "images/misc/health-bar.png";

        //Player Health Stats
        this.maxHealth = 100;
        this.health = 100;

        //Player Speed
        this.speed = 5;

        //Bullet Image
        this.bulletImg = new Image();
        this.bulletImg.src = "images/entities/player/player-bullet.png";

        // Loading Weapons
        this.loadWeapons();


        // Last Shot Times
        this.lastShotTime = 0;
        this.lastShotgunTime = 0;

        //Bullets Active
        this.bullets = [];

        //Current Weapon
        this.currentWeapon = {
            //Current Weapon
            leftShoot: null,
            rightShoot: null
        };

        //Player Keys
        this.keysPressed = {
            //WASD Movement
            ALeft: false,
            DRight: false,
            WUp: false,
            SDown: false,

            //Arrow Keys Movement
            left: false,
            right: false,
            up: false,
            down: false,
        };
    }

    async loadWeapons() {
        try {
            // Getting Left Weapons JSON File
            this.playerWeapons = await this.utils.getJson("gameData/playerWeapons.json");
        } catch (error) {
            throw error;
        }
    }

    //Handling Player Inputs
    handleInput() {
        if (this.keysPressed.ALeft || this.keysPressed.left) this.x -= this.speed;
        if (this.keysPressed.DRight || this.keysPressed.right) this.x += this.speed;
        if (this.keysPressed.WUp || this.keysPressed.up) this.y -= this.speed;
        if (this.keysPressed.SDown || this.keysPressed.down) this.y += this.speed; 
    }

    //Shoot Function
    basicShoot(mouseX, mouseY, bulletSize, bulletSpeed, damage, target) {
        //Getting Player Center, mouseclick Coords
        let playerCenterX = this.x + 25
        let playerCenterY = this.y + 25

        let mouseClickX = mouseX
        let mouseClickY = mouseY

        //Redining Into Librarys for Ease of use in the code
        const player_pos = { x: playerCenterX, y: playerCenterY};
        const mouse_pos = { x: mouseClickX, y: mouseClickY };

        // Making bullet Dimensions 
        const bulletDimensions = {
            x: player_pos.x,
            y: player_pos.y,
            width: bulletSize,
            height: bulletSize
        };

        // Getting bullet location
        const bullet_vector = new Vector2(mouse_pos.x - player_pos.x, mouse_pos.y - player_pos.y);
        bullet_vector.normalize();

        // Adding bullet to the bullet list
        this.bullets.push({ rect: bulletDimensions, vector: bullet_vector, velocity: bulletSpeed, damage: this.utils.randint(damage.min, damage.max), target});
    }
    
    
    leftShootClock(mouseX, mouseY) {
        // Getting Current Weapon's Shoot Clock
        let shootClock = this.currentWeapon.leftShoot["shootClock"];
    
        // Checking Elapsed Time
        const timeElapsed = Date.now() - this.lastShotTime;
    
        // Only allow shooting if at least 1000 milliseconds (1 second) have passed since the last shot
        if (timeElapsed >= shootClock) {
            if (this.currentWeapon.leftShoot["type"] == "shotgun") {
                this.shotgunShoot(mouseX, mouseY, this.currentWeapon.leftShoot["spread"], {
                    min: this.currentWeapon.leftShoot["damage"]["min"],
                    max: this.currentWeapon.leftShoot["damage"]["max"]
                }, this.currentWeapon.leftShoot["bulletSpeed"], this.currentWeapon.leftShoot["bulletSize"], this.utils.randint(this.currentWeapon.leftShoot["bullets"]["min"], this.currentWeapon.leftShoot["bullets"]["max"]), 1);
            } else {
                this.basicShoot(mouseX, mouseY, this.currentWeapon.leftShoot["bulletSize"], this.currentWeapon.leftShoot["bulletSpeed"], {
                    min: this.currentWeapon.leftShoot["damage"]["min"],
                    max: this.currentWeapon.leftShoot["damage"]["max"]
                }, 1);
            }
            this.lastShotTime = Date.now();
        }
    }

    shotgunShoot(mouseX, mouseY, spread, damage, bulletSpeed, bulletSize, numberOfBullets, target) {
        // Getting Player Center, mouse click Coords
        let playerCenterX = this.x + 25;
        let playerCenterY = this.y + 25;

        // Redefining Into Libraries for Ease of use in the code
        const player_pos = { x: playerCenterX, y: playerCenterY };
        const mouse_pos = { x: mouseX, y: mouseY };

        // Calculate the angle between player and mouse
        const angleToMouse = Math.atan2(mouse_pos.y - player_pos.y, mouse_pos.x - player_pos.x);

        // Convert spread from degrees to radians
        const spreadRadians = spread * (Math.PI / 180);

        // Calculate the angle increment based on the number of bullets
        const angleIncrement = spreadRadians / (numberOfBullets - 1);

        if (isNaN(angleToMouse) || isNaN(angleIncrement)) {
            console.error("Invalid angle values. Aborting shotgunShoot.");
            return;
        }

        // Loop through the specified number of bullets
        for (let i = 0; i < numberOfBullets; i++) {
            // Calculate the angle for the current bullet
            const angle = angleToMouse - spreadRadians / 2 + i * angleIncrement;

            // Making bullet Dimensions
            const bulletDimensions = {
                x: player_pos.x,
                y: player_pos.y,
                width: bulletSize,
                height: bulletSize,
            };

            // Convert polar coordinates to Cartesian coordinates
            const bullet_vector = new Vector2(Math.cos(angle), Math.sin(angle));

            // Adding bullet to the bullet list
            this.bullets.push({
                rect: bulletDimensions,
                vector: bullet_vector,
                velocity: bulletSpeed,
                damage: this.utils.randint(damage.min, damage.max),
                target
            });
        }
    }
    
    

    rightShootClock(mouseX, mouseY) {
        //Getting Current Weapon's Shoot Clock
        let shootClock = this.currentWeapon.rightShoot["shootClock"];
 
        //Checking Elapsed Time
        const timeElapsed = Date.now() - this.lastShotgunTime;

        if (timeElapsed >= shootClock) {
           if (this.currentWeapon.rightShoot["type"] == "shotgun") this.shotgunShoot(mouseX, mouseY, this.currentWeapon.rightShoot["spread"], { min: this.currentWeapon.rightShoot["damage"]["min"], max: this.currentWeapon.rightShoot["damage"]["max"]}, this.currentWeapon.rightShoot["bulletSpeed"], this.currentWeapon.rightShoot["bulletSize"], this.utils.randint(this.currentWeapon.rightShoot["bullets"]["min"], this.currentWeapon.rightShoot["bullets"]["max"]), 1);
           else this.basicShoot(mouseX, mouseY, this.currentWeapon.rightShoot["bulletSize"], this.currentWeapon.rightShoot["bulletSpeed"], {min: this.currentWeapon.rightShoot["damage"]["min"], max: this.currentWeapon.rightShoot["damage"]["max"]}, 1);
           this.lastShotgunTime = Date.now();
        }
    }

    //Player Shoot
    playerLeftShoot(mouseX, mouseY) {
        this.leftShootClock(mouseX, mouseY);
    }

    playerRightShoot(mouseX, mouseY) {
        this.rightShootClock(mouseX, mouseY);
    }

    // Bullet movement function
    bulletMovement() {
        if (this.bullets.length <= 0) return;
    
        for (const bullet of this.bullets) {
            bullet.rect.x += bullet.vector.x * bullet.velocity;
            bullet.rect.y += bullet.vector.y * bullet.velocity;
        }
  }

    //Rendering Functions
    playerRender() {
        //Player
        this.c.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    bulletRender() {
        //Player Bullets
        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet, index) => {
                this.c.drawImage(this.bulletImg, bullet.rect.x, bullet.rect.y, bullet.rect.width, bullet.rect.height);
            });
        }

        // Drawing Background HP Bar
        this.c.drawImage(this.healthBar, 0, 480, 600, 576, this.x - (this.width * .2), this.y + (this.width + 10), (this.width * 1.40), 40);

        // Drawing Current HP Bar
        let HPPercent = this.utils.calcPercentage(this.health, this.maxHealth);
        if (HPPercent > 80) this.c.drawImage(this.healthBar, 0, 0, 600, 96, this.x - (this.width * .2), this.y + (this.height + 10), ((this.width * 1.40))  * (0.01 * HPPercent), 7.2);
        else if (HPPercent > 60) this.c.drawImage(this.healthBar, 0, 96, 600, 96, this.x - (this.width * .2), this.y + (this.height + 10), ((this.width * 1.40))  * (0.01 * HPPercent), 7.2);
        else if (HPPercent > 40) this.c.drawImage(this.healthBar, 0, 192, 600, 96, this.x - (this.width * .2), this.y + (this.height + 10), ((this.width * 1.40))  * (0.01 * HPPercent), 7.2);
        else if (HPPercent > 20) this.c.drawImage(this.healthBar, 0, 288, 600, 96, this.x - (this.width * .2), this.y + (this.height + 10), ((this.width * 1.40))  * (0.01 * HPPercent), 7.2);
        else if (HPPercent > 0) this.c.drawImage(this.healthBar, 0, 384, 600, 96, this.x - (this.width * .2), this.y + (this.height + 10), ((this.width * 1.40))  * (0.01 * HPPercent), 7.2);
    }
}


//Enemies
class Enemy {
    constructor(canvas, c, Player) {
        //Canvas and Context
        this.canvas = canvas;
        this.c = c;

        //Utils
        this.utils = new Utils();

        //Player
        this.player = Player;

        // Enemy Data
        this.basicEnemyData = null;
        this.bossEnemyData = null;

        //Current Enemies
        this.basicEnemies = [];
        this.bossEnemies = [];

        // Load Enemy Health Bar
        this.healthBar = new Image();
        this.healthBar.src = "images/misc/health-bar.png";

        //Load Enemy Data
        this.loadEnemies()
    }

    async loadEnemies() {
        try {
            // Getting Enemies JSON File
            this.basicEnemyData = await this.utils.getJson("gameData/basicEnemies.json");
        } catch (error) {
            throw error;
        }
    }
    
    //Easy Functions for Enemies
    randomSpawn(width, height, spawnAway) {
        let x, y;
        let quit = 0
    
        while (true) {
            x = this.utils.randint(0, this.canvas.width - width);
            y = this.utils.randint(0, this.canvas.height - height);
    
            // Calculate enemy rectangle
            const enemyRect = {
                x: x,
                y: y,
                width: width,
                height: height
            };
    
            // Check if the enemy's rectangle intersects with the player's rectangle
            const playerRect = {
                x: this.player.x - spawnAway,
                y: this.player.y - spawnAway,
                width: this.player.width + spawnAway + spawnAway,
                height: this.player.height + spawnAway + spawnAway
            };
    
            if (!this.utils.rectIntersect(enemyRect, playerRect) &&
                x + width <= this.canvas.width && y + height <= this.canvas.height) {
                break;
            } else if (quit == 40) {
                return [null, null];
            } else quit++;
        }
    
        //Returning the Position
        return [x, y];
    }
    

    spawnEnemy(specficPos, spawnAway, enemyType, HPBar, AI = null) {
        // Getting Position of Enemy Spawn (If custom, set custom. If not, generate coords.)
        let x, y;
    
        // Assign values to x and y
        if (specficPos[0] == null) {
            // Generate random spawn coordinates
            let spawn = this.randomSpawn(enemyType["rect"]["width"], enemyType["rect"]["height"], spawnAway);
            x = spawn[0];
            y = spawn[1];
            // Setting Up for a quit to happen if there is no legal squares
            if (x == null || y == null) {
                console.log(spawnAway);
                return;
            }
        } else {
            // Use specified coordinates
            x = specficPos[0];
            y = specficPos[1];
        }
    
        // Getting Enemy Stats & Image
        let enemyImg = new Image();
        enemyImg.src = enemyType["image"];
    
        let contactDamage = this.utils.randint(enemyType["contactDamage"]["min"], enemyType["contactDamage"]["max"]);
        let bulletDamage = this.utils.randint(enemyType["bulletDamage"]["min"], enemyType["bulletDamage"]["max"]);

        // Current & Max HP  [Current, Max]
        let newHP = this.utils.randint(enemyType["HP"]["min"], enemyType["HP"]["max"]);
        let HP = [newHP, newHP];

        // Getting Enemy Speed
        let speed = this.utils.randint(enemyType["speed"]["min"], enemyType["speed"]["max"]);

        // Getting Rect
        let rect = { 
            x: x,
            y: y,
            width: enemyType["rect"]["width"],
            height: enemyType["rect"]["height"]
        }

        // HP Bar Validation
        if (HPBar[0] == true) {
            HPBar = [true, enemyType["rect"]["width"] * .80, 12.5]
        }

        // Getting Enemy AI
        let enemyAI
        if (AI != null) enemyAI = this.utils.convertAI(AI, rect, HP, speed, contactDamage, bulletDamage);
        else enemyAI = null;
        
        /* Enemy Array Structure:
            Image, Enemy Rect (From JSON Info), HP, Speed, Contact Damage, Bullet Damage, AI, HP Bar
        */
        this.basicEnemies.push([enemyImg, rect, HP, speed, contactDamage, bulletDamage, enemyAI, HPBar]);
    }
    
    checkDeath() {
        this.basicEnemies.forEach(enemy => {
            if (enemy[2][0] <= 0) { // Checking Current HP
                this.basicEnemies.splice(this.basicEnemies.indexOf(enemy), 1); // Killing it off
            }
        });
    }

    updateAI() {
        if (this.basicEnemies.length > 0) {
            this.basicEnemies.forEach(enemy => {
                if (enemy[6] != null) {    
                    const movement = enemy[6].AIAction(this.player, enemy[1]);
                    
                    enemy[1].x += movement[0];
                    enemy[1].y += movement[1];
                }
            });
        }
    }
    
    render() {
        if (this.basicEnemies.length !== 0) {
            // Rendering Each enemy in the Array
            this.basicEnemies.forEach(enemy => {
                this.c.drawImage(enemy[0], enemy[1]["x"], enemy[1]["y"], enemy[1]["width"], enemy[1]["height"]);

                // Rendering HP Bar if need be
                if (enemy[7][0]) {
                    // Drawing Background HP Bar
                    this.c.drawImage(this.healthBar, 0, 480, 600, 576, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), (enemy[1]["width"] * 1.20), 40);

                    // Drawing Current HP Bar
                    let HPPercent = this.utils.calcPercentage(enemy[2][0], enemy[2][1]);
                    if (HPPercent > 80) this.c.drawImage(this.healthBar, 0, 0, 600, 96, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), ((enemy[1]["width"] * 1.20))  * (0.01 * HPPercent), 7.2);
                    else if (HPPercent > 60) this.c.drawImage(this.healthBar, 0, 96, 600, 96, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), ((enemy[1]["width"] * 1.20))  * (0.01 * HPPercent), 7.2);
                    else if (HPPercent > 40) this.c.drawImage(this.healthBar, 0, 192, 600, 96, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), ((enemy[1]["width"] * 1.20))  * (0.01 * HPPercent), 7.2);
                    else if (HPPercent > 20) this.c.drawImage(this.healthBar, 0, 288, 600, 96, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), ((enemy[1]["width"] * 1.20))  * (0.01 * HPPercent), 7.2);
                    else if (HPPercent > 0) this.c.drawImage(this.healthBar, 0, 384, 600, 96, enemy[1]["x"] - (enemy[1]["width"] * .1), enemy[1]["y"] + (enemy[1]["height"] + 10), ((enemy[1]["width"] * 1.20))  * (0.01 * HPPercent), 7.2);
                }
            });
        }
        if (this.bossEnemies.length !== 0) {
            // Rendering Each Boss in the Array
            this.bossEnemies.forEach(boss => {
                // Render boss logic goes here
            });
        }
    }
    
}

//Exporting the Player Class & Enemy Class to Game
export { Player, Enemy };