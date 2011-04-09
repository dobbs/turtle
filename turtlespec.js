describe("Turtle", function () {
    var turtle;
    beforeEach(function () {
	turtle = new Turtle();
    });

    describe("new", function () {
    	it("should set default direction and position", function () {
    	    expect(turtle.direction()).toEqual(0);
    	    expect(turtle.position()).toEqual([0, 0]);
    	});

    	it("should use given direction and position as defaults", function () {
    	    turtle = new Turtle(60, [50, 40]);
    	    expect(turtle.direction()).toEqual(60);
    	    expect(turtle.position()).toEqual([50,40]);
    	});
    });

    describe("setDirection", function () {
    	it("should change turtle.direction()", function (){
    	    turtle.setDirection(30);
    	    expect(turtle.direction()).toEqual(30);
    	});

    	it("should convert directions greater than 360 degrees", function () {
    	    turtle.setDirection(400);
    	    expect(turtle.direction()).toEqual(40);
    	});

    	it("should convert negative degrees", function () {
    	    turtle.setDirection(-30);
    	    expect(turtle.direction()).toEqual(330);
    	    turtle.setDirection(-400);
    	    expect(turtle.direction()).toEqual(320);
    	});
    });

    describe("setPosition", function () {
    	it("should change turtle.position()", function () {
    	    turtle.setPosition(5, 20);
    	    expect(turtle.position()).toEqual([5, 20]);
    	});
    });

    describe("clear", function () {
    	function random(i, j) {return Math.floor(Math.random()*(j-i+1))+i}
    	it("should reset direction and position to defaults", function () {
    	    turtle.setDirection(random(0, 360));
    	    turtle.setPosition(random(-100, 100), random(-100, 100));
    	    turtle.clear();
    	    expect(turtle.direction()).toEqual(0);
    	    expect(turtle.position()).toEqual([0, 0]);
    	});

    	it("should reset direction and position to user specified defaults", function () {
    	    turtle = new Turtle(90, [80, 70]);
    	    turtle.setDirection(random(0, 360));
    	    turtle.setPosition(random(-100, 100), random(-100, 100));
    	    turtle.clear();
    	    expect(turtle.direction()).toEqual(90);
    	    expect(turtle.position()).toEqual([80, 70]);
    	});
    });

    describe("turn(degrees)", function () {
    	it("should change turtle.direction() relative to its current direction", function () {
    	    turtle.turn(30);
    	    expect(turtle.direction()).toEqual(30);
    	    turtle.turn(-45);
    	    expect(turtle.direction()).toEqual(345);
    	    turtle.turn(90);
    	    expect(turtle.direction()).toEqual(75);
    	});
    });

    describe("move(pixels)", function () {
    	it("should move the turtle.position() <pixels> in the turtle.direction()", function () {
    	    this.addMatchers({
    		toRoundTo: function (expected) {
    		    return Math.round(this.actual) === expected;
    		},
    	    });
    	    var smallest_angle_of_3_4_5_right_triangle = 37;
    	    turtle.setDirection(smallest_angle_of_3_4_5_right_triangle);
    	    turtle.move(50);
    	    expect(turtle.x()).toRoundTo(40);
    	    expect(turtle.y()).toRoundTo(30);
    	});
    });

    describe("use({toolname: tool})", function () {
    	it("should install the tool at turtle.toolname", function () {
    	    turtle.use({"atool":{"amethod":function(){}}});
    	    expect(turtle.atool).toBeDefined();
    	    expect(turtle.atool.amethod).toBeDefined();
    	});
    	it("should give each of the tools a reference back to the turtle", function () {
    	    var tool1 = {"amethod":function(){}};
    	    var tool2 = {"bmethod":function(){}};
    	    turtle.use({"atool":tool1, "btool":tool2});
    	    expect(tool1.holder).toBeDefined();
    	    expect(tool1.holder.move).toBeDefined();
    	    expect(tool2.holder).toBeDefined();
    	    expect(tool2.holder.turn).toBeDefined();
    	});
    	it("should register the tool with appropriate event_handlers", function () {
    	    var obj = {"amethod":function(){}, "signals": ["amethod"]};
    	    turtle.use({"atool":obj});
    	    expect(turtle.event_handlers["amethod"][0]).toBe(obj);
    	});
	it("should encapsulate event_handlers in turtle instances", function () {
	    var turtle2 = new Turtle();
    	    var objA = {"amethod":function(){}, "signals": ["amethod"]};
	    turtle.use({"atool":objA});
    	    var objB = {"bmethod":function(){}, "signals": ["bmethod"]};
	    turtle2.use({"btool":objB});
	    expect(turtle.event_handlers["amethod"]).toBeDefined();
	    expect(turtle.event_handlers["bmethod"]).toBeUndefined();
	    expect(turtle2.event_handlers["amethod"]).toBeUndefined();
	    expect(turtle2.event_handlers["bmethod"]).toBeDefined();
	});
    	it("should signal tool.methods when turtle.methods are called", function () {
    	    var tool = jasmine.createSpyObj('atool', ['move']);
    	    tool.signals = ["move"];
    	    turtle.use({"atool":tool});
    	    turtle.move(20);
    	    expect(tool.move).toHaveBeenCalledWith(20);
    	    expect(turtle.x()).toEqual(20);
    	});
    });

    describe("drop('toolname')", function () {
    	it("should remove the tool from the turtle", function () {
    	    turtle.use({"atool":{"amethod":function(){}}});
    	    expect(turtle.atool).toBeDefined();
    	    turtle.drop("atool");
    	    expect(turtle.atool).not.toBeDefined();
    	});
    	it("should remove the tool from all event handlers", function () {
    	    turtle.use({"atool":{"amethod":function(){}, "signals": ["amethod"]}});
    	    expect(turtle.event_handlers.amethod).toBeDefined();
    	    expect(turtle.event_handlers.amethod.length).toEqual(1);
    	    turtle.drop("atool");
    	    expect(turtle.event_handlers.amethod).not.toBeDefined();
    	});
    	it("should remove the reference to the turtle from the tool", function () {
    	    var tool = {"amethod":function(){}};
    	    turtle.use({"atool":tool});
    	    expect(tool.holder).toBeDefined();
    	    turtle.drop("atool");
    	    expect(tool.holder).not.toBeDefined();
    	});
    });

    describe("render", function () {
    	it("should pass render along to all of its tools", function () {
    	    var tool = jasmine.createSpyObj('atool', ['render']);
	    tool.signals = ["render"];
    	    turtle.use({"atool": tool});
    	    turtle.render();
    	    expect(tool.render).toHaveBeenCalled();
    	});
    });
});

