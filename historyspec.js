describe("TurtleHistory", function () {
    var thistory, $history;
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
            var event;
            beforeEach(function (){
                event = {
                    target: {
                        getAttribute: function (key) {return {"data-revision": "revision1"}[key];}
                    },
                    stopPropagation: function () {},
                    preventDefault: function () {}
                };
            });
            it("dispatches a click from a remove link to the remove method", function () {
                spyOn(thistory, "remove");
                event.target.className = "remove";
                thistory.handleEvent(event);
                expect(thistory.remove).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a click from a load link to the load method", function () {
                spyOn(thistory, "load");
                event.target.className = "load";
                thistory.handleEvent(event);
                expect(thistory.load).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a click from a rename link to the show_form method", function () {
                spyOn(thistory, "show_form");
                event.target.className = "rename";
                thistory.handleEvent(event);
                expect(thistory.show_form).toHaveBeenCalledWith("revision1");
            });
            it("dispatches a submit from a rename form to the rename method", function () {
                spyOn(thistory, "rename");
                event.target.className = "rename-form";
                event.target.value = "newname";
                thistory.handleEvent(event);
                expect(thistory.rename).toHaveBeenCalledWith("revision1", "newname");
            });
        });
    });
    xdescribe("renaming a revision", function() {
        it("reveals the rename form when the rename link is clicked", function () {});
        it("renames this revision when the rename form is submitted", function () {});
        it("replaces a revision when this one is saved with the same name", function () {});
    });
});