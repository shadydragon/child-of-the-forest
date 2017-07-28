'use strict';

class Player {

	constructor() {
		// This is magic... just don't question it but it makes the loop work
		this.drawPlayer = this.drawPlayer.bind(this);
	}


}

module.exports = Player;
