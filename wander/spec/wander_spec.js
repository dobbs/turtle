describe('Turtle', function () {
    var turtle;
    beforeEach(function () {
        turtle = turtlespace.turtle();
        this.addMatchers({
            toRoundTo: function (expected, digits) {
                var tenx = digits ? 10^digits : 1;
                return Math.round(this.actual * tenx)/tenx === Math.round(expected * tenx)/tenx;
            },
        });
    });

    xit('should be able to tell one turtle to repeat the steps of another turtle');

    describe('turtle()', function () {
        it('sets default direction and position', function () {
            expect(turtle.x).toEqual(0);
            expect(turtle.y).toEqual(0);
            expect(turtle.direction).toEqual(-Math.PI/2);
        });

        it('uses given direction and position as defaults', function () {
            turtle = turtlespace.turtle({direction:Math.PI/3, x:50, y:40});
            expect(turtle.x).toEqual(50);
            expect(turtle.y).toEqual(40);
            expect(turtle.direction).toEqual(Math.PI/3);
        });
    });

    describe('change({direction:radians})', function () {
        it('changes turtle.change().direction', function () {
            turtle.change({direction:Math.PI/6});
            expect(turtle.direction).toEqual(Math.PI/6);
        });

        it('converts negative radians', function () {
            turtle.change({direction:-Math.PI/6});
            expect(turtle.direction).toEqual(11*Math.PI/6);
        });
    });

    describe('change({x:pixels, y:pixels})', function () {
        it('changes turtle.x and turtle.y', function () {
            turtle.change({x:5, y:20});
            expect([turtle.x,turtle.y]).toEqual([5, 20]);
        });
    });

    describe('change() history', function () {
        it('saves the state, function, and args that caused the change', function () {
            turtle.move(10);
            var record = turtlespace.history[turtle.name][0];
            expect(record.beforestate).toEqual({x: 0, y:0, direction: -Math.PI/2});
            expect(record.state.x).toRoundTo(0);
            expect(record.state.y).toRoundTo(-10);
            expect(record.state.direction).toEqual(-Math.PI/2);
            expect(record.fn).toEqual(turtlespace.move);
            expect(record.args).toEqual([10]);
        });

        it('saves history in reverse chronological order', function () {
            turtle.move(10);
            turtle.turn(Math.PI/3);
            var record0 = turtlespace.history[turtle.name][0];
            var record1 = turtlespace.history[turtle.name][1];
            expect(record1.fn).toEqual(turtlespace.move);
            expect(record0.fn).toEqual(turtlespace.turn);
        });
    });

    describe('turn(degrees)', function () {
        it('changes turtle.direction relative to its current direction', function () {
            turtle.turn(Math.PI/2 /*90degrees*/);
            expect(turtle.direction).toEqual(0);
            turtle.turn(Math.PI/6 /*30degrees*/);
            expect(turtle.direction).toEqual(Math.PI/6);
            turtle.turn(-Math.PI/4 /*-45degrees*/);
            expect(turtle.direction).toRoundTo(23*Math.PI/12 /*345degrees*/, 12);
            turtle.turn(Math.PI/2 /*90degrees*/);
            expect(turtle.direction).toRoundTo(5*Math.PI/12 /*75degrees*/, 12);
        });
    });

    describe('move(pixels)', function () {
        it('moves the turtle location <pixels> in its current direction', function () {
            var smallest_angle_of_3_4_5_right_triangle = 37*Math.PI/180;
            turtle.change({direction:smallest_angle_of_3_4_5_right_triangle});
            turtle.move(50);
            expect(turtle.x).toRoundTo(40);
            expect(turtle.y).toRoundTo(30);
        });
    });
});

