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
    function View (canvas) {
	var self = this;
	var turtle = new Turtle();
	self.turtle = turtle;
	self.queue = [];
	self.canvas = canvas;
	var context = canvas.getContext('2d')
	function clear() {
	    self.queue.push(function () {
		console.log('clear()');
		turtle.clear();
		context.clearRect(0, 0,canvas.width, canvas.height);
		return;
	    });
	}
	function move() {
	    var args = arguments;
	    self.queue.push(function () {
		console.log('move('+args[0]+') ' + (turtle.penIsDown ? 'penDown' : ''));
		turtle.move(args[0]);
		if (turtle.penIsDown) {
		    context.lineTo(turtle.position[0], turtle.position[1]);
		} else {
		    context.moveTo(turtle.position[0], turtle.position[1]);
		}
		return;
	    });
	}
	function turn() {
	    var args = arguments;
	    self.queue.push(function () {
		console.log('turn('+args[0]+')');
		turtle.turn(args[0]);
		return;
	    });
	}
	function penDown() {
	    self.queue.push(function () {
		console.log('penDown()');
		turtle.penIsDown = true;
		context.beginPath();
		context.moveTo(turtle.position[0], turtle.position[1]);
		return;
	    });
	}
	function penUp() {
	    self.queue.push(function () {
		console.log('penUp()');
		turtle.penIsDown = false;
	    });
	}
	function run () {
	    for (var i = 0; i < self.queue.length; i++) {
		self.queue[i].apply([]);
	    }
	    context.stroke();
	}
	function setPosition() {
	    var args = arguments;
	    self.queue.push(function () {
		turtle.setPosition(args[0]);
		return;
	    });
	}
	self.clear = clear;
	self.move = move;
	self.turn = turn;
	self.penDown = penDown;
	self.penUp = penUp;
	self.setPosition = setPosition;
	self.run = run;
    }
    window.Turtle = Turtle;
    window.View = View;
})(this);
