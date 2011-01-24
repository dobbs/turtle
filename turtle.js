(function (window) {
    function Turtle () {
	var self = this;
	self.position = [0, 0];
	self.direction = 90;
	function clear () {
	    setPosition(0, 0);
	    setDirection(90);
	    return self;
	}
	function setPosition (x, y) {
	    self.position = [parseFloat(x), parseFloat(y)];
	    return self;
	};
	function setDirection(newDirection) {
	    self.direction = parseFloat(newDirection) % 360;
	    if (self.direction < 0) {
		self.direction += 360;
	    }
	    return self;
	}
	function turn(degrees) {
	    setDirection(self.direction + parseFloat(degrees));
	    return self;
	}
	function move(length) {
	    var l = parseFloat(length);
	    setPosition(
		(Math.cos(directionInRadians()) * l) + self.position[0],
		(Math.sin(directionInRadians()) * l) + self.position[1]
	    );
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
    function Commands () {
	var self = [];
	self.clear = function () {
	    self.push(function (view) {
		view.clear();
		return;
	    });
	};
	self.move = function () {
	    var pixels = arguments[0];
	    self.push(function (view) {
		view.move(pixels);
		return;
	    });
	};
	self.turn = function () {
	    var degrees = arguments[0];
	    self.push(function (view) {
		view.turn(degrees);
		return;
	    });
	};
	self.penDown = function () {
	    self.push(function (view) {
		view.penDown();
		return;
	    });
	};
	self.penUp = function () {
	    self.push(function (view) {
		view.penDown();
		return;
	    });
	};
	self.setPosition = function () {
	    var x = arguments[0];
	    var y = arguments[1];
	    self.push(function (view) {
		view.setPosition(x, y);
		return;
	    });
	};
	self.setDirection = function () {
	    var degrees = arguments[0];
	    self.push(function (view) {
		view.setDirection(degrees);
		return;
	    });
        };
	self.play = function () {
	    for (var i = 0; i < self.length; i++) {
		for (var j = 0; j < arguments.length; j++) {
		    self[i].apply(self, [arguments[j]]);
		}
	    }
	};
        self.playback = function (opts) {
            opts.interval = opts.interval || 100;
            opts.opsPerStep = opts.opsPerStep || 10;

            if(!opts.view) {
                console.log('No rendering target found!');

                return;
            }

            var loop = function(cb, delay) {
                var intervalId;

                var cycle = function() {
                    var ret = cb();

                    if(ret == false) {
                        clearInterval(intervalId);
                    }
                }

                intervalId = setInterval(cycle, delay);
            };

            var i = 0;
            loop(function() {
                while(i < self.length) {
                    self[i].apply(self, [opts.view]);

                    i++;

                    if(!(i % opts.opsPerStep)) {
                        return true;
                    }
                }

                return false;
            }, opts.interval);
        };
	return self;
    }
    function LogView (out) { // for use with FireBug console or similar
	var self = this;
	self.clear = function () {
	    out.log('clear();');
	    return;
	};
	self.move = function (pixels) {
	    out.log('move('+pixels+');');
	    return;
	};
	self.turn = function (degrees) {
	    out.log('turn('+degrees+');');
	    return;
	};
	self.penDown = function () {
	    out.log('penDown();');
	    return;
	};
	self.penUp = function () {
	    out.log('penUp();');
	    return
	};
	self.setPosition = function (x, y) {
	    out.log('setPosition('+x+', '+y+');');
	    return;
	};
	self.setDirection = function (degrees) {
	    out.log('setDirection('+degrees+');');
	    return;
	};
    }
    function CanvasView (canvas) {
	var self = this;
	self.turtle = new Turtle();
	self.canvas = canvas;
	self.ctx = canvas.getContext('2d');
	self.penIsDown = false;
	self.clear = function () {
	    self.turtle.clear();
	    self.ctx.clearRect(0, 0, canvas.width, canvas.height);
	    return;
	};
	self.move = function (pixels) {
	    if (self.penIsDown) {
		self.ctx.beginPath();
		self.ctx.moveTo(self.turtle.position[0],
				self.turtle.position[1]);
		self.turtle.move(pixels);
		self.ctx.lineTo(self.turtle.position[0],
				self.turtle.position[1]);
		self.ctx.stroke();
	    } else {
		self.ctx.moveTo(self.turtle.position[0],
				self.turtle.position[1]);
	    }
	    return;
	};
	self.turn = function (degrees) {
	    self.turtle.turn(degrees);
	    return;
	};
	self.penDown = function () {
	    self.penIsDown = true;
	    return;
	};
	self.penUp = function () {
	    self.penIsDown = false;
	    return
	};
	self.setPosition = function (x, y) {
	    self.turtle.setPosition(x, y);
	    self.ctx.moveTo(x, y);
	    return;
	};
        self.setDirection = function(degrees) {
	    self.turtle.setDirection(degrees);
	    return;
        };
    }
    window.Turtle = Turtle;
    window.Commands = Commands;
    window.LogView = LogView;
    window.CanvasView = CanvasView;
})(this);
