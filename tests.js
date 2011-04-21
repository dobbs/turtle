test('var turtle = new Turtle(); // should set default position and direction', function () {
    var t = new Turtle();
    deepEqual([t.position().x, t.position().y], [0, 0], 'init position');
    equal(t.position().direction, 0, 'init direction');
});

test('var turtle = new Turtle({direction:60, x:50, y:40}); // should set default position and direction', function () {
    var t = new Turtle({direction:60, x:50, y:40});
    deepEqual(t.position(), {direction: 60, x:50, y:40}, 'init position');
});

test('turtle.home(); // should reset position and direction', function () {
    var t = new Turtle();
    function random(i, j) {return Math.floor(Math.random()*(j-i+1))+i}
    t.position({direction:random(0,365), x:random(-100,100), y:random(-100,100)});
    t.home();
    deepEqual(t.position(), {direction:0, x:0, y:0}, 'init position');
});

test('turtle.position({x:pixels, y:pixels}); // should change turtle.position', function () {
    var t = new Turtle();
    t.position({x:5, y:20});
    deepEqual([t.position().x, t.position().y], [5, 20], 'position');
});

test('turtle.position({degrees:degrees}); // should change turtle.direction', function () {
    var t = new Turtle();
    t.position({direction:30});
    equal(t.position().direction, 30);
    t.position({direction:345});
    equal(t.position().direction, 345);
    t.position({direction:400});
    equal(t.position().direction, 40);
    t.position({direction:-30});
    equal(t.position().direction, 330);
});

test('turtle.turn(degrees); // should change turtle.direction', function () {
    var t = new Turtle();
    t.turn(30);
    equal(t.position().direction, 30);
    t.turn(-45);
    equal(t.position().direction, 345);
    t.turn(90);
    equal(t.position().direction, 75);
});

test('turtle.move(pixels); // should change turtle.position', function () {
    var t = new Turtle();
    t.position({direction:37}); // smallest angle of a 3-4-5 right-triangle
    t.move(50);
    equal(Math.round(t.position().x), 40);
    equal(Math.round(t.position().y), 30);
});

test('var commands = new Turtle.Recorder(); // should queue turtle commands', function () {
    var q = new Turtle.Recorder();
    q.position({x:60, y:60});
    equal(q.queue.length, 1);
    q.penDown();
    equal(q.queue.length, 2);
    for (var i=3; i--;) {
     	q.turn(-120);
	q.move(50);
    }
    equal(q.queue.length, 8);
});

test('commands.play(view); // should execute each command against the view', function () {
    var q = new Turtle.Recorder();
    q.position({direction:60, x:60, y:60});
    q.penDown();
    for (var i=3; i--;) {
     	q.turn(-120);
	q.move(50);
    }
    var v = new LogView(window.console);
    q.play(v);
});

test('CanvasView(); // should draw turtle tracks on the canvas', function () {
    var q = new Turtle.Recorder();
    q.position({direction:60, x:60, y:60});
    q.penDown();
    for (var i=3; i--;) {
     	q.turn(-120);
	q.move(50);
    }
    var v = new CanvasView(document.getElementById('view'));
    var l = new LogView(window.console);
    q.play(v,l);
});