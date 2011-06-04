(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function TurtleEditor(textarea, storage) {
	return extend(this, {textarea:textarea, storage:storage});
    }
    extend(TurtleEditor.prototype, {
	save_version: function save_version(name) {
	    this.storage.setItem("turtle."+name, this.textarea.value);
	    return;
	},
	load_version: function load_version(name) {
	    this.textarea.value = this.storage.getItem("turtle."+name);
	    return;
	},
	delete_version: function delete_version(name) {
	    this.storage.removeItem("turtle."+name);
	    return;
	}
    });
    window.Turtle.Editor = TurtleEditor;
})(this, this.document);
