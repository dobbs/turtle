(function(window, document, undefined){
    var REMOVE = "remove", LOAD = "load", RENAME = "rename", FORM = "rename-form";
    var HIDE = "turtle-hide";
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

    function TurtleHistory(input, localStorage) {
        var historyID = input.id+"-history";
        if (!localStorage)
            localStorage = window.localStorage;
        var element = document.getElementById(historyID);
        if (!element) {
            element = document.createElement("section");
            element.setAttribute("id", historyID);
            input.form.parentNode.appendChild(element);
        }
        var self = Turtle.extend(this, {
            prefix: historyID+"-",
            input: input,
            element: element,
            storage: new Turtle.Storage(historyID, localStorage)
        });
        input.form.addEventListener("submit", function (event) {
            return self.handleEvent(event);
        });
        element.addEventListener("click", function(event) {return self.handleEvent(event);});
        return self;
    }
    Turtle.extend(TurtleHistory.prototype, {
        fullRevisionName: function(name) {
            return this.prefix+name;
        },
        syncLocalStorage: function syncLocalStorage() {
            var self = this;
            self.element.innerHTML = "";
            var keys = self.storage.keys();
            keys.map(function(key) {self.create(key)});
            return;
        },
        create: function create(name) {
            var self = this;
            if (document.getElementById(this.fullRevisionName(name))) {
                return;
            }
            var placeholder = document.createElement("div");
            placeholder.innerHTML = REVISION_HTML;
            var newnode = placeholder.getElementsByClassName("revision")[0];
            newnode.setAttribute("id", this.fullRevisionName(name));
            newnode.setAttribute("data-revision", name);
            newnode.getElementsByClassName(LOAD)[0].textContent = name;
            newnode.getElementsByClassName(FORM)[0].addEventListener("submit", function (e) {
                return self.handleEvent(e);
            });
            this.element.appendChild(newnode);
            this.storage.setItem(name, this.input.value);
            return;
        },
        handleEvent: function (event) {
            event.stopPropagation(); 
            event.preventDefault();
            var revision = event.target.parentNode.getAttribute("data-revision");
            if (event.target === this.input.form) {
                this.create(new Date().toJSON());
                return false;
            }
            if (event.target.className.indexOf(FORM) > -1) {
                this.rename(revision, event.target.newname.value);
                return false;
            }
            var cases = {};
            cases[REMOVE] = this.remove;
            cases[LOAD] = this.load;
            cases[RENAME] = this.show_form;
            if (cases[event.target.className])
                cases[event.target.className].call(this, revision);
            return false;
        },
        load: function (revision) {
            this.input.value = this.storage.getItem(revision);
            return;
        },
        remove: function (revision) {
            this.storage.removeItem(revision);
            var element = document.getElementById(this.fullRevisionName(revision));
            if (element && element.parentNode && element.parentNode.removeChild)
                element.parentNode.removeChild(element);
            return;
        },
        show_form: function (revision) {
            var element = document.getElementById(this.fullRevisionName(revision));
            var form = element.getElementsByClassName(FORM)[0];
            if (form) {
                form.className = form.className.replace(HIDE,'').replace(/ +$/,'');
            }
            return;
        },
        rename: function (revision, newname) {
            this.storage.setItem(newname,
                                 this.storage.getItem(revision));
            this.storage.removeItem(revision);
            this.remove(revision);
            this.create(newname);
            return;
        }
    });
    window.Turtle.History = TurtleHistory;
})(this, this.document);

