describe("TurtleHistory", function () {
    var thistory, $history;
    function Event(targetClassName, targetValue) {
	Turtle.extend(this, {
            target: {
		className: targetClassName,
		getAttribute: function (key) {return {"data-revision": "revision1"}[key];}
	    }
        });
	if (targetValue)
	    this.target.value = targetValue;
	return this;
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
            thistory.appendRevisionNode("revision1");
            var $result = $("#turtle-history-revision1");
            expect($result.get(0)).toBeTruthy();
            expect($result.parent().get(0)).toEqual($history.get(0));
        });
        describe("a new revision", function () {
            var $revision;
            beforeEach(function () {
                thistory.appendRevisionNode("revision1");
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
            thistory.appendRevisionNode("revision1");
            expect($("#turtle-history-revision1").get(0)).toBeTruthy();
            thistory.remove("revision1");
            expect($("#turtle-history-revision1").get(0)).toEqual(null);
        });
    });
    describe("TurtleHistory internals", function () {
        describe("click and submit listeners", function () {
            it("dispatches a click from a remove link to the remove method", function () {
                spyOn(thistory, "remove");
                thistory.handleEvent(new Event("remove"));
                expect(thistory.remove).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a click from a load link to the load method", function () {
                spyOn(thistory, "load");
                thistory.handleEvent(new Event("load"));
                expect(thistory.load).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a click from a rename link to the show_form method", function () {
                spyOn(thistory, "show_form");
                thistory.handleEvent(new Event("rename"));
                expect(thistory.show_form).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a submit from a rename form to the rename method", function () {
                spyOn(thistory, "rename");
                thistory.handleEvent(new Event("rename-form", "newname"));
                expect(thistory.rename).toHaveBeenCalledWith("revision1", "newname");
            });
        });
    });
    describe("renaming a revision", function() {
        it("reveals the rename form when the rename link is clicked", function () {
            thistory.appendRevisionNode("revision1");
	    thistory.handleEvent(new Event("rename"));
	    expect($("#turtle-history-revision1 form").attr("class")).not.toMatch(/turtle-hide/);
	});
        it("renames this revision when the rename form is submitted", function () {});
        it("replaces a revision when this one is saved with the same name", function () {});
    });
});