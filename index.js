// Class Game, to handle all main game features
class Game {
    constructor() {
        // Create drawing variables (Our Game Canvas, Context, and Resolution)
        this.canvas = document.getElementById("game-canvas");
        this.c = this.canvas.getContext("2d");

        // Store the last timestamp for calculating time elapsed between frames
        this.lastTimestamp = 0;

        // Getting Delta Time to Start
        this.deltaTime = 0;

        //Utils
        this.utils = new Utils();

        // Creating Player Instance, and movement
        this.player = new Player(this.c, this.canvas, 100, 100);
        this.handleInput();

        //Creating Enemy Instance
        this.enemy = new Enemy(this.canvas, this.c, this.player);

        //Collisions
        this.collision = new Collision(this.player);

        // Starting Game
        this.gameLoop();
    }

    // Handling Player Movement
    handleInput() {
        // Keydown event
        window.addEventListener("keydown", (event) => {
            switch (event.keyCode) {
                case 65:
                    this.player.keysPressed.ALeft = true;
                    break;
                case 68:
                    this.player.keysPressed.DRight = true;
                    break;
                case 87:
                    this.player.keysPressed.WUp = true;
                    break;
                case 83:
                    this.player.keysPressed.SDown = true;
                    break;
            }
        });

        // Keyup event
        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 65:
                    this.player.keysPressed.ALeft = false;
                    break;
                case 68:
                    this.player.keysPressed.DRight = false;
                    break;
                case 87:
                    this.player.keysPressed.WUp = false;
                    break;
                case 83:
                    this.player.keysPressed.SDown = false;
                    break;
            }
        });
    }

    // Game Logic
    update() {
        //Player Move
        this.player.handleInput()
        
        //Player Collison
        this.collision.playerCollision(this.canvas);
}

    // Rendering Function to handle All rendering Needs
    render() {
        // Drawing Screen Background
        this.c.fillStyle = "rgb(45, 45, 45)";
        this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rendering Player
        this.player.render();
    }

    // The game loop function
    gameLoop(timestamp) {
        // Calculate time elapsed since the last frame
        this.deltaTime = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds

        /* Logic From Here */
        // Update game logic based on elapsed time
        this.update();

        // Render the game
        this.render();

        /* To Here */
        // Store the current timestamp for the next frame
        this.lastTimestamp = timestamp;

        // Request the next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Create an instance of the Game class
const game = new Game();
