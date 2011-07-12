(function(window, document, undefined){
    function TurtleStorage (prefix, storage) {
        return Turtle.extend(this, {prefix: prefix, storage: storage});
    }
    Turtle.extend(TurtleStorage.prototype, {
        prefixedKey: function prefixedKey(key) {return this.prefix + '.' + key;},
        setItem: function setItem(key, value) {
            return this.storage.setItem(this.prefixedKey(key), value);
        },
        getItem: function getItem(key) {
            return this.storage.getItem(this.prefixedKey(key));
        },
        removeItem: function removeItem(key) {
            return this.storage.removeItem(this.prefixedKey(key));
        }
    });

    window.Turtle.Storage = TurtleStorage;
})(this, this.document);
