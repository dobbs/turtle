(function(window, document, undefined){
    function TurtleStorage (prefix, storage) {
        return Turtle.extend(this, {prefix: prefix, storage: storage});
    }
    Turtle.extend(TurtleStorage.prototype, {
        prefixedKey: function prefixedKey(key) {return this.prefix + "." + key;},
        keys: function keys() {
            var limit = this.storage.length, found = [];
            for(var i = 0; i < limit; i++) {
                var key = this.storage.key(i);
                if (key && key.indexOf(this.prefix) === 0) {
                    found.push(key.replace(this.prefix+".", ""));
                }
            }
            return found.sort();
        },
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
