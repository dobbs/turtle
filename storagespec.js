describe("TurtleStorage", function () {
    var storage, localStorage;
    beforeEach(function before() {
        localStorage = jasmine.createSpyObj("localStorage", [
            "setItem", 
            "getItem", 
            "removeItem",
            "key",
        ]);
        localStorage.length = 5;
        var revisions = {
            "other-prefix.foo": "gack!",
            "other-prefix.phoo": "cough!",
            "prefix.bar": "BAR",
            "prefix.baz": "BAZ",
            "prefix.foo": "FOO",
        };
        localStorage.key.andCallFake(function(i) {
            return Object.keys(revisions).sort()[i];
        });
        localStorage.getItem.andCallFake(function(key) {
            return revisions[key];
        });
        storage = new Turtle.Storage("prefix", localStorage);
        storage.setItem("key1", "value1");
    });
    it("has a valid spy for localStorage", function () {
        expect(localStorage.key(0)).toEqual("other-prefix.foo");
        expect(localStorage.key(1)).toEqual("other-prefix.phoo");
        expect(localStorage.key(2)).toEqual("prefix.bar");
        expect(localStorage.getItem("other-prefix.foo")).toEqual("gack!");
        expect(localStorage.getItem("prefix.foo")).toEqual("FOO");
    });
    it("returns an array of storage keys with the prefix stripped", function () {
        expect(storage.keys()).toEqual(["bar", "baz", "foo"]);
    });
    it("should prefix the storage keys on setItem()", function setItem() {
        expect(localStorage.setItem).toHaveBeenCalledWith("prefix.key1", "value1");
    });
    it("should load the prefixed key on getItem()", function getItem() {
        var result = storage.getItem("key1");
        expect(localStorage.getItem).toHaveBeenCalledWith("prefix.key1");
    });
    it("should remove the prefixed key on removeItem()", function removeItem() {
        storage.removeItem("key1");
        expect(localStorage.removeItem).toHaveBeenCalledWith("prefix.key1");
    });
});

