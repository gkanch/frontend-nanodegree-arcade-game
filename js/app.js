// utility constants
var MAX_X = 505,
    MAX_Y = 606,
    TIME_LIMIT = 300;

var ENEMY_SPEEDS = [150, 200, 250, 300, 350, 500, 650, 700, 1000],
    ENEMY_Y_POSITIONS = [72, 154, 236, 318];

var PLAYER_X = MAX_X / 5 * 2, //x-positions: 0,101,202,303,404
    PLAYER_Y = 400,           //y-locations:-10,72,154,236,318,400;
    PLAYER_LIVES = 3;

var GEM_X = [15, MAX_X/5*2+15, MAX_X/5*4+15],
    GEM_Y = 15;

var ROCK_X = [MAX_X / 5 * 1, MAX_X / 5 * 3],
    ROCK_Y = -20;

// define template for all AssetBases
var AssetBase = function (sprite) {
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
};

// *** Template for rendering game assets ***
AssetBase.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
AssetBase.prototype.update = function () { };

// **** Enemy class ****
var Enemy = function (sprite) {
    AssetBase.call(this, sprite); //delegate failed calls to AssetBase object

    // Variables applied to each of our instances go here, we've provided one for you to get started
    // The image/sprite for our enemies, this uses a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = ENEMY_SPEEDS[Math.floor(Math.random() * ENEMY_SPEEDS.length)];
    this.x = -60;
    this.y = ENEMY_Y_POSITIONS[Math.floor(Math.random() * ENEMY_Y_POSITIONS.length)];
};
Enemy.prototype = Object.create(AssetBase.prototype); //create Enemy based on AssetBase object
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

// **** Gem class ****
var Gem = function (sprite) {
    AssetBase.call(this, sprite);

    this.sprite = 'images/gem-orange.png';
    this.y = GEM_Y;
    this.collected = false;
};
Gem.prototype = Object.create(AssetBase.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function () {
    // check for Collected
    if (!this.collected) {
        if ((Math.abs(player.x - this.x) < 50) && (Math.abs(player.y - this.y) < 50)) {
            this.collected = true;
            this.sprite = 'images/char-boy-orange-gem.png';
            player.x = PLAYER_X;
            player.y = PLAYER_Y;
        }
    }
    return this.collected;
};

// **** Rock class ****
var Rock = function (sprite) {
    AssetBase.call(this, sprite);

    this.sprite = 'images/rock.png';
    this.y = ROCK_Y;
};
Rock.prototype = Object.create(AssetBase.prototype);
Rock.prototype.constructor = Rock;

// **** Player class ****
var Player = function (sprite) {
    AssetBase.call(this, sprite);

    this.sprite = 'images/char-boy.png';
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    this.remainingLives = PLAYER_LIVES;
};
Player.prototype = Object.create(AssetBase.prototype);
Player.prototype.constructor = Player;

// check collision between player and enemies
Player.prototype.checkCollision = function () {
    var isCollided = false;

    for (var i = 0; i < allEnemies.length; i++) {
        if ((Math.abs(allEnemies[i].x - this.x) < 50) && allEnemies[i].y === this.y) {
            isCollided = true;
            break;
        }
    }
    return isCollided;
};

Player.prototype.update = function (dt) {
    // check for Collision
    if (this.checkCollision() === true) {
        this.x = PLAYER_X;
        this.y = PLAYER_Y;
        this.remainingLives -= 1;
    }
};

Player.prototype.checkBarrier = function (x, y) {
    var isBlocked = false;
    // check for Barrier due to rock
    for (var i=0; i < allRocks.length; i++) {
        if ((Math.abs(allRocks[i].x - x) < 50) && (Math.abs(allRocks[i].y - y) < 50)) {
            isBlocked = true;
            break;
        }
    }
    // check for Barrier due to collectedGem
    if (isBlocked === true) {
        return isBlocked;
    }
    else {
        //for (index in allGems) {
        for (var i=0; i < allGems.length; i++) {
            if (allGems[i].collected === true &&
                    (Math.abs(allGems[i].x - x) < 50) &&
                    (Math.abs(allGems[i].y - y) < 50)) {
                isBlocked = true;
                break;
            }
        }
    }
    return isBlocked;
};

Player.prototype.handleInput = function (key) {
    // reference:
    // x-positions: 0,101,202,303,404
    // y-positions: -10,72,154,236,318,400
    if (game.isGameOver == false) {
        switch (key) {
            case "up":
                if (this.y > -10 && !this.checkBarrier(this.x, this.y - 82)) {
                    this.y -= 82;
                }
                break;
            case "down":
                if (this.y < 400 && !this.checkBarrier(this.x, this.y + 82)) {
                    this.y += 82;
                }
                break;
            case "left":
                if (this.x > 0 && !this.checkBarrier(this.x - 101, this.y)) {
                    this.x -= 101;
                }
                break;
            case "right":
                if (this.x < 404 && !this.checkBarrier(this.x + 101, this.y)) {
                    this.x += 101;
                }
                break;
            default:
                return;
        }
    }
}

// **** Game class (not inherited from AssetBase) ****
var Game = function () {
    this.timeLeft = TIME_LIMIT;
    this.isGameOver = false;
    this.isGameWon = false;
};
Game.prototype.update = function (dt) {
    // Count down per time limit
    if (!this.isGameWon) {
        this.timeLeft -= (10 * dt);
    }
    // Time Left display
    if (this.timeLeft > 0 && !this.isGameWon) {
        document.getElementById("timer").innerText = "Remaining Time: " + Math.floor(this.timeLeft);
    }
    else if (!this.isGameWon) {
        document.getElementById("timer").innerText = "Remaining Time: 0";
    }

    if (this.timeLeft < 0 || player.remainingLives == 0) {
        this.gameOver();
    }
    else {
        // Update isGameWon status
        var gemCollectedCount = 0;
        allGems.forEach(function (gem) {
            if (gem.collected) {
                gemCollectedCount += 1;
            }
        });
        if (gemCollectedCount == allGems.length) {
            this.gameWon();
        }
    }
};

Game.prototype.gameOver = function () {
    document.getElementById("status").innerText = "Game Over";
    allEnemies = [];
    this.isGameOver = true;
};

Game.prototype.gameWon = function () {
    document.getElementById("status").innerText = "You Win";
    allEnemies = [];
    this.isGameWon = true;
};

// **** Utility ****
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

// **** Instantiate objects ****
// enemies
var allEnemies = [];
var enemy0 = new Enemy(),
    enemy1 = new Enemy(),
    enemy2 = new Enemy(),
    enemy3 = new Enemy(),
    enemy4 = new Enemy();
allEnemies.push(enemy0, enemy1, enemy2, enemy3, enemy4);
// gems
var allGems = [];
var gem0 = new Gem(),
    gem1 = new Gem(),
    gem2 = new Gem();
gem0.x = GEM_X[0];
gem1.x = GEM_X[1];
gem2.x = GEM_X[2];
allGems.push(gem0, gem1, gem2);
// rocks
var allRocks = [];
var rock0 = new Rock(),
    rock1 = new Rock();
rock0.x = ROCK_X[0];
rock1.x = ROCK_X[1];
allRocks.push(rock0, rock1);
// player
var player = new Player();
// game
var game = new Game();