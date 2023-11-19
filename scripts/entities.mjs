
//Entities
class Player {
    constructor(c, canvas, x, y) {
        //Getting Context and Canvas
        this.c = c;
        this.canvas = canvas;

        //Utils
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

        //Player Keys
        this.keysPressed = {
            ALeft: false,
            DRight: false,
            WUp: false,
            SDown: false,
        };
    }

    //Handling Player Inputs
    handleInput() {
        if (this.keysPressed.ALeft) this.x -= this.speed;
        if (this.keysPressed.DRight) this.x += this.speed;
        if (this.keysPressed.WUp) this.y -= this.speed;
        if (this.keysPressed.SDown) this.y += this.speed;
        
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
        if (this.basicEnemies != []){
            //Rendering Each enemy in the Array
            this.basicEnemies.forEach(enemy => {

            });
        }
        if (this.bossEnemies != []){
            //Rendering Each Boss in the Array
            this.bossEnemies.forEach(boss => {

            })
        }
    }
}

//Exporting the Player Class & Enemy Class to Game
export { Player, Enemy };