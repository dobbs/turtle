test('var turtle = new Turtle(); // should set default position and direction', function () {
    var t = new Turtle();
    deepEqual(t.position, [0, 0], 'init position');
    equal(t.direction, 90, 'init direction');
});

test('turtle.clear(); // should reset position and direction', function () {
    var t = new Turtle();
    function random(i, j) {return Math.floor(Math.random()*(j-i+1))+i}
    t.setPosition([random(-100,100), random(-100,100)]);
    t.setDirection(random(0,365));
    t.clear();
    deepEqual(t.position, [0, 0], 'init position');
    equal(t.direction, 90, 'init direction');
});

test('turtle.setPosition([x, y]); // should change turtle.position', function () {
    var t = new Turtle();
    t.setPosition([5, 20]);
    deepEqual(t.position, [5, 20], 'setPosition');
});

test('turtle.setDirection(degrees); // should change turtle.direction', function () {
    var t = new Turtle();
    t.setDirection(30);
    equal(t.direction, 30);
    t.setDirection(345);
    equal(t.direction, 345);
    t.setDirection(400);
    equal(t.direction, 40);
    t.setDirection(-30);
    equal(t.direction, 330);
});

test('turtle.turn(degrees); // should change turtle.direction', function () {
    var t = new Turtle();
    t.turn(30);
    equal(t.direction, 120);
    t.turn(-45);
    equal(t.direction, 75);
    t.turn(-90);
    equal(t.direction, 345);
});

test('turtle.move(pixels); // should change turtle.position', function () {
    var t = new Turtle();
    t.setDirection(37); // smallest angle of a 3-4-5 right-triangle
    t.move(50);
    equal(Math.round(t.position[0]), 40);
    equal(Math.round(t.position[1]), 30);
});

test('view = new View(canvas); // queue turtle commands', function () {
    var canvas = document.getElementById('view');
    var v = new View(canvas);
    v.clear();
    equal(v.queue.length, 1);
    v.penDown();
    equal(v.queue.length, 2);
    for (var i=3; i--;) {
	v.move(50);
     	v.turn(60);
    }
    equal(v.queue.length, 8);

//    var ctx = canvas.getContext("2d");  
//    ctx.fillStyle = "rgb(200,0,0)";  
});

test('view.run(); // iterate and execute queue of commands', function () {
    var canvas = document.getElementById('view');
    var v = new View(canvas);
//    v.clear();
    v.setPosition([60,60]);
    v.penDown();
    for (var i=3; i--;) {
     	v.turn(120);
	v.move(50);
     }
    v.run();
    equal(v.queue.length, 8);
});