(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function Turtle() {
	extend(this, {
	    state: {},
	    home: (arguments.length == 2) ? {
		direction: arguments[0],
		x: arguments[1][0], 
		y: arguments[1][1]
	    } : {direction: 0, x: 0, y: 0}
	});
	this.clear();
	return this;
    }
    extend(Turtle.prototype, {
	clear: function () {
	    this.setDirection(this.home.direction);
	    this.setPosition(this.home.x, this.home.y);
	    return this;
	},
	direction: function () {
	    return this.state.direction;
	},
	position: function () {
	    return [this.x(), this.y()];
	},
	x: function () {
	    return this.state.x;
	},
	y: function () {
	    return this.state.y;
	},
	setDirection: function (degrees) {
	    this.state.direction = parseFloat(degrees) % 360;
	    (this.state.direction < 0) && (this.state.direction += 360);
	    return this;
	},
	setPosition: function (x, y) {
	    this.state['x'] = parseFloat(x);
	    this.state['y'] = parseFloat(y);
	    return this;
	},
	turn: function (degrees) {
	    this.setDirection(this.state.direction + parseFloat(degrees));
	    return this;
	},
	move: function (pixels) {
	    var p = parseFloat(pixels);
	    this.setPosition(
		Math.cos(this.direction()*Math.PI/180) * p + this.x(),
		Math.sin(this.direction()*Math.PI/180) * p + this.y()
	    );
	    return this;
	}
    });
    
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
	self.turtle = new Turtle(0, [
	    parseInt(canvas.width/2), 
	    parseInt(canvas.height/2)
	]);
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
})(this, this.document);
