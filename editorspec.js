describe("TurtleEditor", function () {
    var editor, textarea, storage;
    beforeEach(function () {
	textarea = {value: "feed the birds"};
	storage = jasmine.createSpyObj("storage", ["setItem", "getItem", "removeItem"]);
	editor = new Turtle.Editor(textarea, storage);
    });

    describe("save_version and load_version", function () {
        it("should save from and restore to the textarea's value", function () {
            editor.save_version("tuppence");
	    expect(storage.setItem).toHaveBeenCalledWith("turtle.tuppence", "feed the birds");
	    textarea.value = "";
	    storage.getItem.andReturn("feed the birds");
            editor.load_version("tuppence");
	    expect(storage.getItem).toHaveBeenCalledWith("turtle.tuppence");
	});

	it("should overwrite the previous save if given the same tag", function () {
            editor.save_version("tuppence");
	    textarea.value = "chim chim cheeroo";
            editor.save_version("tuppence");
	    expect(storage.setItem).toHaveBeenCalledWith("turtle.tuppence", "chim chim cheeroo");
	});
    });

    describe("delete_version", function () {
	it("should remove a saved version", function () {
            editor.save_version("tuppence");
	    editor.delete_version("tuppence");
	    expect(storage.removeItem).toHaveBeenCalledWith("turtle.tuppence");
	});
    });
});