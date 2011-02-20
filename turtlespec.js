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