describe("Turtle.Pen", function () {
    var turtle, pen;
    beforeEach(function () {
	this.addMatchers({
	    toRoundTo: function (expected) {
		return Math.round(this.actual) === expected;
	    },
	});
	turtle = new Turtle();
	pen = new Turtle.Pen();
	turtle.use({'pen': pen});
    });
    describe("new", function () {
	it("should should have an empty list of vertexes", function () {
	    expect(pen.vertexes.length).toEqual(0);
	});
    });
    describe("addVertex", function () {
	beforeEach(function(){pen.addVertex()});
	it("should increase the number of vertexes by 1", function () {
	    expect(pen.vertexes.length).toEqual(1);
	});
	it("should use the turtle's direction and position for the new vertex", function () {
	    expect(pen.vertexes[0].x()).toRoundTo(turtle.x());
	    expect(pen.vertexes[0].y()).toRoundTo(turtle.y());
	    expect(pen.vertexes[0].direction()).toEqual(turtle.direction());
	});
    });
    describe("pen.down", function () {
	it("should add a vertex at the current position", function () {
	    turtle.pen.up();
	    turtle.turn(90);
	    turtle.move(25);
	    turtle.pen.down();
	    expect(pen.vertexes.length).toEqual(1);
	    expect(pen.vertexes[0].x()).toRoundTo(0);
	    expect(pen.vertexes[0].y()).toRoundTo(25);
	    expect(pen.vertexes[0].direction()).toEqual(90);
	});
    });
    describe("move", function () {
	it("should only collect vertexes if the pen is down", function () {
	    turtle.pen.up();
	    turtle.move(50);
	    expect(pen.vertexes.length).toEqual(0);
	    turtle.pen.down();
	    expect(pen.vertexes.length).toEqual(1);
	    turtle.move(50);
	    expect(pen.vertexes.length).toEqual(2);
	});
    });
    it("should store the vertexes of the path as an ordered collection of turtles", function () {
	turtle.pen.down();
	turtle.move(9);
	turtle.turn(180 - 53);
	turtle.move(15);
	turtle.turn(180 - 37 - 37);
	turtle.move(15);
	turtle.turn(180 - 53);
	turtle.move(9);
	turtle.turn(90);
	turtle.pen.up();
	expect(pen.vertexes.length).toEqual(5);
	expect(pen.vertexes[0].position()).toEqual([0, 0]);
	expect(pen.vertexes[1].position()).toEqual([9, 0]);
	expect(pen.vertexes[2].x()).toRoundTo(0);
	expect(pen.vertexes[2].y()).toRoundTo(12);
	expect(pen.vertexes[3].x()).toRoundTo(-9);
	expect(pen.vertexes[3].y()).toRoundTo(0);
	expect(pen.vertexes[4].x()).toRoundTo(0);
	expect(pen.vertexes[4].y()).toRoundTo(0);
    });
    describe("visualizations", function () {
	var context, animation;
	beforeEach(function(){
	    turtle.pen.down();
	    turtle.move(9);
	    turtle.turn(180 - 53);
	    turtle.move(15);
	    turtle.turn(180 - 37 - 37);
	    turtle.move(15);
	    turtle.turn(180 - 53);
	    turtle.move(9);
	    turtle.turn(90);
	    turtle.pen.up();
	    context = jasmine.createSpyObj('context', [
		'beginPath',
		'moveTo',
		'lineTo',
		'stroke',
	    ]);
	    animation = pen.animation(context);
	});
	describe("render", function () {
	    it("should render a polygon to the given context", function () {
		turtle.setPosition(20, 30);
		turtle.setDirection(90);
		context.canvas = {height: 100, width: 200, getContext: function () {return context}};
		pen.render(context);
		expect(context.beginPath).toHaveBeenCalled();
		expect(context.moveTo).toHaveBeenCalledWith(
		    pen.vertexes[0].x(), pen.vertexes[0].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[1].x(), pen.vertexes[1].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[2].x(), pen.vertexes[2].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[3].x(), pen.vertexes[3].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[4].x(), pen.vertexes[4].y());
		expect(context.stroke).toHaveBeenCalled();
	    });
	});

	describe("animation", function () {
	    it("should generate an iterator", function () {
		expect(typeof animation.next).toEqual("function");
	    });
	    it("should let the first frame moveTo, but not lineTo", function (){
		animation.next();
		expect(context.beginPath).toHaveBeenCalled();
		expect(context.moveTo).toHaveBeenCalledWith(
		    pen.vertexes[0].x(), pen.vertexes[0].y());
		expect(context.lineTo).not.toHaveBeenCalled();
		expect(context.stroke).toHaveBeenCalled();
	    });
	    it("should call lineTo for subsequent frames", function () {
		animation.cursor = 2;
		animation.next();
		expect(context.beginPath).toHaveBeenCalled();
		expect(context.moveTo).toHaveBeenCalledWith(
		    pen.vertexes[0].x(), pen.vertexes[0].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[1].x(), pen.vertexes[1].y());
		expect(context.lineTo).toHaveBeenCalledWith(
		    pen.vertexes[2].x(), pen.vertexes[2].y());
		expect(context.stroke).toHaveBeenCalled();
	    });
	});
    });
});

