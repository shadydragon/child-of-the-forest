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
		this.game.world = {
			gravity: 0.0098, // Accelleration due to gravity, per frame
			offset: {
				x: 0,
				y: 0
			},
			platforms: []
		};

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
			speedY: 20, // Max vertical speed, Terminal velocity
			accellX: 3, // Horizontal acceleration
			accellY: 2, // vertical acceleration
			decelX: 0.8, // Rate at which the horizontal velocity decays per frame
			decelY: 0.9, // Vertical deceleration
			isAirborne: false, // Are we flying?
			sprite: '../img/sprite-run-new.png'
		};

		// update player position to start off with
		//this.player.x = (this.game.canvas.width - this.player.width) / 2;
		this.player.x = 300;
		this.player.y = (this.game.canvas.height - this.player.height) - 300;

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
	* World object creation
	====================== **/
	createPlatforms() {
		this.game.world.platforms = [
			{
				type:'platform',
				x: 100,
				y: 100,
				width: 100,
				height: 50,
				colour: '#ff0000'
			},
			{
				type:'platform',
				x: 200,
				y: 200,
				width: 100,
				height: 50,
				colour: '#ff0000'
			},
			{
				type:'platform',
				x: 300,
				y: 300,
				width: 100,
				height: 50,
				colour: '#ff0000'
			},
			{
				type:'platform',
				x: 0,
				y: this.game.canvas.height - 70,
				width: this.game.canvas.width,
				height: 60,
				colour: '#ff0000'
			}
		];
	}

	drawPlatform() {
		let context = this.game.context;

		this.game.world.platforms.forEach(function(object, index) {

			// Create the platforms
			context.beginPath();
			context.rect(
				object.x,
				object.y,
				object.width,
				object.height
			);
			context.fillStyle = object.colour;
			context.fill();
			context.closePath();
		});
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
	* Player World interactions
	====================== **/
	isOnGround() {

		let player = this.player;
		let returnObject;

		// Check if our feet have hit a platform. This is very inefficient
		let platforms = this.game.world.platforms;
		for (var thing in platforms) {
			if (player.y + player.height + 1 > platforms[thing].y &&
				player.y + player.height + 1 < platforms[thing].y + platforms[thing].height &&
				player.x + player.width > platforms[thing].x &&
				player.x < platforms[thing].x + platforms[thing].width) {
				returnObject =  {
					status: true,
					floorPos: platforms[thing].y
				}
				break;
			} else {
				returnObject = {status: false};
			}
		}

		if (returnObject) {
			return returnObject;
		} else {
			// keep falling even if there are o platforms
			return {status: false};
		}

	}

	canMoveLeft() {
		return true;
	}

	canMoveRight() {
		return true;
	}

	canMoveUp() {
		 return true;
	}

	/** ======================
	* Player NPC interactions
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

		// Handle Horizontal motion

		// handle what actually happens when we move horizontally
		if(this.controls.rightPressed && char.velX < char.speedX) {
			char.velX += char.accellX;
		}
		if(this.controls.leftPressed && char.velX > -char.speedX) {
			char.velX -= char.accellX;
		}

		// Decay the velocity over time
		char.velX *= char.decelX;

		// Update the player's position
		char.x += char.velX;

		// Handle Vertical Motion
		let ground = this.isOnGround();

		if (ground.status) {
			// if we are on or under a walkable surface

			let groundDiff = ground.floorPos - char.y - 1;

			// if we press the jump button and the character is not airborne at the moment
			if( (this.controls.upPressed || this.controls.spacePressed) && !char.isAirborne ) {
				// Launch them
				char.velY -= char.speedY;
				char.y += char.velY;


			} else if (char.isAirborne == true) {
				// Stop the character in it's tracks
				char.velY = 0;

				// the frame render is too slow to detect we've hit anything so keeps going. we cheet by just moving the character back to where they should be
				char.y = ground.floorPos - char.height;

				// Mark them as not airborne
				char.isAirborne = false;
			}

		} else {
			// Mark them as airborne
			char.isAirborne = true;

			// if we are in the air
			// we're going up
			if (char.velY <= 0) {
				char.velY += char.decelY;
			} else {
				if (char.velY < char.speedY) {
					char.velY *= char.accellY;
				}
			}

			char.y += char.velY;
		}

	}


	// Clear and redraw the canvas
	draw() {
		// Clear the entire canvas
		this.game.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

		// Update player object
		this.drawPlayer();

		// Update all the platforms
		this.drawPlatform();

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

		this.createPlatforms();

		// Kick the game loop into gear
		requestAnimationFrame(this.gameLoop);


	}

}

window.onload = function() {
	// Start the game running
	const game = new Game(document.getElementById("gameCanvas"));
	game.init();
}

