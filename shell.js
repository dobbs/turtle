(function (window, document, undefined) {
    function handleEventByEval(event) {
        event.stopPropagation();
        event.preventDefault();
        try {eval(this.input.value);}
        catch (err) {console.log(err);}
        return false;
    }
    function handleEventBySplit(event) {
        event.stopPropagation();
        event.preventDefault();
        var raw = this.input.value;
        var has_repeat = raw.match(/(\d+)x:/);
        var count = 1;
        if (has_repeat) {
            count = has_repeat[1];
            raw = raw.replace(/\d+x: */, '');
        }
        var cmds = raw.split(/ *\. */);
        for (var j = 0; j < count; j++) {
            for (var i = 0; i < cmds.length; i++) {
                var cmd = cmds[i];
                var args = cmd.split(/ +/);
                var method = args.shift().toLowerCase();
                if (!method)
                    continue;
                try {this.scope[method].apply(this.scope, args);}
                catch (err) {
                    console.log("cannot call "+method+"() with ", args, "\n", err);
                }
            }
        }
        return false;
    }
    function TurtleShell(inputElement, scope){
        var self = Turtle.extend(this, {input: inputElement});
        if (scope)
            Turtle.extend(self, {scope: scope, handleEvent: handleEventBySplit});
        else
            Turtle.extend(self, {handleEvent: handleEventByEval});
        inputElement.form.addEventListener("submit", function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        inputElement.addEventListener("change", function (e) {return self.handleEvent(e);});
        return self;
    }
    window.Turtle.Shell = TurtleShell;
    window.Turtle.ShellLite = TurtleShell;
})(this, this.document);