describe("Turtle.Costume", function () {
    var turtle, pen, costume, context;
    it("if it's using a 'shape', then render lines for each vertex in the shape", function () {
	costume = new Turtle.Costume();
	costume.holder = new Turtle(60, [50, 40]);
	pen = new Turtle.Pen();
	pen.holder = new Turtle();
	[[0, 0], [0, 10], [10, 10], [10, 0]].map(function (point) {
	    pen.holder.setPosition(point[0], point[1]);
            pen.addVertex();
	});
	costume.use({"shape": pen});
    	context = jasmine.createSpyObj('context', [
    	    'save',
	    'translate',
	    'rotate',
	    'beginPath',
	    'moveTo',
	    'lineTo',
	    'stroke',
    	    'restore'
    	]);
    	context.canvas = {height: 100, width: 200, getContext: function () {return context}};
	costume.render(context);
	expect(context.save).toHaveBeenCalled();
	expect(context.translate).toHaveBeenCalledWith(50, 40);
	expect(context.rotate).toHaveBeenCalledWith(Math.PI/3);
	expect(context.beginPath).toHaveBeenCalled();
	expect(context.moveTo).toHaveBeenCalledWith(0, 0);
	expect(context.lineTo).toHaveBeenCalledWith(0, 10);
	expect(context.lineTo).toHaveBeenCalledWith(0, 10);
	expect(context.lineTo).toHaveBeenCalledWith(10, 10);
	expect(context.lineTo).toHaveBeenCalledWith(10, 0);
	expect(context.stroke).toHaveBeenCalled();
	expect(context.restore).toHaveBeenCalled();
    });
});