describe('controls', function () {
    var controls;
    beforeEach(function () {
        controls = turtlespace.controls();
    });

    xit('pensize');
    xit('pencolor');
    xit('focus');

    it('next_movesize()', function () {
        controls.change({
            movesize: 10,
            movesize_options: [10, 20, 30, 40, 50, 60, 70],
        });
        controls.next_movesize();
        expect(turtlespace.named.controls.movesize).toEqual(20);
        controls.next_movesize();
        expect(turtlespace.named.controls.movesize).toEqual(30);
        controls.change({movesize: 60});
        controls.next_movesize();
        expect(turtlespace.named.controls.movesize).toEqual(70);
        controls.next_movesize();
        expect(turtlespace.named.controls.movesize).toEqual(10);
        controls.next_movesize();
        expect(turtlespace.named.controls.movesize).toEqual(20);
    });

    it('next_turnsize_numerator()', function () {
        controls.change({
            turnsize_numerator: 1,
            turnsize_denominator: 3,
            turnsize_numerator_options: [1, 2, 3]
        });
        controls.next_turnsize_numerator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(2);
        controls.next_turnsize_numerator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(3);
        controls.next_turnsize_numerator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(1);
    });

    it('next_turnsize_denominator()', function () {
        controls.change({
            turnsize_numerator: 1,
            turnsize_denominator: 1,
            turnsize_denominator_options: [1, 2, 3]
        });
        controls.next_turnsize_denominator()
        expect(turtlespace.named.controls.turnsize_denominator).toEqual(2);
        controls.next_turnsize_denominator();
        expect(turtlespace.named.controls.turnsize_denominator).toEqual(3);
        controls.next_turnsize_denominator();
        expect(turtlespace.named.controls.turnsize_denominator).toEqual(1);
    });

    it('numerator should wrap if it exceeds the denominator', function () {
        controls.change({
            turnsize_numerator: 2,
            turnsize_denominator: 3,
            turnsize_numerator_options: [1, 2, 3, 4, 5],
            turnsize_denominator_options: [1, 2, 3, 4, 5]
        });
        controls.next_turnsize_numerator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(3);
        controls.next_turnsize_numerator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(1);
    });

    it('if denominator drops below numerator, change numerator to 1', function () {
        controls.change({
            turnsize_numerator: 3,
            turnsize_denominator: 3,
            turnsize_numerator_options: [1, 2, 3, 4],
            turnsize_denominator_options: [1, 2, 3, 4]
        });
        controls.next_turnsize_denominator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(3);
        controls.next_turnsize_denominator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(1);
        controls.next_turnsize_denominator();
        expect(turtlespace.named.controls.turnsize_numerator).toEqual(1);
    });
});

describe('draw', function () {
    var turtle, context;
    beforeEach(function  () {
        turtle = turtlespace.turtle();
        context = {
            clearRect: jasmine.createSpy('clearRect'),
            translate: jasmine.createSpy('translate'),
            rotate: jasmine.createSpy('rotate'),
            beginPath: jasmine.createSpy('beginPath'),
            lineTo: jasmine.createSpy('lineTo'),
            moveTo: jasmine.createSpy('moveTo'),
            closePath: jasmine.createSpy('closePath'),
            stroke: jasmine.createSpy('stroke'),
            canvas: {
                width: 200,
                height: 100
            }
        };
    });
    describe('turtleShape', function  () {
        it('at the origin by default', function () {
            turtlespace.draw.turtleShape(context);
            expect(context.translate).toHaveBeenCalledWith(0, 0);
            expect(context.rotate).toHaveBeenCalledWith(-Math.PI/2);
        });
        it('at the end of the given turtle_path', function () {
            turtle.turn(Math.PI/2).move(30);
            turtlespace.draw.turtleShape(context, turtle.name);
            expect(context.translate).toHaveBeenCalledWith(30, 0);
            expect(context.rotate).toHaveBeenCalledWith(0);
        });
        it('with three line segments', function () {
            turtlespace.draw.turtleShape(context);
            expect(context.lineTo.callCount).toEqual(3);
            expect(context.stroke).toHaveBeenCalled();
        });
    });
    describe('turtlePath', function () {
        beforeEach(function  () {
            spyOn(turtlespace.draw, 'turtleShape');
            turtlespace.history.turtle = [];
            turtle.move(20).turn(Math.PI/2).move(50).move(10);
        });
        it('follows the turtle history', function () {
            turtlespace.draw.turtlePath(context, turtle.name);
            expect(context.lineTo.callCount).toEqual(3);
            expect(context.lineTo.mostRecentCall.args).toEqual([60, -20]);
        });
        it('also draws the turtleShape', function () {
            turtlespace.draw.turtlePath(context, turtle.name);
            expect(turtlespace.draw.turtleShape).toHaveBeenCalledWith(context, turtle.name);
        });
    });
});
