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
            this.leftWeapons = await this.utils.getJson("gameData/leftWeapons.json");
        } catch (error) {
            throw error;
        }

        try {
            // Getting Right Weapons JSON File
            this.rightWeapons = await this.utils.getJson("gameData/rightWeapons.json");
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
    basicShoot(mouseX, mouseY, bulletSize, bulletSpeed, damage) {
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
        this.bullets.push({ rect: bulletDimensions, vector: bullet_vector, velocity: bulletSpeed, damage: this.utils.randint(damage.min, damage.max)});

        //Updating last shot time
        this.lastShotTime = Date.now();
    }
    
    
    leftShootClock(mouseX, mouseY) {
        //Getting Current Weapon's Shoot Clock
        let shootClock = this.currentWeapon.leftShoot["shootClock"];

        //Checking Elapsed Time
        const timeElapsed = Date.now() - this.lastShotTime;

        // Only allow shooting if at least 1000 milliseconds (1 second) have passed since the last shot
        if (timeElapsed >= shootClock) {
            this.basicShoot(mouseX, mouseY, this.currentWeapon.leftShoot["bulletSize"], this.currentWeapon.leftShoot["bulletSpeed"], {min: this.currentWeapon.leftShoot["damage"]["min"], max: this.currentWeapon.leftShoot["damage"]["max"]});
        } 
    }

    shotgunShoot(mouseX, mouseY, spread, damage, bulletSpeed, bulletSize, numberOfBullets) {
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
            });
        }

        // Updating last shot time
        this.lastShotgunTime = Date.now();
    }
    
    

    rightShootClock(mouseX, mouseY) {
        //Getting Current Weapon's Shoot Clock
        let shootClock = this.currentWeapon.rightShoot["shootClock"];
 
        //Checking Elapsed Time
        const timeElapsed = Date.now() - this.lastShotgunTime;

        if (timeElapsed >= shootClock) 
            this.shotgunShoot(mouseX, mouseY, this.currentWeapon.rightShoot["spread"], { min: this.currentWeapon.rightShoot["bullets"]["min"], max: this.currentWeapon.rightShoot["bullets"]["max"]}, this.mediumSlowBulletSpeed, this.mediumSmallBulletSize, this.utils.randint(8, 12));
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

    render() {
        //Player Bullets
        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet, index) => {
                this.c.drawImage(this.bulletImg, bullet.rect.x, bullet.rect.y, bullet.rect.width, bullet.rect.height);
            });
        }

        //Player
        this.c.drawImage(this.img, this.x, this.y, this.width, this.height);
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

        //Current Enemies
        this.basicEnemies = [];
        this.bossEnemies = [];

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
        //Validating Spawn Location
        while (true) {
            x = this.utils.randint(0, this.canvas.width - width)
            y = this.utils.randint(0, this.canvas.height - height)

            //Checking if the spawn location is within the range of the player
            if (x in Range(this.player.x - spawnAway, this.player.x + this.player.width + spawnAway) || y in Range(this.player.y - spawnAway, this.player.y + this.player.height + spawnAway)) {
                continue;
            } /* Checking to see if the enemy goes out of bounds */ else if (x + width > this.canvas.width || y + height > this.canvas.height) {
                continue;
            } else break;
        }
        //Returning the Position
        return (x, y);
    }

    spawnEnemy(specficPos, spawnAway, enemyType, AI) {
        // Getting Position of Enemy Spawn (If custom, set custom. If not, generate coords.)
        let x, y;
        if (specficPos[0] === null || specficPos[1] === null) {
            x, y = this.randomSpawn(enemyType["height"], enemyType["width"], spawnAway);
        } else { x = specficPos[0], y = specficPos[1]; }
        
        //Getting Enemy Stats & Image
        let enemyImg = new Image();
        enemyImg.src = enemyType["image"];

        let contactDamage = this.utils.randint(enemyType["contactDamage"]["min"], enemyType["contactDamage"]["max"]);
        let bulletDamage = this.utils.randint(enemyType["bulletDamage"]["min"], enemyType["bulletDamage"]["max"]);

        /* Enemy Array Structure:
            Image, X, Y, Enemy Rect (From JSON Info), Contact Damage, Bullet Damage, AI
        */
        this.basicEnemies.push([enemyImg, x, y, enemyType["rect"], contactDamage, bulletDamage, AI])
    }

    render() {
        if (this.basicEnemies.length !== 0){
            //Rendering Each enemy in the Array
            this.basicEnemies.forEach(enemy => {
                this.c.drawImage(enemy[0], enemy[1], enemy[2]["y"], enemy[2]["width"], enemy[2]["height"]);
            });
        }
        if (this.bossEnemies.length !== 0){
            //Rendering Each Boss in the Array
            this.bossEnemies.forEach(boss => {

            })
        }
    }
}

//Exporting the Player Class & Enemy Class to Game
export { Player, Enemy };