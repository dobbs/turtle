(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function TurtleEditor(textarea, storage) {
	return extend(this, {textarea:textarea, storage:storage});
    }
    extend(TurtleEditor.prototype, {
	saveVersion: function saveVersion(name) {
	    this.storage.setItem("turtle."+name, this.textarea.value);
	    return;
	},
	loadVersion: function loadVersion(name) {
	    this.textarea.value = this.storage.getItem("turtle."+name);
	    return;
	},
	deleteVersion: function deleteVersion(name) {
	    this.storage.removeItem("turtle."+name);
	    return;
	}
    });
    window.Turtle.Editor = TurtleEditor;
})(this, this.document);
