var turtlespace = turtlespace || {};
(function($, undefined){

    var COMMAND_BUFFER = 'command_buffer';

    function history_iter(name, fn, prepareFn, concludeFn) {
        var history = turtlespace.history[name];
        if (prepareFn && typeof prepareFn.call != 'undefined')
            prepareFn();
        for (var i = history.length; --i >= 0;) {
            fn(history[i]);
        }
        if (concludeFn && typeof concludeFn.call != 'undefined')
            concludeFn();
    }

    $.extend(turtlespace, {
        named: {
            origin: {
                name:'origin',
                x:0/*pixels*/, 
                y:0/*pixels*/, 
                direction:-Math.PI/2/*radians*/,
                pensize: 1/*pixels*/,
                pencolor: 'black'/*(any CSS color)*/,
                movesize: 30/*pixels*/,
                turnsize: Math.PI/3/*radians*/,
                turnsize_numerator: 1,
                turnsize_denominator: 6
            },
            controls: {
                movesize: 30/*pixels*/,
                movesize_options: [],
                turnsize: Math.PI/3/*radians*/,
                turnsize_numerator: 1,
                turnsize_numerator_options: [],
                turnsize_denominator: 6,
                turnsize_denominator_options: [],
                pensize: 1/*pixels*/,
                pencolor: 'black'/*(any CSS Color)*/
            },
        },

        history: {},

        change: function change(that, fields, fn, args) {
            if (typeof fields.x !== 'undefined')
                that.x = parseFloat(fields.x);
            if (typeof fields.y !== 'undefined')
                that.y = parseFloat(fields.y);
            if (typeof fields.direction !== 'undefined') {
                var newdirection = parseFloat(fields.direction);
                var circumference = parseFloat(2*Math.PI);
                while (newdirection > circumference) {
                    newdirection = newdirection - circumference;
                }
                while (newdirection < 0) {
                    newdirection = newdirection + circumference;
                }
                that.direction = newdirection;
            }
        },

        saveAnd: function saveAnd(fn, that, args) {
            var before = $.extend({}, that);
            args = $.isArray(args) ? args : [args]
            fn.apply(undefined, [that].concat(args));
            var moment = {
                fn: fn, 
                args: args,
                beforestate: {
                    x: before.x,
                    y: before.y,
                    direction: before.direction
                },
                state: {
                    x: that.x,
                    y: that.y,
                    direction: that.direction
                }
            };
            turtlespace.history[before.name].unshift(moment);
            turtlespace.history[COMMAND_BUFFER].unshift(moment);
        },

        change_controls: function change_controls(that, fields) {
            if (fields.movesize)
                that.movesize = parseFloat(fields.movesize);
            if (fields.movesize_options)
                that.movesize_options = fields.movesize_options;
            if (fields.turnsize_numerator_options)
                that.turnsize_numerator_options = fields.turnsize_numerator_options;
            if (fields.turnsize_denominator_options)
                that.turnsize_denominator_options = fields.turnsize_denominator_options;

            var numerator = parseFloat(fields.turnsize_numerator);
            var denominator = parseFloat(fields.turnsize_denominator);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator != 0) {
                that.turnsize_denominator = denominator;
                that.turnsize_numerator = (numerator || 1);
                that.turnsize = 2 * Math.PI * that.turnsize_numerator / that.turnsize_denominator;
            }
            if (fields.turnsize)
                that.turnsize = parseFloat(fields.turnsize);
            for(var key in turtlespace.named.origin) {
                if ($.isFunction(that[key]))
                    continue;
                turtlespace.named[that.name][key] = that[key];
            }
        },

        move: function move(that, pixels) {
            var p = parseFloat(pixels);
            turtlespace.change(that, {
                x: Math.cos(that.direction) * p + that.x,
                y: Math.sin(that.direction) * p + that.y
            }, turtlespace.move, [pixels]);
            if (that.after_move && that.after_move.call)
                that.after_move(that);
            return that;
        },

        turn: function turn(that, radians) {
            turtlespace.change(that, {
                direction:that.direction + parseFloat(radians)
            }, turtlespace.turn, [radians]);
            return that;
        },

        setmovesize: function setmovesize(that, pixels) {
            turtlespace.change_controls(that, {movesize: pixels});
            return that;
        },

        setturnsize_numerator_denominator: function setturnsize_numerator_denominator(
            that, numerator, denominator) {
            turtlespace.change_controls(that, {
                turnsize_numerator: numerator || that.turnsize_numerator,
                turnsize_denominator: denominator || that.turnsize_denominator
            });
        },

        turtle: function turtle(options) {
            if (!options)
                options = {};
            if (!options.name)
                options.name = 'c_turtle_'+(Object.keys(turtlespace.named).length + 1);
            var that = turtlespace.named[options.name] || $.extend({}, turtlespace.named.origin);
            $.extend(that, options);
            if (turtlespace.named[that.name] === undefined)
                turtlespace.named[that.name] = that;
            if (turtlespace.history[that.name] === undefined)
                turtlespace.history[that.name] = [];
            $.extend(that, {
                change: function change(fields) {
                    turtlespace.saveAnd(turtlespace.change, that, fields);
                },
                move: function move(pixels) {
                    turtlespace.saveAnd(turtlespace.move, that, pixels); 
                    return that;
                },
                turn: function turn(radians) {
                    turtlespace.saveAnd(turtlespace.turn, that, radians); 
                    return that;
                }
            });
            return that;
        },

        controls: function controls(options) {
            if (!options)
                options = {};
            if (!options.name)
                options.name = 'controls';
            var that = $.extend({}, turtlespace.named[options.name] || {}, options);
            if (turtlespace.named[that.name] === undefined)
                turtlespace.named[that.name] = $.extend({}, that);
            $.extend(that, {
                change: function change(fields) {turtlespace.change_controls(that, fields)},
                next_movesize: function next_movesize() {
                    var current = that.movesize;
                    var options = [].concat(that.movesize_options);
                    for(var i = 0, j = 1; i < options.length; i++, j++) {
                        if (current != parseInt(options[i]))
                            continue;
                        turtlespace.setmovesize(that, options[j] || options[0]);
                        break;
                    }
                },
                next_turnsize_numerator: function next_turnsize_numerator() {
                    var current = that.turnsize_numerator;
                    var options = [].concat(that.turnsize_numerator_options);
                    for(var i = 0, j = 1; i < options.length; i++, j++) {
                        if (options[i] == that.turnsize_denominator) {
                            turtlespace.setturnsize_numerator_denominator(that, options[0]);
                            break;
                        }
                        if (current != parseInt(options[i]))
                            continue;
                        turtlespace.setturnsize_numerator_denominator(
                            that, options[j] || options[0]);
                        break;
                    }
                },
                next_turnsize_denominator: function next_turnsize_denominator() {
                    var current = that.turnsize_denominator;
                    var options = [].concat(that.turnsize_denominator_options);
                    for(var i = 0, j = 1; i < options.length; i++, j++) {
                        if (current != parseInt(options[i]))
                            continue;
                        turtlespace.setturnsize_numerator_denominator(
                            that, undefined, options[j] || options[0]);
                        if (that.turnsize_denominator < that.turnsize_numerator)
                            turtlespace.setturnsize_numerator_denominator(that, 1);
                        break;
                    }
                }
            });
            return that;
        },

        save_history: function save_history(that, name) {
            turtlespace.history[name] = [].concat(turtlespace.history[that.name]);
        },

        repeat_history: function repeat_history(that, name) {
            history_iter(name, function (moment) {
                var args = [that].concat(moment.args);
                moment.fn.apply(undefined, args);
            });
        },

        update_ui: function update_ui() {
            var controls = turtlespace.controls();
            function drawTurtleShape(context, turtle_name) {
                var position = turtlespace.history[turtle_name][0];
                if (position) {
                    context.translate(position.state.x, position.state.y);
                    context.rotate(position.state.direction);
                } 
                else {
                    context.translate(turtlespace.named.origin.x, turtlespace.named.origin.y);
                    context.rotate(turtlespace.named.origin.direction);
                }
                var nudge = 4;
                context.beginPath();
                context.moveTo(0 - nudge, 0);
                context.lineTo(0 - nudge, 5);
                context.lineTo(13 - nudge, 0);
                context.lineTo(0 - nudge, -5);
                context.closePath();
                context.stroke();
            }
            function turtlePathBoundingBox(turtle_name) {
                var MAXINT = Math.pow(2,52); //intentionally half the max allowed by ECMAscript
                var Xmin = 0, Ymin = 0, Xmax = 0, Ymax = 0;
                var visitor = $.extend({}, turtlespace.named.origin, {
                    name: 'turtlePathBoundingBoxVisitor',
                    after_move: function after_move(that) {
                        Xmin = Math.min(Math.ceil(that.x), Xmin);
                        Ymin = Math.min(Math.ceil(that.y), Ymin);
                        Xmax = Math.max(Math.floor(that.x), Xmax);
                        Ymax = Math.max(Math.floor(that.y), Ymax);
                    },
                });
                turtlespace.repeat_history(visitor, turtle_name);
                return {Xmin:Xmin, Ymin:Ymin, Xmax:Xmax, Ymax:Ymax};
            }
            function drawTurtlePathIcon(context, turtle_name) {
                var boundaries = turtlePathBoundingBox(turtle_name);
                var canvas = context.canvas;
                var padding = 30;
                var width = padding + boundaries['Xmax'] - boundaries['Xmin'];
                var height = padding + boundaries['Ymax'] - boundaries['Ymin'];
                var scale =  Math.max(canvas.width, canvas.height) / Math.max(width, height);
                context.save();
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.scale(scale, scale);
                context.translate(
                        -(boundaries['Xmin'] - padding/2) + Math.max((height-width)/2, 0), 
                        -(boundaries['Ymin'] - padding/2) + Math.max((width-height)/2, 0)
                );
                context.beginPath();
                context.lineWidth = 1/scale;
                context.moveTo(0, 0);
                var pen = $.extend({}, turtlespace.named.origin, {
                    name: 'turtle_icon_pen',
                    after_move: function after_move(that) {context.lineTo(that.x, that.y);},
                });
                turtlespace.repeat_history(pen, turtle_name);
                context.stroke();
                drawTurtleShape(context, turtle_name);
                context.restore();
            }
            function drawTurtlePath(context, turtle_name) {
                if (!turtle_name)
                    turtle_name = 'turtle';
                var canvas = context.canvas;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
                context.translate(canvas.width/2, canvas.height/2);
                context.beginPath();
                context.moveTo(0, 0);
                var pen = $.extend({}, turtlespace.named.origin, {
                    name: 'turtle_pen',
                    after_move: function after_move(that) {context.lineTo(that.x, that.y);},
                });
                turtlespace.repeat_history(pen, turtle_name);
                context.stroke();
                drawTurtleShape(context, turtle_name);
                context.restore();
            }
            function drawTurnsizeNumerator(context) {
                var radius = context.canvas.height/2 - 2;
                context.beginPath();
                context.moveTo(0, 0);
                context.arc(0, 0, radius, 0, 
                            2*Math.PI*controls.turnsize_numerator/controls.turnsize_denominator);
                context.fillStyle = '#777';
                context.fill();
            }
            function drawTurnsizeDenominator(context) {
                var radius = context.canvas.height/2 - 2;
                context.beginPath();
                context.moveTo(0, 0);
                context.arc(0, 0, radius, 0, 2*Math.PI);
                context.closePath();
                for (var i = 0; i < controls.turnsize_denominator; i++) {
                    context.moveTo(0, 0);
                    context.lineTo(radius * Math.cos(i*2*Math.PI/controls.turnsize_denominator), 
                                   radius * Math.sin(i*2*Math.PI/controls.turnsize_denominator));
                }
                context.strokeStyle = '#aaa';
                context.stroke();
            }
            function drawTurnsize(context) {
                drawTurnsizeNumerator(context);
                drawTurnsizeDenominator(context);
            }
            function withTurnTransform(context, x, fn, flipVertical) {
                var canvas = context.canvas;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
                context.translate(canvas.width/2, canvas.height/2);
                if (flipVertical)
                    context.scale(-1, 1);
                context.rotate(-Math.PI/2);
                fn(context);
                context.restore();
            }
            function drawHistories($history) {
                var turtle = turtlespace.named.turtle;
                $history.empty();
                for (var turtle_name in turtlespace.history) {
                    if (turtlespace.named[turtle_name]
                        && turtlespace.named[turtle_name].exclude_from_draw_histories)
                        continue;
                    var moment = document.createElement('a');
                    $(moment)
                        .attr('href', '')
                        .addClass('turtle-play ' + turtle_name)
                        .data('turtle-name', turtle_name)
                        .append('<canvas width="32" height="32">');
                    var context = $('canvas', moment).get(0).getContext('2d');
                    drawTurtlePathIcon(context, turtle_name);
                    $history.append(moment);
                }
                $('a.turtle-play').click(function(event) {
                    event.preventDefault();
                    turtlespace.saveAnd(turtlespace.repeat_history, turtlespace.named.turtle,
                                        [$(event.target).parent().data('turtle-name'), 0]);
                    turtlespace.update_ui();
                    return false;
                });
            }
            function drawMove(context) {
                var moment = turtlespace.history.turtleMoveControl[0];
                moment.args[0] = turtlespace.named.controls.movesize;
                moment.state.y = -turtlespace.named.controls.movesize;
                drawTurtlePathIcon(context, 'turtleMoveControl');
            }

            drawMove($('.controls canvas.turtle-move').get(0).getContext('2d'));

            var right = $('.controls canvas.turtle-turn-right').get(0);
            withTurnTransform(right.getContext('2d'), 0, drawTurnsize);

            var left = $('.controls canvas.turtle-turn-left').get(0);
            withTurnTransform(left.getContext('2d'), left.width, drawTurnsize, true);

            var numerator = $('.controls canvas.turtle-setturnsize-numerator').get(0);
            withTurnTransform(numerator.getContext('2d'), 8, drawTurnsizeNumerator);

            var denominator = $('.controls canvas.turtle-setturnsize-denominator').get(0);
            withTurnTransform(denominator.getContext('2d'), 8, drawTurnsizeDenominator);

            var playground = $('.tracks .turtle').get(0);
            drawTurtlePath(playground.getContext('2d'));

            drawHistories($('.history'));

            function textButton(text, context) {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.textAlign = 'center';
                context.strokeText(text, 16, 20);
            }

            textButton(turtlespace.named.controls.movesize,
                       $('.controls canvas.turtle-setmovesize').get(0).getContext('2d'));
            textButton('clear', $('.controls canvas.turtle-clear').get(0).getContext('2d'));
            drawTurtlePathIcon($('.controls canvas.turtle-save-history').get(0).getContext('2d'),
                               'turtle');
        },

        initialize_ui: function initialize_ui() {
            var turtle = turtlespace.turtle({name: 'turtle'});
            turtlespace.named[COMMAND_BUFFER] = $.extend({
            }, turtlespace.named.origin, {
                name: COMMAND_BUFFER,
                exclude_from_draw_histories: true
            });
            turtlespace.named.turtle.exclude_from_draw_histories = true;
            turtlespace.history[COMMAND_BUFFER] = [];
            turtlespace.named.controls.turnsize_numerator_options = [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ];
            turtlespace.named.controls.turnsize_denominator_options = [
                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
            ];
            turtlespace.named.controls.movesize_options = [
                5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80
            ];
            var moveButtonVisitor = turtlespace.named.turtleMoveControl;
            if (!moveButtonVisitor) {
                moveButtonVisitor = turtlespace.turtle({
                    name: 'turtleMoveControl',
                    exclude_from_draw_histories: true
                });
                var cbh = turtlespace.history[COMMAND_BUFFER];
                turtlespace.history[COMMAND_BUFFER] = [];
                moveButtonVisitor.move(turtlespace.named.controls.movesize);
                turtlespace.history[COMMAND_BUFFER] = cbh;
            }
            var controls = turtlespace.controls();
            $('.controls .link-turtle-move').click(function (event) {
                event.preventDefault();
                turtle.move(controls.movesize);
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-turn-left').click(function (event) {
                event.preventDefault();
                turtle.turn(-controls.turnsize);
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-turn-right').click(function (event) {
                event.preventDefault();
                turtle.turn(controls.turnsize);
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-setmovesize').click(function (event) {
                event.preventDefault();
                controls.next_movesize();
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-setturnsize-numerator').click(function (event) {
                event.preventDefault();
                controls.next_turnsize_numerator();
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-setturnsize-denominator').click(function (event) {
                event.preventDefault();
                controls.next_turnsize_denominator();
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-clear').click(function (event) {
                event.preventDefault();
                var canvas = $('.tracks .turtle').get(0);
                var context = canvas.getContext('2d');
                turtlespace.change(turtlespace.named.turtle, {
                    x: turtlespace.named.origin.x,
                    y: turtlespace.named.origin.y,
                    direction: turtlespace.named.origin.direction,
                });
                turtlespace.history.turtle = [];
                turtlespace.history[COMMAND_BUFFER] = [];
                turtlespace.update_ui();
                return false;
            });
            $('.controls .link-turtle-save-history').click(function (event) {
                event.preventDefault();
                var count = Object.keys(turtlespace.history).length;
                turtlespace.save_history({name:COMMAND_BUFFER}, 'turtle_'+count);
                turtlespace.update_ui();
                return false;
            });
        }
    });

    $(function(){
        window.scrollTo(0, 1);
        turtlespace.initialize_ui();
        turtlespace.update_ui();
    });
})(jQuery);