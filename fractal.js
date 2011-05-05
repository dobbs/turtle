(function (window, document, undefined) {
    var recorder = new Turtle.Recorder();
    function drawLine (pixels, depth) {
        if (depth > 0) {
            drawLine(pixels/3, depth-1);
            recorder.turn(60);
            drawLine(pixels/3, depth-1);
            recorder.turn(-120);
            drawLine(pixels/3,depth-1);
            recorder.turn(60);
            drawLine(pixels/3,depth-1);
        } else {
            recorder.move(pixels);
        }
        return;
    }
    function fractalLine(pixels, depth, turns) {
        if (depth > 0) {
            for (var i = 0; i < turns.length; i++) {
                recorder.turn(turns[i]);
                fractalLine(pixels/3, depth-1, turns);
            }
        } else {
            recorder.move(pixels);
        }
	return;
    }
    function von_koch (pixels, depth) {
        for (var i=3; i--;) {
            fractalLine(pixels, depth, [0, 60, -120, 60]);
            recorder.turn(-120);
        }
	return;
    }
    function peano (pixels, depth) {
        fractalLine(pixels, depth, [0, 90, -90, -90, -90, 90, 90, 90, -90]);
	return;
    }
    function drawFractal(canvas) {
	recorder.position({x:5, y:80});
	recorder.pendown();
	von_koch(90, 3);
	recorder.penup();
	recorder.position({x:105, y:55});
	recorder.pendown();
	peano(90, 3);
	recorder.playback({
	    turtle: new Turtle.Pen(new Turtle(), canvas.getContext('2d')),
	    interval: 5, 
	    opsPerStep: 1
	});
	return;
    };
    Turtle.drawFractal = drawFractal;
})(this, this.document);
