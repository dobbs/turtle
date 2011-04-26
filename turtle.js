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
    function TurtlePenDecorator (turtle, context) {
	return extend(this, {"turtle":turtle, "context":context, "pen": "up"});
    }
    extend(TurtlePenDecorator.prototype, {
	home: function home(/* newhome */) {
	    if (arguments.length == 0) {this.turtle.home();}
	    else if (arguments.length == 1) {this.turtle.home(arguments[0])}
	    return this;
	},
	position: function position(/* newposition */) {
	    if (arguments.length == 0) {return this.turtle.position();}
	    else if (arguments.length == 1) {return this.turtle.position(arguments[0])}
	},
	turn: function turn(degrees) {
	    this.turtle.turn(degrees);
	    return this;
	},
	move: function move(pixels) {
	    if (this.pen === "up") {
		this.turtle.move(pixels);
		this.context.moveTo(this.turtle.position().x, this.turtle.position().y);
	    }
	    else if (this.pen === "down") {
		this.context.beginPath();
		this.context.moveTo(this.turtle.position().x, this.turtle.position().y);
		this.turtle.move(pixels);
		this.context.lineTo(this.turtle.position().x, this.turtle.position().y);
		this.context.stroke();
	    }
	    return this;
	},
	penup: function penup() {
	    this.pen = "up";
	    return this;
	},
	pendown: function pendown() {
	    this.pen = "down";
	    return this;
	},
	clear: function clear() {
	    this.context.clearRect(0,0,this.context.canvas.width, this.context.canvas.height);
	    this.turtle.home();
	    return this;
	}
    });
    function TurtleRecorder () {
	return extend(this, {queue: []});
    }
    extend(TurtleRecorder.prototype, {
	home: function home () {
	    var newhome = arguments[0]
	    this.queue.push(function home(turtle) {turtle.home(newhome); return});
	},
	position: function position() {
	    var newposition = arguments[0];
	    this.queue.push(function position(turtle) {turtle.position(newposition); return});
	},
	turn: function turn(degrees) {
	    this.queue.push(function turn(turtle) {turtle.turn(degrees); return});
	},
	move: function move(pixels) {
	    this.queue.push(function move(turtle) {turtle.move(pixels); return});
	},
	pendown: function pendown() {
	    this.queue.push(function (turtle) {turtle.pendown(); return});
	},
	penup: function penup() {
	    this.queue.push(function penup(turtle) {turtle.penup(); return});
	},
	clear: function clear() {
	    this.queue.push(function clear(turtle) {turtle.clear(); return});
	},
	play: function play (/* turtle, [turtle, ...] */) {
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

            if(!opts.turtle) {
                console.log('No rendering target found!');

                return;
            }

	    var queue = this.queue, i = 0, limit = this.queue.length;
	    (function animate() {
		do { queue[i++].apply(queue, [opts.turtle]) }
		while(--limit && limit % opts.opsPerStep);
		if (limit)
		    setTimeout(animate, opts.interval);
	    })();
	    return;
        }
    });
    window.Turtle = Turtle;
    extend(window.Turtle, {
	Recorder: TurtleRecorder,
	Pen: TurtlePenDecorator
    });
})(this, this.document);
