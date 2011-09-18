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
		x: Math.cos(radians(this._position.direction)) * p + this._position.x,
		y: Math.sin(radians(this._position.direction)) * p + this._position.y
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
            this.context.strokeStyle = this._pencolor;
	    return this;
	},
        pencolor: function pencolor(color) {
            this._pencolor = color;
            this.context.strokeStyle = color;
            return this;
        },
        pensize: function pensize(size) {
            this.context.lineWidth = size;
            return this;
        },
	clear: function clear() {
	    this.context.clearRect(0,0,this.context.canvas.width, this.context.canvas.height);
	    this.turtle.home();
	    return this;
	}
    });
    function TurtleShapeDecorator(turtlepen) {
        var cs = document.createElement('canvas');
        cs.width = 15;
        cs.height = 10;
        var ctx = cs.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(0,10);
        ctx.lineTo(15,5);
        ctx.lineTo(0,0);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
	return extend(this, {turtle:turtlepen, shape:cs});
    }
    extend(TurtleShapeDecorator.prototype, {
	home: function home(/* newhome */) {
	    this._restore_background();
	    if (arguments.length == 0) {this.turtle.home();}
	    else if (arguments.length == 1) {this.turtle.home(arguments[0])}
	    this._play_shape_relative_to_current_position();
	    return this;
	},
	position: function position(/* newposition */) {
	    if (arguments.length == 1) {
		this._restore_background();
		this.turtle.position(arguments[0]);
		this._play_shape_relative_to_current_position();
	    }
	    return this.turtle.position();
	},
	turn: function turn(degrees) {
	    this._restore_background();
	    this.turtle.turn(degrees); 
	    this._play_shape_relative_to_current_position();
	    return this;
	},
	move: function move(pixels) {
	    this._restore_background();
	    this.turtle.move(pixels); 
	    this._play_shape_relative_to_current_position();
	    return this;
	},
        penup: function penup() {
            this._restore_background();
            this.turtle.penup(); 
            this._play_shape_relative_to_current_position();
            return this;
        },
        pendown: function pendown() {
            this._restore_background();
            this.turtle.pendown();
            this._play_shape_relative_to_current_position();
            return this;
        },
        pencolor: function pencolor(color) {
            this._restore_background();
            this.turtle.pencolor(color); 
            this._play_shape_relative_to_current_position();
            return this;
        },
        pensize: function pensize(size) {
            this._restore_background();
            this.turtle.pensize(size); 
            this._play_shape_relative_to_current_position();
            return this;
        },
	clear: function clear() {
	    this.turtle.clear(); 
	    this._play_shape_relative_to_current_position();
	    return this;
	},
	_play_shape_relative_to_current_position: function _play_relative() {
	    var context = this.turtle.context;
	    var position = this.turtle.position();
	    var save_pen_state = this.turtle.pen;
            var save_pen_color = context.strokeStyle;
	    this._save_background();
	    context.save();
            var sx = this.shape.getContext('2d');
            sx.fillStyle = save_pen_state == "up" ? "#ffffff" : save_pen_color;
            sx.fill();
            sx.stroke();
	    context.translate(position.x, position.y);
	    context.rotate(radians(position.direction));
            context.drawImage(this.shape, this.shape.width/-2, this.shape.height/-2);
	    context.restore();
	    this.turtle.position(position);
	},
	_save_background: function _save_background () {
	    var context = this.turtle.context;
	    this.savedBackground = context.getImageData(
		0, 0, context.canvas.width, context.canvas.height);
	},
	_restore_background: function _restore_background() {
	    if (typeof(this.savedBackground) === "undefined")
		return;
	    this.turtle.context.putImageData(this.savedBackground, 0, 0);
	}
    });
    function TurtleCommandRecorder () {
	return extend(this, {queue: []});
    }
    extend(TurtleCommandRecorder.prototype, {
	home: function home () {
	    var newhome = arguments[0]
	    this.queue.push(function home(turtle) {turtle.home(newhome); return});
	    return this;
	},
	position: function position() {
	    var newposition = arguments[0];
	    this.queue.push(function position(turtle) {turtle.position(newposition); return});
	    return this;
	},
	turn: function turn(degrees) {
	    this.queue.push(function turn(turtle) {turtle.turn(degrees); return});
	    return this;
	},
	move: function move(pixels) {
	    this.queue.push(function move(turtle) {turtle.move(pixels); return});
	    return this;
	},
	pendown: function pendown() {
	    this.queue.push(function (turtle) {turtle.pendown(); return});
	    return this;
	},
	penup: function penup() {
	    this.queue.push(function penup(turtle) {turtle.penup(); return});
	    return this;
	},
        pencolor: function pencolor(color) {
            this.queue.push(function pencolor(turtle) {turtle.pencolor(color); return});
            return this;
        },
        pensize: function pensize(size) {
            this.queue.push(function pensize(turtle) {turtle.pensize(color); return});
            return this;
        },
	clear: function clear() {
	    this.queue.push(function clear(turtle) {turtle.clear(); return});
	    return this;
	},
	play: function play (turtle, interval, commandsPerInterval) {
            if (interval == undefined) {
	        this.queue.map(function(fn){fn.apply(undefined, [turtle])});
            }
            else {
                if (!commandsPerInterval)
                    commandsPerInterval = 1;
	        var queue = this.queue, i = 0, limit = this.queue.length;
                (function animate() {
                    do {
                        queue[i++].apply(undefined, [turtle]);
                    }
                    while (--limit && limit % commandsPerInterval);
                    if (limit)
                        setTimeout(animate, interval);
                })();
            }
	    return this;
	},
    });
    window.Turtle = Turtle;
    extend(window.Turtle, {
	extend: extend,
	Recorder: TurtleCommandRecorder,
	Pen: TurtlePenDecorator,
	Shape: TurtleShapeDecorator
    });
})(this, this.document);
