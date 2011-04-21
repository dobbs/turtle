(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function assertNumber(value, errors, message) {
	if (value === undefined) {return false;}
	if (value !== null && isNaN(parseFloat(value))) {errors.push(message); return false;}
	return true;
    }
    function radians (degrees) {return degrees * Math.PI / 180}
    function degrees (radians) {return radians * 180 / Math.PI}
    function Turtle(/*degrees, [x, y]*/) {
	var home = {direction: 0, x: 0, y: 0};
	if (arguments.length == 1) {
	    extend(home, arguments[0]);
	} 
	return extend(this, {_position: {}, _home: home}).home();
    }
    extend(Turtle.prototype, {
	home: function home() {
	    var newhome = arguments[0];
	    if (typeof newhome === "object") {
		this.position(newhome);
		extend(this._home, this._position);
	    }
	    this.position(this._home);
	    return this;
	},
	position: function position () {
	    var newposition = arguments[0];
	    if (typeof newposition === "object") {
		var errors = [];
		if (assertNumber(newposition.direction, errors, "direction must be a number")) {
		    this._position.direction = parseFloat(newposition.direction) % 360;
		    (this._position.direction < 0) && (this._position.direction += 360);
		}
		if (assertNumber(newposition.x, errors, "x must be a number")) {
		    this._position.x = parseFloat(newposition.x);
		}
		if (assertNumber(newposition.y, errors, "y must be a number")) {
		    this._position.y = parseFloat(newposition.y);
		}
		if (errors.length) {
		    throw new TypeError(errors.join("\n"));
		}
		return this;
	    }
	    return extend({}, this._position);
	},
	turn: function turn (degrees) {
	    this.position({direction:this._position.direction + parseFloat(degrees)});
	    return this;
	},
	move: function move (pixels) {
	    var p = parseFloat(pixels);
	    this.position({
		x: Math.cos(radians(this.position().direction)) * p + this._position.x,
		y: Math.sin(radians(this.position().direction)) * p + this._position.y
	    });
	    return this;
	},
    });
    function TurtleRecorder () {
	return extend(this, {queue: []});
    }
    extend(TurtleRecorder.prototype, {
	home: function home () {
	    var newhome = arguments[0]
	    this.queue.push(function (view) {
		view.home(newhome);
		return;
	    });
	},
	position: function position () {
	    var newposition = arguments[0];
	    this.queue.push(function (view) {
		view.position(newposition);
		return;
	    });
	},
	turn: function turn (degrees) {
	    this.queue.push(function (view) {
		view.turn(degrees);
		return;
	    });
	},
	move: function move (pixels) {
	    this.queue.push(function (view) {
		view.move(pixels);
		return;
	    });
	},
	clear: function clear () {
	    this.queue.push(function (view) {
		view.clear();
		return;
	    });
	},
	penDown: function penDown () {
	    this.queue.push(function (view) {
		view.penDown();
		return;
	    });
	},
	penUp: function penUp () {
	    this.queue.push(function (view) {
		view.penDown();
		return;
	    });
	},
	play: function play () {
	    for (var i = 0; i < this.queue.length; i++) {
		for (var j = 0; j < arguments.length; j++) {
		    this.queue[i].apply(this.queue, [arguments[j]]);
		}
	    }
	},
        playback: function playback (args) {
	    var opts = extend({
		interval: 100,
		opsPerStep: 10
	    }, args);

            if(!opts.view) {
                console.log('No rendering target found!');

                return;
            }

	    var queue = this.queue, i = 0, limit = this.queue.length;
	    (function animate() {
		do { queue[i++].apply(queue, [opts.view]) }
		while(--limit && limit % opts.opsPerStep);
		if (limit)
		    setTimeout(animate, opts.interval);
	    })();
	    return;
        }
    });
    function LogView (out) { // for use with FireBug console or similar
	var self = this;
	self.clear = function () {
	    out.log('clear();');
	    return;
	};
	self.home = function () {
	    var newhome = arguments[0];
	    out.log('home(',newhome,');');
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
	self.position = function position (newposition) {
	    out.log('position(',newposition,');');
	    return;
	};
    }
    function CanvasView (canvas) {
	var self = this;
	self.turtle = new Turtle({
	    direction: 0,
	    x: parseInt(canvas.width/2), 
	    y: parseInt(canvas.height/2)
	});
	self.canvas = canvas;
	self.ctx = canvas.getContext('2d');
	self.penIsDown = false;
	self.clear = function () {
	    self.turtle.home();
	    self.ctx.clearRect(0, 0, canvas.width, canvas.height);
	    return;
	};
	self.home = function () {
	    var newhome = arguments[0];
	    self.turtle.home(newhome);
	    return;
	};
	self.move = function (pixels) {
	    if (self.penIsDown) {
		self.ctx.beginPath();
		self.ctx.moveTo(self.turtle.position().x, self.turtle.position().y);
		self.turtle.move(pixels);
		self.ctx.lineTo(self.turtle.position().x, self.turtle.position().y);
		self.ctx.stroke();
	    } else {
		self.ctx.moveTo(self.turtle.position().x, self.turtle.position().y);
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
	self.position = function (newposition) {
	    self.turtle.position(newposition);
	    self.ctx.moveTo(self.turtle.position().x, self.turtle.position().y);
	    return;
	};
    }
    function CompositeView() {
	var self = this;
	self.views = [];
	for (var i=0; i < arguments.length; i++) {
	    self.views.push(arguments[i]);
	}
	self.clear = function () {self.views.map(function(view){view.clear()})};
	self.home = function () {
	    var args = arguments;
	    self.views.map(function(view){
		if (args.length) {
		    view.home.apply(view, args);
		}
		else {
		    view.home();
		}
	    });
	};
	self.move = function (pixels) {
	    self.views.map(function(view){view.move(pixels)});
	};
	self.turn = function (degrees) {
	    self.views.map(function(view){view.turn(degrees)});
	};
	self.penDown = function () {
	    self.views.map(function(view){view.penDown()});
	};
	self.penUp = function () {
	    self.views.map(function(view){view.penUp()});
	};
	self.position = function (newposition) {
	    self.views.map(function(view){view.position(newposition)});
	};
    }
    window.Turtle = Turtle;
    extend(window.Turtle, {
	Recorder: TurtleRecorder
    });
    window.LogView = LogView;
    window.CanvasView = CanvasView;
    window.CompositeView = CompositeView;
})(this, this.document);
