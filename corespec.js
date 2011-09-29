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
            turtle = new Turtle({direction:Turtle.radians(60), x:50, y:40});
            expect(turtle.position()).toEqual({direction:Turtle.radians(60), x:50, y:40});
        });
    });

    describe("position({direction:degrees})", function () {
        it("should change turtle.position().direction", function () {
            turtle.position({direction:Turtle.radians(30)});
            expect(Turtle.degrees(turtle.position().direction)).toEqual(30);
        });

        it("should convert directions greater than 360 degrees", function () {
            turtle.position({direction:Turtle.radians(400)});
            expect(Turtle.degrees(turtle.position().direction)).toEqual(40);
        });

        it("should convert negative degrees", function () {
            turtle.position({direction:Turtle.radians(-30)});
            expect(Turtle.degrees(turtle.position().direction)).toEqual(330);
            turtle.position({direction:Turtle.radians(-400)});
            expect(Turtle.degrees(turtle.position().direction)).toEqual(320);
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
                direction:random(0, 2*Math.PI),
                x:random(-100, 100),
                y:random(-100, 100)
            });
            turtle.home();
            expect(turtle.position()).toEqual({direction:0, x:0, y:0});
        });

        it("should reset direction and position to user specified defaults", function () {
            turtle = new Turtle({direction:Turtle.radians(90), x:80, y:70});
            turtle.position({
                direction:random(0, 2*Math.PI),
                x:random(-100, 100),
                y:random(-100, 100)
            });
            turtle.home();
            expect(turtle.position()).toEqual({direction:Turtle.radians(90), x:80, y:70});
        });

        it("should also change the turtle's home when given arguments", function () {
            turtle.home({direction:Turtle.radians(15), x:25, y:35});
            expect(turtle.position()).toEqual({direction:Turtle.radians(15), x:25, y:35});
            turtle.position({
                direction:random(0, 2*Math.PI),
                x:random(-100, 100),
                y:random(-100, 100)
            });
            turtle.home();
            expect(turtle.position()).toEqual({direction:Turtle.radians(15), x:25, y:35});
        });
    });

    describe("turn(degrees)", function () {
        it("should change turtle.position().direction relative to its current direction", function () {
            turtle.turn(Turtle.radians(30));
            expect(Turtle.degrees(turtle.position().direction)).toEqual(30);
            turtle.turn(Turtle.radians(-45));
            expect(Turtle.degrees(turtle.position().direction)).toEqual(345);
            turtle.turn(Turtle.radians(90));
            expect(Turtle.degrees(turtle.position().direction)).toEqual(75);
        });
    });

    describe("move(pixels)", function () {
        it("should move the turtle location <pixels> in the turtle's direction", function () {
            this.addMatchers({
                toRoundTo: function (expected) {
                    return Math.round(this.actual) === expected;
                },
            });
            var smallest_angle_of_3_4_5_right_triangle = Turtle.radians(37);
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
    it("pendown() should call beginPath and change the pen to down", function () {
        expect(turtle.pendown).toBeDefined();
        expect(turtle.pendown().pen).toEqual("down");
    });
    it("penup() should change the pen to up", function () {
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
        turtle.turn(Turtle.radians(30)).move(40).clear();
        expect(context.clearRect).toHaveBeenCalledWith(0,0,200,100);
        expect(turtle.position()).toEqual({direction:0, x:0, y:0});
    });
    it("pencolor() sets context.strokeStyle", function () {
        turtle.pencolor("DarkOrchid");
        expect(turtle._pencolor).toEqual("DarkOrchid");
        expect(context.strokeStyle).toEqual("DarkOrchid");
    });
    it("pensize() sets context.lineWidth", function () {
        turtle.pensize(3);
        expect(context.lineWidth).toEqual(3);
    });
});

describe("TurtleShapeDecorator", function () {
    var turtle, context;
    beforeEach(function () {
        context = jasmine.createSpyObj('context', [
            'moveTo',
            'drawImage',
            'stroke',
            'fill',
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
        pen = new Turtle.Pen(new Turtle(), context);
        turtle = new Turtle.Shape(pen);
    });
    it("should draw the triangle after home()", function () {
        turtle.home({direction: Turtle.radians(60), x:50, y:40});
        expect(context.save).toHaveBeenCalled();
        expect(context.translate).toHaveBeenCalledWith(50, 40);
        expect(context.rotate).toHaveBeenCalledWith(Math.PI/3);
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after changing the position()", function () {
        turtle.position({direction: Turtle.radians(90), x:80, y:70});
        expect(context.save).toHaveBeenCalled();
        expect(context.translate).toHaveBeenCalledWith(80, 70);
        expect(context.rotate).toHaveBeenCalledWith(Math.PI/2);
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after turn()", function () {
        turtle.turn(Turtle.radians(30));
        expect(context.save).toHaveBeenCalled();
        expect(context.translate).toHaveBeenCalledWith(0, 0);
        expect(context.rotate).toHaveBeenCalledWith(Math.PI/6);
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after move()", function () {
        turtle.move(90);
        expect(context.save).toHaveBeenCalled();
        expect(context.translate).toHaveBeenCalledWith(90, 0);
        expect(context.rotate).toHaveBeenCalledWith(0);
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
    it("should draw the triangle after clear()", function () {
        turtle.clear();
        expect(context.clearRect).toHaveBeenCalledWith(0, 0, 100, 80);
        expect(context.save).toHaveBeenCalled();
        expect(context.translate).toHaveBeenCalledWith(0, 0);
        expect(context.rotate).toHaveBeenCalledWith(0);
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
    it("should save and restore the background", function () {
        turtle.move(90).turn(Turtle.radians(90));
        expect(context.getImageData).toHaveBeenCalled();
        expect(context.putImageData).toHaveBeenCalled();
    });
    it("should change the triangle fillStyle for pendown", function () {
        turtle.pendown();
        expect(turtle.shape.getContext('2d').fillStyle).toEqual("#000000");
        expect(context.drawImage).toHaveBeenCalled();
        turtle.penup();
        expect(context.drawImage).toHaveBeenCalled();
    });
    it("should set the triangle's fillStyle to match the pen's color", function () {
        turtle.pencolor("MediumSlateBlue").pendown();
        var ctx = turtle.shape.getContext('2d');
        expect(ctx.fillStyle).toEqual("#7b68ee");
        turtle.pendown().pencolor("Navy");
        expect(ctx.fillStyle).toEqual("#000080");
    }); 
});

describe("TurtleCommandRecorder", function () {
    var turtle, recorder;
    beforeEach(function () {
        turtle = jasmine.createSpyObj("turtle", [
            "home", "position", "turn", "move", "pendown", "penup", "clear"
        ]);
        recorder = new Turtle.Recorder();
    });
    it("should record the core turtle commands: home, position, turn, and move", function () {
        recorder.home().position({x: 10, y:20, direction:Turtle.radians(30)}).turn(Turtle.radians(40)).move(50);
        expect(recorder.queue.length).toEqual(4);
        recorder.queue[0].apply(undefined, [turtle]);
        expect(turtle.home).toHaveBeenCalled();
        recorder.queue[1].apply(undefined, [turtle]);
        expect(turtle.position).toHaveBeenCalledWith({x: 10, y: 20, direction: Turtle.radians(30)});
        recorder.queue[2].apply(undefined, [turtle]);
        expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(40));
        recorder.queue[3].apply(undefined, [turtle]);
        expect(turtle.move).toHaveBeenCalledWith(50);
    });
    it("should record the TurtlePenDecorator commands: pendown and penup", function () {
        recorder.pendown().penup();
        expect(recorder.queue.length).toEqual(2);
        recorder.queue[0].apply(undefined, [turtle]);
        expect(turtle.pendown).toHaveBeenCalled();
        recorder.queue[1].apply(undefined, [turtle]);
        expect(turtle.penup).toHaveBeenCalled();
    });
    it("should be able to play() back all recorded commands", function () {
        recorder.home().position({x: 10, y:20, direction:Turtle.radians(30)}).turn(Turtle.radians(40)).move(50).pendown().penup();
        recorder.play(turtle);
        expect(turtle.home).toHaveBeenCalled();
        expect(turtle.position).toHaveBeenCalledWith({x: 10, y: 20, direction: Turtle.radians(30)});
        expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(40));
        expect(turtle.move).toHaveBeenCalledWith(50);
        expect(turtle.pendown).toHaveBeenCalled();
        expect(turtle.penup).toHaveBeenCalled();
    });
    it("should be able to play() back all recorded commands animated", function () {
        recorder.home().position({x: 10, y:20, direction:Turtle.radians(30)}).turn(Turtle.radians(40)).move(50).pendown().penup();
        runs(function () {
            recorder.play(turtle, 50);
            expect(turtle.home).toHaveBeenCalled();
            expect(turtle.position).not.toHaveBeenCalled();
        });
        waits(60);
        runs(function () {
            expect(turtle.position).toHaveBeenCalled();
            expect(turtle.turn).not.toHaveBeenCalled();
        });
        waits(60);
        runs(function () {
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(40));
            expect(turtle.move).not.toHaveBeenCalled();
        });
        waits(60);
        runs(function () {
            expect(turtle.move).toHaveBeenCalledWith(50);
            expect(turtle.pendown).not.toHaveBeenCalled();
        });
        waits(60);
        runs(function () {
            expect(turtle.pendown).toHaveBeenCalled();
            expect(turtle.penup).not.toHaveBeenCalled();
        });
        waits(60);
        runs(function () {
            expect(turtle.penup).toHaveBeenCalled();
        });
    });
    it("should be able to animate recorded commands in chunks", function () {
        runs(function () {
            recorder.turn(0).move(5);
            recorder.turn(Turtle.radians(10)).move(15);
            recorder.turn(Turtle.radians(20)).move(25);
            recorder.turn(Turtle.radians(30)).move(35);
            recorder.turn(Turtle.radians(40)).move(45);
            recorder.turn(Turtle.radians(50)).move(55);
            recorder.turn(Turtle.radians(60)).move(65);
            recorder.play(turtle, 50, 4);
        });
        waits(51);
        runs(function () {
            expect(turtle.turn).toHaveBeenCalledWith(0);
            expect(turtle.move).toHaveBeenCalledWith(5);
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(10));
            expect(turtle.move).toHaveBeenCalledWith(15);
            expect(turtle.turn).not.toHaveBeenCalledWith(Turtle.radians(30));
        });
        waits(51);
        runs(function () {
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(20));
            expect(turtle.move).toHaveBeenCalledWith(25);
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(30));
            expect(turtle.move).toHaveBeenCalledWith(35);
            expect(turtle.turn).not.toHaveBeenCalledWith(Turtle.radians(50));
        });
        waits(51);
        runs(function () {
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(40));
            expect(turtle.move).toHaveBeenCalledWith(45);
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(50));
            expect(turtle.move).toHaveBeenCalledWith(55);
            expect(turtle.turn).not.toHaveBeenCalledWith(Turtle.radians(70));
        });
        waits(120);
        runs(function () {
            expect(turtle.turn).toHaveBeenCalledWith(Turtle.radians(60));
            expect(turtle.move).toHaveBeenCalledWith(65);
            expect(turtle.turn).not.toHaveBeenCalledWith(Turtle.radians(70));
        });
    });
});