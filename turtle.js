(function (window) {
    function Turtle () {
	var self = this;
	self.position = [0, 0];
	self.direction = 90;
	function resetConfig() {
	    setPosition([0, 0]);
	    setDirection(90);
	    return self;
	}
	function setPosition (newPosition) {
	    self.position = newPosition;
	    return self;
	};
	function setDirection(newDirection) {
	    self.direction = parseFloat(newDirection) % 360;
	    if (self.direction < 0) {
		self.direction += 360;
	    }
	    return self;
	}
	function clear () {
	    return resetConfig();
	}
	function turn(degrees) {
	    setDirection(self.direction + parseFloat(degrees));
	    return self;
	}
	function move(length) {
	    var l = parseFloat(length);
	    setPosition([
		(Math.cos(directionInRadians()) * l) + self.position[0],
		(Math.sin(directionInRadians()) * l) + self.position[1],
	    ]);
	    return self;
	}
	function directionInRadians() {
	    return self.direction*Math.PI/180
	}
	// public methods
	self.setPosition = setPosition;
	self.setDirection = setDirection;
	self.clear = clear;
	self.turn = turn;
	self.move = move;
    }
    window.Turtle = Turtle;
})(this);
