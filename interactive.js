(function (window, document, undefined) {
    function interactiveCanvas(context, commandline) {
	var turtle = new Turtle.Shape(
	    new Turtle.Pen(
		new Turtle({x: Math.floor(context.canvas.width/2), 
			    y: Math.floor(context.canvas.height/2)}),
		context)).clear();
        new Turtle.ShellLite(commandline, turtle);
	commandline.focus();
	Turtle.interactiveTurtle = turtle;
	return;
    }
    window.Turtle.interactiveCanvas = interactiveCanvas;
})(this, this.document);
