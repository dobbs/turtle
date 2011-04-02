(function (window, document, undefined) {
    function xtnd(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function extend(target) {
	if (arguments.length == 2) {xtnd(arguments[0], arguments[1])}
	else if (arguments.length > 2) {
	    for (var i=1; i<arguments.length; i++) {xtnd(target, arguments[i])}
	}
	return target;
    }
    function Turtle() {
	return extend(this, {
	    state: {},
	    event_handlers: {},
	    home: (arguments.length == 2) ? {
		direction: arguments[0],
		x: arguments[1][0], 
		y: arguments[1][1]
	    } : {direction: 0, x: 0, y: 0}
	}).clear();
    }
    extend(Turtle.prototype, {
	clear: function clear () {
	    this.setDirection(this.home.direction);
	    this.setPosition(this.home.x, this.home.y);
	    this.signal("clear", arguments);
	    return this;
	},
	direction: function direction () {
	    return this.state.direction;
	},
	directionInRadians: function directionInRadians () {
	    return this.direction()*Math.PI/180
	},
	position: function position () {
	    return [this.x(), this.y()];
	},
	x: function x () {
	    return this.state.x;
	},
	y: function y () {
	    return this.state.y;
	},
	setDirection: function setDirection (degrees) {
	    this.state.direction = parseFloat(degrees) % 360;
	    (this.state.direction < 0) && (this.state.direction += 360);
	    return this;
	},
	setPosition: function setPosition (x, y) {
	    this.state.x = parseFloat(x);
	    this.state.y = parseFloat(y);
	    return this;
	},
	turn: function turn (degrees) {
	    this.setDirection(this.state.direction + parseFloat(degrees));
	    this.signal("turn", arguments);
	    return this;
	},
	move: function move (pixels) {
	    var p = parseFloat(pixels);
	    this.setPosition(
		Math.cos(this.directionInRadians()) * p + this.x(),
		Math.sin(this.directionInRadians()) * p + this.y()
	    );
	    this.signal("move", arguments);
	    return this;
	},
	signal: function signal (method, args) {
	    if (this.event_handlers[method] && this.event_handlers[method].length) {
		for (var key in this.event_handlers[method]) {
		    var obj = this.event_handlers[method][key];
		    obj[method].apply(obj, args);
		}
	    }
	    return;
	},
	use: function use (tools) {
	    extend(this, tools);
	    for (var objname in tools) {
		var obj = tools[objname];
		obj.turtle = this;
		for (var method in obj) {
		    this.event_handlers[method] || (this.event_handlers[method] = []);
		    this.event_handlers[method].push(obj)
		}
	    }
	    return this;
	},
	clone: function clone () {
	    return extend(new Turtle(), {
		state: extend({}, this.state),
		home: extend({}, this.home),
		event_handlers: extend({}, this.event_handlers)
	    });
	}
    });
    function TurtlePen() {
	extend(this, {
	    vertexes: []
	});
	return this;
    }
    extend(TurtlePen.prototype, {
	addVertex: function() {
	    this.vertexes.push(this.turtle.clone());
	    return this;
	},
	down: function () {
	    this.addVertex();
	    this.penIsDown = true;
	},
	up: function () {
	    this.penIsDown = false;
	},
	move: function (pixels) {
	    if (this.penIsDown) {
		this.addVertex();
	    }
	    else if (this.canvas) {
		this.render(this.canvas);
	    }
	    return this;
	},
	render: function (canvas) {
	    var maxidx = this.vertexes.length;
	    var ctx = canvas.getContext('2d');
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.save();
	    ctx.translate(this.turtle.x(), this.turtle.y());
	    ctx.rotate(this.turtle.directionInRadians());
	    ctx.beginPath();
	    ctx.moveTo(this.vertexes[0].x(), this.vertexes[0].y());
	    for(var i = 1; i < maxidx; i++) {
		ctx.lineTo(this.vertexes[i].x(), this.vertexes[i].y());
	    }
	    ctx.closePath();
	    ctx.stroke();
	    ctx.restore();
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
		self.ctx.moveTo(self.turtle.x(), self.turtle.y());
		self.turtle.move(pixels);
		self.ctx.lineTo(self.turtle.x(), self.turtle.y());
		self.ctx.stroke();
	    } else {
		self.ctx.moveTo(self.turtle.x(), self.turtle.y());
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
    window.TurtlePen = TurtlePen;
    window.Commands = Commands;
    window.LogView = LogView;
    window.CanvasView = CanvasView;
})(this, this.document);
