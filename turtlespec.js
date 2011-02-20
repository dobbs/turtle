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
	it("should move the turtle.position() given pixels in the turtle.direction()", function () {
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
});

describe("TurtlePath", function () {
    var path;
    beforeEach(function () {
	path = new TurtlePath();
    });
    describe("new", function () {
	it("should walk like a Turtle", function () {
	    expect(path.position()).toEqual([0, 0]);
	    expect(path.direction()).toEqual(0);
	    path.move(50);
	    expect(path.position()).toEqual([50, 0]);
	    path.turn(90);
	    path.move(30);
	    expect(path.position()).toEqual([50, 30]);
	});
	it("should should have one vertex that references itself", function () {
	    expect(path.vertexes.length).toEqual(1);
	    expect(path.vertexes[0].state).toEqual(path.state);
	});
    });
    describe("addVertex", function () {
	beforeEach(function(){path.addVertex()});
	it("should increase the number of vertexes by 1", function () {
	    expect(path.vertexes.length).toEqual(2);
	});
	it("should use the current direction and position for the new vertex", function () {
	    expect(path.vertexes[0].position()).toEqual(path.vertexes[0].position());
	});
	it("should become the new state for the path", function () {
	    path.move(50);
	    expect(path.position()).toEqual([50, 0])
	    expect(path.vertexes[1].position()).toEqual([50, 0]);
	    expect(path.vertexes[0].position()).toEqual([0, 0]);
	});
    });
    describe("move", function () {
	it("should only collect vertexes if the pen is down", function () {
	    path.penUp();
	    path.move(50);
	    expect(path.vertexes.length).toEqual(1);
	    path.penDown();
	    path.move(50);
	    expect(path.vertexes.length).toEqual(2);
	});
    });

    it("should store the vertexes of the path as an ordered collection of turtles", function () {
	this.addMatchers({
	    toRoundTo: function (expected) {
		return Math.round(this.actual) === expected;
	    },
	});
	path.penDown();
	path.move(9);
	path.turn(180 - 53);
	path.move(15);
	path.turn(180 - 37 - 37);
	path.move(15);
	path.turn(180 - 53);
	path.move(9);
	path.turn(90);
	path.penUp();
	expect(path.vertexes.length).toEqual(5);
	expect(path.direction()).toEqual(90);
	expect(path.vertexes[0].position()).toEqual([0, 0]);
	expect(path.vertexes[1].position()).toEqual([9, 0]);
	expect(path.vertexes[2].x()).toRoundTo(0);
	expect(path.vertexes[2].y()).toRoundTo(12);
	expect(path.vertexes[3].x()).toRoundTo(-9);
	expect(path.vertexes[3].y()).toRoundTo(0);
	expect(path.vertexes[4].x()).toRoundTo(0);
	expect(path.vertexes[4].y()).toRoundTo(0);
    }); 

    describe("render", function () {
	var context;
	beforeEach(function () {
	    path.penDown();
	    path.move(9);
	    path.turn(180 - 53);
	    path.move(15);
	    path.turn(180 - 37 - 37);
	    path.move(15);
	    path.turn(180 - 53);
	    path.move(9);
	    path.turn(90);
	    path.penUp();
	    context = jasmine.createSpyObj('context', [
		'beginPath',
		'moveTo',
		'lineTo',
		'stroke',
		'translate',
		'rotate'
	    ]);
	});
	it("should render a polygon to the given canvas", function () {
	    path.render({
		getContext: function (type) {return context}
	    });
	    expect(context.beginPath).wasCalled();
	    expect(context.moveTo).wasCalledWith(path.vertexes[0].x(), path.vertexes[0].y());
	    expect(context.lineTo).wasCalledWith(path.vertexes[1].x(), path.vertexes[1].y());
	    expect(context.lineTo).wasCalledWith(path.vertexes[2].x(), path.vertexes[2].y());
	    expect(context.lineTo).wasCalledWith(path.vertexes[3].x(), path.vertexes[3].y());
	    expect(context.lineTo).wasCalledWith(path.vertexes[4].x(), path.vertexes[4].y());
	    expect(context.stroke).wasCalled();
	});

	it("should use the head of the path for canvas translation and rotaton", function () {
	    path.setPosition(100,100);
	    path.render({
		getContext: function() {return context},
	    });
	    expect(context.translate).wasCalledWith(100, 100);
	});
    });
});