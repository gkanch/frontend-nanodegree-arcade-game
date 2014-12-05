var MAX_X = 505,
    MAX_Y = 606,
    ENEMY_SPEEDS = [150, 200, 250, 300, 350, 500, 650, 700, 1000],
    ENEMY_Y_POSITIONS = [72, 154, 236, 318],
    PLAYER_X = MAX_X / 5 * 2,
    PLAYER_Y = 400, //y-locations:-10,72,154,236,318,400;
    PLAYER_LIVES = 3;

// define template for all characters
var Character = function (sprite) {
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    //this.speed = 200; //default speed
};

// Draw the enemy on the screen, required method for game
Character.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Character.prototype.update = function () { };

// Enemies that Player must avoid (implement using inheritance)
var Enemy = function (sprite) {
    Character.call(this, sprite); //delegate failed calls to Character object

    // Variables applied to each of our instances go here, we've provided one for you to get started
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = ENEMY_SPEEDS[Math.floor(Math.random() * ENEMY_SPEEDS.length)];
    this.x = -60;
    this.y = ENEMY_Y_POSITIONS[Math.floor(Math.random() * ENEMY_Y_POSITIONS.length)];
};
Enemy.prototype = Object.create(Character.prototype); //create Enemy based on Character object
Enemy.prototype.constructor = Enemy; //redirect constructor to point to current object

// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // multiply any movement by the dt parameter
    // to ensure the game runs at the same speed for all computers.

    // restart from starting point when Enemy reaches the end
    if (this.x > MAX_X) {
        this.x = -60;
        this.y = ENEMY_Y_POSITIONS[Math.floor(Math.random() * ENEMY_Y_POSITIONS.length)];
        this.speed = ENEMY_SPEEDS[Math.floor(Math.random() * ENEMY_SPEEDS.length)];
    }
    this.x = this.x + this.speed * dt;
}

//Enemy.prototype.render = function () {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//}

// player class
var Player = function (sprite) {
    Character.call(this, sprite);

    this.sprite = 'images/char-boy.png';
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
}
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// check collision between player and enemies
Player.prototype.checkCollision = function () {
    var isCollided = false;
    for (var index in allEnemies) {
        if ((Math.abs(allEnemies[index].x - this.x) < 50) && allEnemies[index].y === this.y) {
            isCollided = true;
            break;
        }
    }
    return isCollided;
}

Player.prototype.update = function (dt) {
    // check for Collision
    if (this.checkCollision() === true) {
        this.x = PLAYER_X;
        this.y = PLAYER_Y;

        // TODO - player has one less life
        console.log("reset");
    }
}

//Player.prototype.render = function () {
//    ctx.drawImage(Resources.get(player.sprite), player.x, player.y);
//}

Player.prototype.handleInput = function (key) {
    // x-positions: 0,101,202,303,404
    // y-positions: -10,72,154,236,318,400
    switch (key) {
        case "up":
            if (this.y > -10) {
                this.y -= 82;
            }
            break;
        case "down":
            if (this.y < 400) {
                this.y += 82;
            }
            break;
        case "left":
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case "right":
            if (this.x < 404) {
                this.x += 101;
            }
            break;
        default:
            return;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// Now instantiate your objects.  Place all enemy objects in an array called allEnemies
var allEnemies = [];
var enemy0 = new Enemy(),
    enemy1 = new Enemy(),
    enemy2 = new Enemy(),
    enemy3 = new Enemy(),
    enemy4 = new Enemy();
allEnemies.push(
    enemy0, enemy1, enemy2, enemy3, enemy4);

// Place the Player object in a variable called player
var player = new Player();

