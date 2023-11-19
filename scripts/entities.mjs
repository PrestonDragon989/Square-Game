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
        this.fastShootSpeed = 15;
        this.mediumFastShootSpeed = 13;
        this.normalShootSpeed = 10;
        this.mediumSlowShootSpeed = 7;
        this.slowShootSpeed = 5;

        //Shoot Speeds


        //Bullets Active
        this.bullets = [];

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

            //Current Weapon
            leftShoot: "basicShoot",
            rightShoot: "mediumShotgun"
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
    basicShoot(mousePos) {
        //Getting Player Center, mouseclick Coords
        let playerCenterX = this.x + 25
        let playerCenterY = this.y + 25

        let mouseClickX = mousePos[0]
        let mouseClickY = mousePos[1]

        //Redining Into Librarys for Ease of use in the code
        const player_pos = { x: playerCenterX, y: playerCenterY};
        const mouse_pos = { x: mouseClickX, y: mouseClickY };

        // Making bullet Dimensions 
        const bullet_rect = {
            x: player_pos.x,
            y: player_pos.y,
            width: this.mediumBulletSize,
            height: this.mediumBulletSize
        };

        // Getting bullet location
        const bullet_vector = new Vector2(mouse_pos.x - player_pos.x, mouse_pos.y - player_pos.y);
        bullet_vector.normalize();

    // Adding bullet to the bullet list
    this.bullets.push({ rect: bullet_rect, vector: bullet_vector, color: this.bullet_color });

    }

    render() {
        //Player Bullets
        

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