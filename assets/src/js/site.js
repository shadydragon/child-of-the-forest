'use strict';

// Requires
//const Player = require('./class/player.js');

// Main Game Object
class Game {

	constructor(canvas) {

		// The game object
		this.game = {};
		this.game.canvas = canvas;
		this.game.context = this.game.canvas.getContext("2d");

		// Controls object
		this.controls = {
			leftPressed: false,
			rightPressed: false,
			upPressed: false,
			downPressed: false,
			spacePressed: false
		};

		// The player object
		this.player = {
			width: 48, // Height of player character in px
			height: 48, // Width of player character in px
			x: 0, // X Position on the canvas
			y: 0, // Y position on the canvas
			velX: 0, // Current horizontal Movement Speed
			velY: 0, // Current vertical movement speed
			speedX: 20, // Max horizontal speed
			speedY: 10, // Max vertical speed
			accellX: 3, // Horizontal acceleration
			accellY: 2, // vertical acceleration
			decelX: 0.8, // Rate at which the horizontal velocity decays per frame
			decelY: 0.8, // Vertical deceleration
		};

		// update player position to start off with
		this.player.x = (this.game.canvas.width - this.player.width) / 2;
		this.player.y = (this.game.canvas.height - this.player.height);

		// This is magic... just don't question it but it makes the loop work
		this.gameLoop = this.gameLoop.bind(this);
		this.keyDownHandler = this.keyDownHandler.bind(this);
		this.keyUpHandler = this.keyUpHandler.bind(this);

	}

	/** ======================
	* Controls
	====================== **/
	keyDownHandler(e) {
		if(e.keyCode == 39) {
			this.controls.rightPressed = true;
		}
		if (e.keyCode == 37) {
			this.controls.leftPressed = true;
		}
		if (e.keyCode == 38) {
			this.controls.upPressed = true;
		}
		if (e.keyCode == 40) {
			this.controls.downPressed = true;
		}
		if (e.keyCode == 32) {
			this.controls.spacePressed = true;
		}
	}

	keyUpHandler(e) {
		if(e.keyCode == 39) {
			this.controls.rightPressed = false;
		}
		if (e.keyCode == 37) {
			this.controls.leftPressed = false;
		}
		if (e.keyCode == 38) {
			this.controls.upPressed = false;
		}
		if (e.keyCode == 40) {
			this.controls.downPressed = false;
		}
		if (e.keyCode == 32) {
			this.controls.spacePressed = false;
		}
	}



	/** ======================
	* Player settings
	====================== **/

	drawPlayer() {

		// Create the player
		this.game.context.beginPath();
		this.game.context.rect(
			this.player.x,
			this.player.y,
			this.player.width,
			this.player.height
		);
		this.game.context.fillStyle = "#0095DD";
		this.game.context.fill();
		this.game.context.closePath();

	}

	/** ======================
	* Player Sprite
	====================== **/


	/** ======================
	* Game Loop
	====================== **/

	// Update the position of elements
	update() {
		// Control the player
		this.handleMovement();
	}

	handleMovement() {
		let char = this.player;

		// handle what actually happens when
		if(this.controls.rightPressed && char.velX < char.speedX) {
			char.velX += char.accellX;
		}
		if(this.controls.leftPressed && char.velX > -char.speedX) {
			char.velX -= char.accellX;
		}
		if(this.controls.upPressed && char.velY < char.speedY) {
			char.velY -= char.accellY;
		}
		if(this.controls.downPressed && char.velY > -char.speedY) {
			char.velY += char.accellY;
		}

		// Decay the velocity over time
		char.velX *= char.decelX;
		char.velY *= char.decelY;

		// Update the player's position
		char.x += char.velX;
		char.y += char.velY;
	}

	// Clear and redraw the canvas
	draw() {
		// Clear the entire canvas
		this.game.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

		// Update player object
		this.drawPlayer();

	}

	// The game loop
	gameLoop() {
		this.update();
		this.draw();
		requestAnimationFrame(this.gameLoop);
	}




	/** ======================
	* Game Init
	====================== **/

	init() {
		console.log('::Game Init::', this.game.canvas);

		// Add event listeners for keypresses
		document.addEventListener("keydown", this.keyDownHandler, false);
		document.addEventListener("keyup", this.keyUpHandler, false);

		// Kick the game loop into gear
		requestAnimationFrame(this.gameLoop);


	}

}

window.onload = function() {
	// Start the game running
	const game = new Game(document.getElementById("gameCanvas"));
	game.init();
}

