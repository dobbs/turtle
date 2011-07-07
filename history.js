(function(window, document, undefined){
    var REVISION_HTML = '\
        <div class="revision">\
            <form class="rename-form turtle-hide">\
                <input type="text" name="newname" size="60">\
            </form>\
            <a href="" class="load">version</a>\
            <a href="" class="rename">&#x270e;</a>\
            <a href="" class="delete">&#x2715;</a>\
        </div>\
    ';

    function TurtleHistory(element) {
	var self = Turtle.extend(this, {
	    element: element
	});
    }
    var DELETE = "delete", LOAD = "load", RENAME = "rename", FORM = "rename-form";
    
    Turtle.extend(TurtleHistory.prototype, {
	fullRevisionName: function(name) {
	    return this.element.id+"-"+name;
	},
	appendRevisionNode: function appendRevisionNode(name) {
	    var self = this;
	    var placeholder = document.createElement("div");
	    placeholder.innerHTML = REVISION_HTML;
	    var newnode = placeholder.getElementsByClassName("revision")[0];
	    newnode.setAttribute("id", this.fullRevisionName(name));
	    newnode.getElementsByClassName("load")[0].textContent = name;
	    this.element.appendChild(newnode);
	    return;
	},
	click: function (event) {
	    console.log("inner click", event);
	    event.stopPropagation(); 
	    event.preventDefault();
	    if (event.target.className == DELETE) {
		this.delete(event.target.getAttribute("data-revision"));
	    }
	    else if (event.target.className == LOAD) {
		this.load(event.target.getAttribute("data-revision"));
	    }
	    else if (event.target.className == RENAME) {
		this.show_form(event.target.getAttribute("data-revision"));
	    }
	    return false;
	},
	submit: function (event) {
	    event.stopPropagation(); 
	    event.preventDefault();
	    if (event.target.className == FORM) {
		this.rename(event.target.getAttribute("data-revision"),
			    event.target.value);
	    }
	    return false;
	},
	load: function () {},
	delete: function (revision) {
	    var element = document.getElementById(this.fullRevisionName(revision));
	    console.log(revision, element);
	    element.parentNode.removeChild(element);
	},
	show_form: function () {},
	rename: function () {}
    });
    window.Turtle.History = TurtleHistory;
})(this, this.document);

