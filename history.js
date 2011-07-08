(function(window, document, undefined){
    var REVISION_HTML = '\
        <div class="revision">\
            <form class="rename-form turtle-hide">\
                <input type="text" name="newname" size="60">\
            </form>\
            <a href="" class="load">version</a>\
            <a href="" class="rename">&#x270e;</a>\
            <a href="" class="remove">&#x2715;</a>\
        </div>\
    ';

    function TurtleHistory(element) {
        var self = Turtle.extend(this, {
            element: element
        });
        element.addEventListener("click", function(event) {return self.handleEvent(event);});
        return self;
    }
    var REMOVE = "remove", LOAD = "load", RENAME = "rename", FORM = "rename-form";
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
            newnode.getElementsByClassName(LOAD)[0].textContent = name;
            newnode.getElementsByClassName(REMOVE)[0].setAttribute("data-revision", name);
            this.element.appendChild(newnode);
            return;
        },
        handleEvent: function (event) {
            event.stopPropagation(); 
            event.preventDefault();
            var revision = event.target.getAttribute("data-revision");
            if (event.target.className == FORM) {
                this.rename(revision, event.target.value);
                return false;
            }
            var cases = {};
            cases[REMOVE] = this.remove;
            cases[LOAD] = this.load;
            cases[RENAME] = this.show_form;
            cases[event.target.className] && cases[event.target.className].call(this, revision);
            return false;
        },
        load: function () {},
        remove: function (revision) {
            var element = document.getElementById(this.fullRevisionName(revision));
            element.parentNode.removeChild(element);
        },
        show_form: function () {},
        rename: function () {}
    });
    window.Turtle.History = TurtleHistory;
})(this, this.document);

