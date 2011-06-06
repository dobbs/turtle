describe("TurtleEditor", function () {
    var editor, textarea, storage;
    beforeEach(function () {
	textarea = {
	    value: "feed the birds", 
	    form:jasmine.createSpyObj("form", ["addEventListener"])
	};
	storage = jasmine.createSpyObj("storage", ["setItem", "getItem", "removeItem"]);
	editor = new Turtle.Editor(textarea, storage);
    });

    describe("saveVersion and loadVersion", function () {
        it("should save from and restore to the textarea's value", function () {
            editor.saveVersion("tuppence");
	    expect(storage.setItem).toHaveBeenCalledWith("turtle.tuppence", "feed the birds");
	    textarea.value = "";
	    storage.getItem.andReturn("feed the birds");
            editor.loadVersion("tuppence");
	    expect(storage.getItem).toHaveBeenCalledWith("turtle.tuppence");
	});

	it("should overwrite the previous save if given the same tag", function () {
            editor.saveVersion("tuppence");
	    textarea.value = "chim chim cheeroo";
            editor.saveVersion("tuppence");
	    expect(storage.setItem).toHaveBeenCalledWith("turtle.tuppence", "chim chim cheeroo");
	});
    });

    describe("deleteVersion", function () {
	it("should remove a saved version", function () {
            editor.saveVersion("tuppence");
	    editor.deleteVersion("tuppence");
	    expect(storage.removeItem).toHaveBeenCalledWith("turtle.tuppence");
	});
    });
});