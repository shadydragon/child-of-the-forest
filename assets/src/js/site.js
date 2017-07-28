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
			downPressed: false
		};

		// The player object
		this.player = {
			data: {
				width: 10,
				height: 75
			},
			pos: {
				x: 0,
				y: 0
			},
			movement: {
				dx: 2,
				dy: -2
			}
		};

		// update player position to start off with
		this.player.pos.x = (this.game.canvas.width - this.player.data.width) / 2;
		this.player.pos.y = (this.game.canvas.height - this.player.data.height);

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
	}



	/** ======================
	* Player settings
	====================== **/

	drawPlayer() {

		// Create the player
		this.game.context.beginPath();
		this.game.context.rect(
			this.player.pos.x,
			this.player.pos.y,
			this.player.data.width,
			this.player.data.height
		);
		this.game.context.fillStyle = "#0095DD";
		this.game.context.fill();
		this.game.context.closePath();

	}




	/** ======================
	* Game Loop
	====================== **/

	// Update the position of elements
	update() {
		// Define the motion
		// this.player.pos.x += this.player.movement.dx;
		// this.player.pos.y += this.player.movement.dy;
	}

	// Clear and redraw the canvas
	draw() {
		// Clear the entire canvas
		this.game.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

		// Control the player

		if(this.controls.rightPressed) {
			this.player.pos.x += 7;
		}
		if(this.controls.leftPressed) {
			this.player.pos.x -= 7;
		}
		if(this.controls.upPressed) {
			this.player.pos.y -= 7;
		}
		if(this.controls.downPressed) {
			this.player.pos.y += 7;
		}

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

