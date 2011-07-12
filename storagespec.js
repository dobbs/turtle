describe("TurtleStorage", function () {
    var storage, localStorage;
    beforeEach(function before() {
        localStorage = jasmine.createSpyObj("localStorage", [
            "setItem", 
            "getItem", 
            "removeItem"
        ]);
        storage = new Turtle.Storage("prefix", localStorage);
        storage.setItem("key1", "value1");
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

