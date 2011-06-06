(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function TurtleEditor(textarea, storage, versionsNode) {
	var exampleNode;
	if (versionsNode) {
	    exampleNode = versionsNode.getElementsByClassName("example")[0];
	    versionsNode = null;
	}
	textarea.form.addEventListener("submit", this.formSubmitListener());
	extend(this, {textarea:textarea, storage:storage, exampleNode:exampleNode});
	exampleNode = null;
	return this;
    }
    extend(TurtleEditor.prototype, {
	saveVersion: function saveVersion(name) {
	    this.storage.setItem("turtle."+name, this.textarea.value);
	    this.appendVersionNode(name);
	    return;
	},
	loadVersion: function loadVersion(name) {
	    this.textarea.value = this.storage.getItem("turtle."+name);
	    return;
	},
	deleteVersion: function deleteVersion(name) {
	    this.storage.removeItem("turtle."+name);
	    this.removeVersionNode(name);
	    return;
	},
	versionReady: function versionReady() {
	    for(var version in this.storage) {
		if (version = version.replace(/^turtle\./, '')) {
		    this.appendVersionNode(version);
		}
	    }
	},
	formSubmitListener: function formSubmitListener() {
	    var editor = this;
	    return function saveAndRunVersion(e) {
	        e.stopPropagation();
	        e.preventDefault();
	        editor.run();
	        editor.saveVersion(new Date().toJSON());
	        return false;
	    };
	},
	versionNodeListener: function versionNodeListener() {
	    var editor = this;
	    return function restoreVersion(e) {
		editor.loadVersion(e.target.textContent);
		e.stopPropagation();
		e.preventDefault();
		return false;
	    };
	},
	appendVersionNode: function appendVersionNode(name) {
	    if (!this.exampleNode){return;}
	    var node = this.exampleNode.cloneNode();
	    node.id = "turtle."+name;
	    node.className = "";
	    node.textContent = name;
	    node.addEventListener("click", this.versionNodeListener());
	    this.exampleNode.parentNode.appendChild(node);
	    node = null;
	    return;
	},
	removeVersionNode: function removeVersionNode(name) {
	    if (!this.exampleNode){return;}
	    var node = document.getElementById("turtle."+name);
	    if (!node) {return;}
	    node.parentNode.removeChild(node);
	    node = null;
	    return;
	},
	run: function run() {
	    try {eval(this.textarea.value)}
	    catch (err) {console.log(err)};
	    return false;
	}
    });
    window.Turtle.Editor = TurtleEditor;
})(this, this.document);
