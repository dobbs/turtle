describe("TurtleHistory", function () {
    var thistory, $history;
    function Event(targetClassName, targetValue) {
        return Turtle.extend(this, {
            target: {
                newname: {value: targetValue},
                className: targetClassName,
                parentNode: {
                    getAttribute: function (key) {return {"data-revision": "revision1"}[key];}
                }
            }
        });
    }
    Turtle.extend(Event.prototype, {
        stopPropagation: function () {},
        preventDefault: function () {}
    });
    beforeEach(function(){
        $("#fixture").html('<section id="turtle-history"></section>');
        $history = $("#turtle-history");
        thistory = new Turtle.History($history.get(0));
    });
    describe("creating a revision", function () {
        it("adds an element to the history", function () {
            thistory.create("revision1");
            var $result = $("#turtle-history-revision1");
            expect($result.get(0)).toBeTruthy();
            expect($result.attr("data-revision")).toEqual("revision1");
            expect($result.parent().get(0)).toEqual($history.get(0));
        });
        describe("a new revision", function () {
            var $revision;
            beforeEach(function () {
                thistory.create("revision1");
                $revision = $("#turtle-history-revision1");
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
            expect($("#turtle-history-revision1").get(0)).toBeTruthy();
            thistory.remove("revision1");
            expect($("#turtle-history-revision1").get(0)).toEqual(null);
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
                thistory.handleEvent(new Event("rename-form", "newname"));
                expect(thistory.rename).toHaveBeenCalledWith("revision1", "newname");
            });
        });
    });
    describe("renaming a revision", function() {
        beforeEach(function() {
            thistory.create("revision1");
        });
        it("reveals the rename form when the rename link is clicked", function () {
            thistory.handleEvent(new Event("rename"));
            expect($("#turtle-history-revision1 form").attr("class")).not.toMatch(/turtle-hide/);
        });
        it("renames this revision when the rename form is submitted", function () {
            thistory.handleEvent(new Event("rename-form", "nifty"));
            expect($("#turtle-history-revision1").get(0)).toBeUndefined();
            expect($("#turtle-history-nifty").get(0)).toBeTruthy();
        });
        xit("replaces a revision when this one is saved with the same name", function () {});
    });
});
