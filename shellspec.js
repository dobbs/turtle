describe("TurtleShell and TurtleShellLite", function () {
    var input, event, shell;
    beforeEach(function () {
        input = {
            className: "turtle-shell",
            value: '', 
            focus: function () {},
            form: {addEventListener: function () {}},
            addEventListener: function () {}
        };
        spyOn(input.form, "addEventListener");
        spyOn(input, "focus");
        spyOn(input, "addEventListener");
        event = {
            target: input,
            stopPropagation: function () {},
            preventDefault: function () {},
        };
        spyOn(event, "stopPropagation");
        spyOn(event, "preventDefault");
    });
    describe("TurtleShell.handleEvent", function () {
        beforeEach(function () {
            shell = new Turtle.Shell(input);
        });
        it("should add event listeners in the constructor", function () {
            expect(input.form.addEventListener).toHaveBeenCalled();
            expect(input.addEventListener).toHaveBeenCalled();
        });
        it("disable regular event handling", function () {
            var result = shell.handleEvent(event);
            expect(result).toEqual(false);
            expect(event.stopPropagation).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it("should evaluate the input.value", function () {
            window.evalWasCalled = 0;
            input.value = 'window.evalWasCalled = 1;'
            shell.handleEvent(event);
            expect(window.evalWasCalled).toEqual(1);
        });
        it("should echo errors to the console", function () {
            spyOn(window.console, "log");
            input.value = 'force(anError)';
            shell.handleEvent(event);
            expect(window.console.log).toHaveBeenCalled();
            var args = window.console.log.mostRecentCall.args[0];
            expect(args.name).toEqual("ReferenceError");
        });
    });
    describe("TurtleShellLite.handleEvent", function () {
        var scope;
        beforeEach(function () {
            scope = jasmine.createSpyObj("scope", ["methoda", "methodA", "methodc"]);
            shell = new Turtle.ShellLite(input, scope);
        });
        it("should add event listeners in the constructor", function () {
            expect(input.form.addEventListener).toHaveBeenCalled();
            expect(input.addEventListener).toHaveBeenCalled();
        });
        it("should split input.value & call scope[the first word]([the rest])", function () {
            input.value = 'methodA argument1   argument2';
            shell.handleEvent(event);
            expect(scope.methoda).toHaveBeenCalled();
            var args = scope.methoda.mostRecentCall.args;
            expect(args[0]).toEqual("argument1");
            expect(args[1]).toEqual("argument2");
            expect(scope.methodA).not.toHaveBeenCalled();
        });
        it("should report errors to the console", function () {
            spyOn(window.console, "log"); //.andCallThrough(); //handy for debugging this spec
            input.value = 'force anError';
            shell.handleEvent(event);
            expect(window.console.log).toHaveBeenCalled();
            var args = window.console.log.mostRecentCall.args;
            var err = args.pop(), msg = args.shift();
            expect(msg).toMatch(/cannot call force\(\) with/);
            expect(err.name).toEqual("TypeError");
        });
        it("should recognize multiple commands delimited by period (.)", function () {
            input.value = "methodA argument1  argument2. methodc argument3.";
            shell.handleEvent(event);
            expect(scope.methoda).toHaveBeenCalled();
            var args = scope.methoda.mostRecentCall.args;
            expect(args[0]).toEqual("argument1");
            expect(args[1]).toEqual("argument2");
            expect(scope.methodc).toHaveBeenCalled();
            expect(scope.methodc.mostRecentCall.args[0]).toEqual("argument3");
        });
        it("should repeat a command N times if it's prefixed with Nx:", function () {
            input.value = "3x: methodA argument3 argument2. methodc argument1";
            shell.handleEvent(event);
            expect(scope.methoda.callCount).toEqual(3);
            expect(scope.methodc.callCount).toEqual(3);
        });
    });
});