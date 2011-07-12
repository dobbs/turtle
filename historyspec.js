describe("TurtleHistory", function () {
    function Event(targetClassName, dataRevision, targetValue) {
        if (!dataRevision) 
            dataRevision = "revision1";
        return Turtle.extend(this, {
            target: {
                newname: {value: targetValue},
                className: targetClassName,
                parentNode: {
                    getAttribute: function (key) {return {"data-revision": dataRevision}[key];}
                }
            }
        });
    }
    Turtle.extend(Event.prototype, {
        stopPropagation: function () {},
        preventDefault: function () {}
    });
    var thistory, $editor, $history, localStorage;
    beforeEach(function(){
        $("#fixture").html('<form><textarea name="editor" id="editor"></textarea></form>');
        $editor = $("#editor");
        localStorage = jasmine.createSpyObj("storage", ['setItem', 'getItem', 'removeItem']);
        thistory = new Turtle.History($editor.get(0), localStorage);
        $history = $("#editor-history");
    });
    describe("constructor", function () {
        it("creates a section for the history UI if none exists", function () {
            expect($history.get(0)).toBeTruthy();
            expect($history.get(0).tagName).toEqual("SECTION");
        });
        it("uses an existing element for the history UI if one exists", function () {
            $("#fixture").append(
                '<div><form><input type="text" name="repl" id="repl"></form></div>'
                    + '<div id="repl-history"></div>');
            new Turtle.History($("#repl").get(0));
            expect($("#repl-history").get(0).tagName).toEqual("DIV");
        });
    });
    describe("creating a revision", function () {
        it("adds an element to the history", function () {
            $editor.val("// javascript code");
            thistory.create("revision1");
            var $result = $("#editor-history-revision1");
            expect($result.get(0)).toBeTruthy();
            expect($result.attr("data-revision")).toEqual("revision1");
            expect($result.parent().get(0)).toEqual($history.get(0));
            expect(localStorage.setItem).toHaveBeenCalledWith(
                "editor-history.revision1", "// javascript code");
        });
        describe("a new revision", function () {
            var $revision;
            beforeEach(function () {
                thistory.create("revision1");
                $revision = $("#editor-history-revision1");
            });
            it("includes a load link", function () {
                var $load = $revision.find("a.load");
                expect($load.get(0)).toBeTruthy();
                expect($load.text()).toEqual("revision1");
            });
            it("includes a remove link", function () {
                expect($revision.find("a.remove").get(0)).toBeTruthy();
            });
            it("includes a rename link and a rename-form", function () {
                expect($revision.find("a.rename").get(0)).toBeTruthy();
            });
        });
    });
    describe("removing a revision", function () {
        it("removes the element from the history when the remove link is clicked", function () {
            thistory.create("revision1");
            expect($("#editor-history-revision1").get(0)).toBeTruthy();
            thistory.remove("revision1");
            expect($("#editor-history-revision1").get(0)).toEqual(null);
            expect(localStorage.removeItem).toHaveBeenCalledWith("editor-history.revision1");
        });
    });
    describe("TurtleHistory internals", function () {
        describe("click and submit listeners dispatch events", function () {
            it("calls remove(revision) when 'remove' is clicked", function () {
                spyOn(thistory, "remove");
                thistory.handleEvent(new Event("remove"));
                expect(thistory.remove).toHaveBeenCalledWith("revision1");
            });
            it("calls load(revision) when 'load' is clicked", function () {
                spyOn(thistory, "load");
                thistory.handleEvent(new Event("load"));
                expect(thistory.load).toHaveBeenCalledWith("revision1");
            });
            it("calls show_form(revision) when 'rename' is clicked", function () {
                spyOn(thistory, "show_form");
                thistory.handleEvent(new Event("rename"));
                expect(thistory.show_form).toHaveBeenCalledWith("revision1");
            });
            it("calls rename(revision, name) when 'rename' is submitted", function () {
                spyOn(thistory, "rename");
                thistory.handleEvent(new Event("rename-form", "revision1", "newname"));
                expect(thistory.rename).toHaveBeenCalledWith("revision1", "newname");
            });
            it("calls create(revision) when the form is submitted", function () {
                spyOn(Date.prototype, "toJSON").andReturn("20110110T10:10:10");
                spyOn(thistory, "create");
                var event = new Event("input-form");
                event.target = thistory.input.form;
                thistory.handleEvent(event);
                expect(thistory.create).toHaveBeenCalledWith("20110110T10:10:10");
            });
        });
    });
    describe("renaming a revision", function() {
        beforeEach(function() {
            $editor.val("// console.log('plugh')");
            thistory.create("revision1");
        });
        it("reveals the rename form when the rename link is clicked", function () {
            thistory.handleEvent(new Event("rename"));
            expect($("#editor-history-revision1 form").attr("class")).not.toMatch(/turtle-hide/);
        });
        it("renames this revision when the rename form is submitted", function () {
            thistory.handleEvent(new Event("rename-form", "revision1", "nifty"));
            $editor.val("// console.log('xyzzy')");
            expect($("#editor-history-revision1").get(0)).toBeUndefined();
            expect($("#editor-history-nifty").get(0)).toBeTruthy();
            expect(localStorage.getItem).toHaveBeenCalledWith("editor-history.revision1");
            expect(localStorage.setItem).toHaveBeenCalledWith(
                "editor-history.nifty", "// console.log('plugh')");
            expect(localStorage.removeItem).toHaveBeenCalledWith("editor-history.revision1");
        });
        it("should ensure there is only one revision for a given name", function () {
            thistory.create("revision2");
            thistory.handleEvent(new Event("rename-form", "revision2", "revision1"));
            expect($(".revision").length).toEqual(1);
        });
    });
    describe("loading a revision", function() {
        beforeEach(function() {
            thistory.create("revision1");
        });
        it("copies the value from local storage to the value of the editor", function () {
            $editor.val("// something else");
            localStorage.getItem.andReturn("// console.log('plugh')");
            thistory.load("revision1");
            expect($editor.val()).toEqual("// console.log('plugh')");
        });
    });
});
