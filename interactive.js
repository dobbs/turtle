(function (window, document, undefined) {
    function interactiveCanvas(context, commandline) {
	var turtle = new Turtle.Shape(
	    new Turtle.Pen(
		new Turtle({x: Math.floor(context.canvas.width/2), 
			    y: Math.floor(context.canvas.height/2)}),
		context),
	    new Turtle.Recorder().turn(-90).move(5).turn(120).move(10).turn(120).move(10).turn(120).move(5)
	).clear();
	function interpreter () {
	    var args = commandline.value.toLowerCase().split(/[ ,.()]/);
	    var command = args.shift();
	    if (typeof(turtle[command]) === 'function') {
		try {
		    turtle[command].apply(turtle, args);
		}
		catch(err) {
		    console.log(err,': ', command, args);
		}
	    }
	    commandline.focus();
	    return false;
	}
	commandline.form.addEventListener("submit", interpreter);
	commandline.focus();
	Turtle.interactiveTurtle = turtle;
	return;
    }
    Turtle.interactiveCanvas = interactiveCanvas;
})(this, this.document);
