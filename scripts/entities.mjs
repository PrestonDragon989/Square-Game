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
        this.bulletImg.src = "images/entities/player/player-square.png";

        //Bullet Sizes
        this.largeBulletSize = 20;
        this.bigBulletSize = 15;
        this.mediumBulletSize = 10;
        this.smallBulletSize = 5;

        //Bullet Speeds
        this.fastBulletSpeed = 20;
        this.mediumFastBulletSpeed = 15;
        this.mediumBulletSpeed = 10;
        this.mediumSlowBulletSpeed = 7;
        this.slowBulletSpeed = 5;

        //Shoot Clocks
        this.basicShootClock = 200;
        this.quickShootClock = 100;
        this.slowShootClock = 500;
        this.sniperShootClock = 2000;

        this.mediumShotgunClock = 1500;
        this.bigShotgunClock = 1000;
        this.hugeShotgunClock = 2000;
        this.smallShotgunClock = 1000

        this.lastShotTime = 0;

        //Bullets Active
        this.bullets = [];

        //Current Weapon
        this.currentWeapon = {
            //Current Weapon
            leftShoot: "basicShoot",
            rightShoot: "mediumShotgun"
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

    //Handling Player Inputs
    handleInput() {
        if (this.keysPressed.ALeft || this.keysPressed.left) this.x -= this.speed;
        if (this.keysPressed.DRight || this.keysPressed.right) this.x += this.speed;
        if (this.keysPressed.WUp || this.keysPressed.up) this.y -= this.speed;
        if (this.keysPressed.SDown || this.keysPressed.down) this.y += this.speed; 
    }

    //Shoot Functions
    basicShoot(mouseX, mouseY) {
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
            width: this.mediumBulletSize,
            height: this.mediumBulletSize
        };

        // Getting bullet location
        const bullet_vector = new Vector2(mouse_pos.x - player_pos.x, mouse_pos.y - player_pos.y);
        bullet_vector.normalize();

        // Adding bullet to the bullet list
        this.bullets.push({ rect: bulletDimensions, vector: bullet_vector, velocity: this.mediumBulletSpeed, damage: this.utils.randint(15, 20)});

        //Updating last shot time
        this.lastShotTime = Date.now();
    }
    leftShootClock(mouseX, mouseY) {
        //Getting Current Weapon's Shoot Clock
        let shootClock;
        if (this.currentWeapon.leftShoot === "basicShoot") shootClock = this.basicShootClock;
        else if (this.currentWeapon.leftShoot === "quickShoot") shootClock = this.quickShootClock;
        else if (this.currentWeapon.leftShoot === "slowShoot") shootClock = this.slowShootClock;
        else if (this.currentWeapon.leftShoot === "sniperShoot") shootClock = this.sniperShootClock;

        //Checking Elapsed Time
        const timeElapsed = Date.now() - this.lastShotTime;

        // Only allow shooting if at least 1000 milliseconds (1 second) have passed since the last shot
        if (timeElapsed >= shootClock) {
            if (this.currentWeapon.leftShoot === "basicShoot") this.basicShoot(mouseX, mouseY)
            else if (this.currentWeapon.leftShoot === "quickShoot") this.quickShoot(mouseX, mouseY)
            else if (this.currentWeapon.leftShoot === "slowShoot") this.slowShoot(mouseX, mouseY)
            else if (this.currentWeapon.leftShoot === "sniperShoot") this.sniperShoot(mouseX, mouseY)
        } else {
            console.log("Wait before shooting again!");
            // You can add an alert or some visual indication here
        }
    }

    //Player Shoot
    playerLeftShoot(mouseX, mouseY) {
        this.leftShootClock(mouseX, mouseY)
    }

    playerRightShoot(mouseX, mouseY) {
        if (this.currentWeapon.leftShoot === "mediumShotgun") this.mediumShotgun(mouseX, mouseY)
        else if (this.currentWeapon.leftShoot === "bigShotgun") this.bigShotgun(mouseX, mouseY)
        else if (this.currentWeapon.leftShoot === "hugeShotgun") this.hugeShotgun(mouseX, mouseY)
        else if (this.currentWeapon.leftShoot === "smallShotgun") this.smallShotgun(mouseX, mouseY)
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
            this.bullets.forEach((bullet) => {
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

        //Enemy Images
        this.basicRedEnemyImg = {
            //Red Enemies
            "small-red": "images/entities/enemies/basicRedEnemies/small-red-enemy.png",
            "medium-red": "images/entities/enemies/basicRedEnemies/medium-red-enemy.png",
            "complex-red": "images/entities/enemies/basicRedEnemies/complex-red-enemy.png",

            //Maroon Enemies
            "small-maroon": "images/entities/enemies/basicRedEnemies/small-maroon-enemy.png",
            "medium-maroon": "images/entities/enemies/basicRedEnemies/medium-maroon-enemy.png",
            "complex-maroon": "images/entities/enemies/basicRedEnemies/complex-maroon-enemy.png",
                        
            //Dark Red Enemies
            "small-darkRed": "images/entities/enemies/basicRedEnemies/small-dark-enemy.png",
            "medium-darkRed": "images/entities/enemies/basicRedEnemies/medium-dark-enemy.png",
            "complex-darkRed": "images/entities/enemies/basicRedEnemies/complex-dark-enemy.png",
        };
        this.bossEnemyImg = {
            "purple-summoner": "images/entities/enemies/bosses/purple-summoner.png",
        };

        //Current Enemies
        this.basicEnemies = [];
        this.bossEnemies = [];
    }
    
    //Easy Functions for Enemies
    randomSpawn(width, height, spawnAway) {
        let x, y;
        //Validating Spawn Location
        while (true) {
            x = this.utils.randint(0, this.canvas.width - width)
            y = this.utils.randint(0, this.canvas.height - height)
            break;
        }
        //Returning the Position
        return (x, y);
    }

    render() {
        if (this.basicEnemies.length !== 0){
            //Rendering Each enemy in the Array
            this.basicEnemies.forEach(enemy => {

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