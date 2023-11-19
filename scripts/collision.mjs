//Collision Handling
class Collision {
    constructor(Player) {
        //Getting Player
        this.player = Player;

        //Utils
        this.utils = new Utils();
    }

    playerCollision(canvas) {
        //Checking Wall Collisions
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > canvas.width - this.player.width) this.player.x = canvas.width - this.player.width;
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > canvas.height - this.player.height) this.player.y = canvas.height - this.player.height;
    }
}

//Exporting To the Game Class
export { Collision };