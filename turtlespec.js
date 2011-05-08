describe("Turtle", function () {
    var turtle;
    beforeEach(function () {
	turtle = new Turtle();
    });

    describe("new", function () {
    	it("should set default direction and position", function () {
    	    expect(turtle.position()).toEqual({direction:0, x:0, y:0});
    	});

    	it("should use given direction and position as defaults", function () {
    	    turtle = new Turtle({direction:60, x:50, y:40});
    	    expect(turtle.position()).toEqual({direction:60, x:50, y:40});
    	});
    });

    describe("position({direction:degrees})", function () {
	it("should change turtle.position().direction", function () {
    	    turtle.position({direction:30});
    	    expect(turtle.position().direction).toEqual(30);
	});

    	it("should convert directions greater than 360 degrees", function () {
    	    turtle.position({direction:400});
    	    expect(turtle.position().direction).toEqual(40);
    	});

    	it("should convert negative degrees", function () {
    	    turtle.position({direction:-30});
    	    expect(turtle.position().direction).toEqual(330);
    	    turtle.position({direction:-400});
    	    expect(turtle.position().direction).toEqual(320);
    	});
    });

    describe("position({x:pixels, y:pixels})", function () {
    	it("should change turtle.position()", function () {
    	    turtle.position({x:5, y:20});
    	    expect([turtle.position().x,turtle.position().y]).toEqual([5, 20]);
    	});
    });

    describe("home", function () {
    	function random(i, j) {return Math.floor(Math.random()*(j-i+1))+i}
    	it("should reset direction and position to defaults", function () {
    	    turtle.position({
		direction:random(0, 360),
		x:random(-100, 100),
		y:random(-100, 100)
	    });
    	    turtle.home();
    	    expect(turtle.position()).toEqual({direction:0, x:0, y:0});
    	});

    	it("should reset direction and position to user specified defaults", function () {
    	    turtle = new Turtle({direction:90, x:80, y:70});
    	    turtle.position({
		direction:random(0, 360),
		x:random(-100, 100),
		y:random(-100, 100)
	    });
    	    turtle.home();
    	    expect(turtle.position()).toEqual({direction:90, x:80, y:70});
    	});

	it("should also change the turtle's home when given arguments", function () {
	    turtle.home({direction:15, x:25, y:35});
	    expect(turtle.position()).toEqual({direction:15, x:25, y:35});
    	    turtle.position({
		direction:random(0, 360),
		x:random(-100, 100),
		y:random(-100, 100)
	    });
    	    turtle.home();
	    expect(turtle.position()).toEqual({direction:15, x:25, y:35});
	});
    });

    describe("turn(degrees)", function () {
    	it("should change turtle.position().direction relative to its current direction", function () {
    	    turtle.turn(30);
    	    expect(turtle.position().direction).toEqual(30);
    	    turtle.turn(-45);
    	    expect(turtle.position().direction).toEqual(345);
    	    turtle.turn(90);
    	    expect(turtle.position().direction).toEqual(75);
    	});
    });

    describe("move(pixels)", function () {
    	it("should move the turtle location <pixels> in the turtle's direction", function () {
    	    this.addMatchers({
    		toRoundTo: function (expected) {
    		    return Math.round(this.actual) === expected;
    		},
    	    });
    	    var smallest_angle_of_3_4_5_right_triangle = 37;
    	    turtle.position({direction:smallest_angle_of_3_4_5_right_triangle});
    	    turtle.move(50);
    	    expect(turtle.position().x).toRoundTo(40);
    	    expect(turtle.position().y).toRoundTo(30);
    	});
    });
});

describe("TurtlePenDecorator", function () {
    var turtle, context;
    beforeEach(function () {
	context = jasmine.createSpyObj(
	    'context', 
	    'moveTo lineTo beginPath stroke clearRect'.split(' '));
	turtle = new Turtle.Pen(new Turtle(), context);
    });
    it("penDown() should call beginPath and change the pen to down", function () {
	expect(turtle.pendown).toBeDefined();
	expect(turtle.pendown().pen).toEqual("down");
    });
    it("penUp() should change the pen to up", function () {
	expect(turtle.penup).toBeDefined();
	expect(turtle.penup().pen).toEqual("up");
    });
    it("move() calls context.moveTo when up and context.lineTo when down", function () {
	turtle.move(20).pendown().move(30);
	expect(context.beginPath).toHaveBeenCalled();
	expect(context.moveTo).toHaveBeenCalledWith(20, 0);
	expect(context.lineTo).toHaveBeenCalledWith(50, 0);
	expect(context.stroke).toHaveBeenCalled();
    });
    it("clear() calls context.clearRect() and turtle.home()", function () {
	context.canvas = {width: 200, height: 100};
	turtle.turn(30).move(40).clear();
	expect(context.clearRect).toHaveBeenCalledWith(0,0,200,100);
	expect(turtle.position()).toEqual({direction:0, x:0, y:0});
    });
});

describe("TurtleShapeDecorator", function () {
    var turtle, shape, context;
    beforeEach(function () {
	context = jasmine.createSpyObj('context', [
	    'moveTo',
	    'lineTo',
	    'beginPath',
	    'stroke',
	    'clearRect',
	    'translate',
	    'rotate',
	    'save',
	    'restore',
	    'getImageData',
	    'putImageData'
	]);
	context.getImageData.andReturn('stubbedImageData');
	context.canvas = {width: 100, height: 80};
	shape = new Turtle.Recorder();
	shape.position({
	    direction:0, x:0, y:0
	}).turn(90).move(15).turn(120).move(30).turn(120).move(30).turn(120).move(15);
	spyOn(shape, "play");
	pen = new Turtle.Pen(new Turtle(), context);
	turtle = new Turtle.Shape(pen, shape);
    });
    it("should draw the triangle after home()", function () {
	turtle.home({direction: 60, x:50, y:40});
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(50, 40);
	expect(context.rotate).toHaveBeenCalledWith(Math.PI/3);
	expect(context.getImageData).toHaveBeenCalled();
	expect(shape.play).toHaveBeenCalledWith(pen);
	expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after changing the position()", function () {
	turtle.position({direction: 90, x:80, y:70});
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(80, 70);
	expect(context.rotate).toHaveBeenCalledWith(Math.PI/2);
	expect(context.getImageData).toHaveBeenCalled();
	expect(shape.play).toHaveBeenCalledWith(pen);
	expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after turn()", function () {
	turtle.turn(30);
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(0, 0);
	expect(context.rotate).toHaveBeenCalledWith(Math.PI/6);
	expect(context.getImageData).toHaveBeenCalled();
	expect(shape.play).toHaveBeenCalledWith(pen);
	expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after move()", function () {
	turtle.move(90);
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(90, 0);
	expect(context.rotate).toHaveBeenCalledWith(0);
	expect(context.getImageData).toHaveBeenCalled();
	expect(shape.play).toHaveBeenCalledWith(pen);
	expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after clear()", function () {
	turtle.clear();
	expect(context.clearRect).toHaveBeenCalledWith(0, 0, 100, 80);
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(0, 0);
	expect(context.rotate).toHaveBeenCalledWith(0);
	expect(context.getImageData).toHaveBeenCalled();
	expect(shape.play).toHaveBeenCalledWith(pen);
	expect(context.restore).toHaveBeenCalled();
    });
    it("should save and restore the background", function () {
	turtle.move(90).turn(90);
	expect(context.getImageData).toHaveBeenCalled();
	expect(context.putImageData).toHaveBeenCalled();
    });
});
