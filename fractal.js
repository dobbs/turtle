(function (window, document, undefined) {
    var q = new Turtle.Recorder();
    function drawLine (pixels, depth) {
        if (depth > 0) {
            drawLine(pixels/3, depth-1);
            q.turn(60);
            drawLine(pixels/3, depth-1);
            q.turn(-120);
            drawLine(pixels/3,depth-1);
            q.turn(60);
            drawLine(pixels/3,depth-1);
        } else {
            q.move(pixels);
        }
        return;
    }
    function fractalLine(pixels, depth, turns) {
        if (depth > 0) {
            for (var i = 0; i < turns.length; i++) {
                q.turn(turns[i]);
                fractalLine(pixels/3, depth-1, turns);
            }
        } else {
            q.move(pixels);
        }
	return;
    }
    function von_koch (pixels, depth) {
        for (var i=3; i--;) {
            fractalLine(pixels, depth, [0, 60, -120, 60]);
            q.turn(-120);
        }
	return;
    }
    function peano (pixels, depth) {
        fractalLine(pixels, depth, [0, 90, -90, -90, -90, 90, 90, 90, -90]);
	return;
    }
    function drawFractal(canvas) {
	q.position({x:5, y:80});
	q.penDown();
	von_koch(90, 3);
	q.penUp();
	q.position({x:105, y:55});
	peano(90, 3);
	var v = new CanvasView(canvas)
	q.playback({view: v, interval: 5, opsPerStep: 1});
	return;
    };
    window.drawFractal = drawFractal;
})(this, this.document);
