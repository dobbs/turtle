(function (window, document, undefined) {
    function extend(left, right) {for (var key in right) left[key] = right[key]; return left;}
    function versionFor(name){return "turtle." + name}
    function versionToString(version){return version.replace(/^turtle\./, '')}
    function stoppedEvent(e) {e.stopPropagation(); e.preventDefault(); return false;}
    function showElement(elt) {elt.className = elt.className.replace("hide", "").trim(); return;}
    function hideElement(elt) {
	if (elt.className.indexOf("hide") < 0) {elt.className = elt.className + " hide";}
	return;
    }
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
	    this.storage.setItem(versionFor(name), this.textarea.value);
	    this.appendVersionNode(name);
	    return;
	},
	copyVersion: function copyVersion(source, destination) {
	    this.storage.setItem(versionFor(destination), 
				 this.storage.getItem(versionFor(source)));
	    this.appendVersionNode(destination);
	    return;
	},
	loadVersion: function loadVersion(name) {
	    this.textarea.value = this.storage.getItem(versionFor(name));
	    return;
	},
	deleteVersion: function deleteVersion(name) {
	    this.storage.removeItem(versionFor(name));
	    this.removeVersionNode(name);
	    return;
	},
	versionReady: function versionReady() {
	    for(var version in this.storage) {
		if (version = versionToString(version)) {
		    this.appendVersionNode(version);
		}
	    }
	},
	formSubmitListener: function formSubmitListener() {
	    var editor = this;
	    return function saveAndRunVersion(e) {
	        editor.run();
	        editor.saveVersion(new Date().toJSON());
		return stoppedEvent(e);
	    };
	},
	loadNodeListener: function loadNodeListener() {
	    var editor = this;
	    return function restoreVersion(e) {
		editor.loadVersion(e.target.textContent);
		return stoppedEvent(e);
	    };
	},
	deleteNodeListener: function deleteNodeListener() {
	    var editor = this;
	    return function deleteVersion(e) {
		editor.deleteVersion(e.target.getAttribute("data-version"));
		return stoppedEvent(e);
	    };
	},
	renameNodeListener: function renameNodeListener() {
	    var editor = this;
	    return function showRenameForm(e) {
		var version = e.target.getAttribute("data-version");
		var form = document.forms[version]
		form.newname.value = version;
		showElement(form);
		form = null;
		return stoppedEvent(e);
	    }
	},
	renameFormSubmitListener: function renameFormSubmitListener() {
	    var editor = this;
	    return function renameVersion(e) {
		var form = e.target;
		var oldname = form.name;
		var newname = form.newname.value;
		if (oldname != newname) {
		    editor.copyVersion(oldname, newname);
		    editor.deleteVersion(oldname);
		}
		else {
		    hideElement(form);
		}
		form = null;
		return stoppedEvent(e);
	    };
	},
	appendVersionNode: function appendVersionNode(name) {
	    if (!this.exampleNode){return;}
	    var versionNode = this.exampleNode.cloneNode(true);
	    var loadNode = versionNode.getElementsByClassName("load")[0];
	    var renameNode = versionNode.getElementsByClassName("rename")[0];
	    var renameFormNode = versionNode.getElementsByClassName("rename-form")[0];
	    var deleteNode = versionNode.getElementsByClassName("delete")[0];
	    versionNode.id = versionFor(name);
	    versionNode.className = "";
	    loadNode.textContent = name;
	    loadNode.addEventListener("click", this.loadNodeListener());
	    renameNode.setAttribute("data-version", name);
	    renameNode.addEventListener("click", this.renameNodeListener());
	    renameFormNode.setAttribute("name", name);
	    renameFormNode.addEventListener("submit", this.renameFormSubmitListener());
	    deleteNode.setAttribute("data-version", name);
	    deleteNode.addEventListener("click", this.deleteNodeListener());
	    this.exampleNode.parentNode.appendChild(versionNode);
	    versionNode = null;
	    loadNode = null;
	    renameNode = null;
	    renameFormNode = null;
	    deleteNode = null;
	    return;
	},
	removeVersionNode: function removeVersionNode(name) {
	    if (!this.exampleNode){return;}
	    var versionNode = document.getElementById(versionFor(name));
	    if (!versionNode) {return;}
	    versionNode.parentNode.removeChild(versionNode);
	    versionNode = null;
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
