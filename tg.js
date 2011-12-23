var tg = tg || {};
(function ($, Turtle, window, document, undefined) {

    function init(that) {
        $.extend(that, {
            thing: function thing() {
                var segments = [100, 100, 50, 50, 100, 25, 25];
                $.each(segments, function (i, pixels) {
                    that.move(pixels).turn(90);
                });
                that.move(50);
            },
            
            arcr: function arcr(r, deg) {
                for(var i = 0; i < deg; i++) {
                    that.move(r).turn(1);
                }
                return that;
            },

            arcl: function arcl(r, deg) {
                for(var i = 0; i < deg; i++) {
                    that.move(r).turn(-1);
                }
                return that;
            },

            arc: function arc(r, deg, ccw) {
                var step = 2*Math.PI*r/360;
                for(var i = 0; i < deg; i++) {
                    that.move(step).turn(ccw ? -1 : 1);
                }
                return that;
            },

            poly: function poly(side, angle) {
                var sum = 0;
                do {
                    that.move(side).turn(angle);
                    sum = sum + parseInt(angle);
                } while (sum % 360 != 0);
                return that;
            },

            newpoly: function newpoly(side, angle, reps) {
                if (!reps) 
                    reps = 360 / (3*parseInt(angle));
                for (var i=0; i<reps; i++) {
                    that.move(side).turn(angle);
                    that.move(side).turn(2*angle);
                }
                return that;
            },

            circles: function circles() {
                for(var i=0; i<9; i++) {
                    that.poly(15, 15);
                    that.turn(40);
                }
                return that;
            },

            polyspi: function polyspi(side, angle, inc, reps) {
                side = parseInt(side);
                angle = parseInt(angle);
                inc = parseInt(inc);
                if (!inc)
                    inc = 3;
                if (!reps)
                    reps = 3600 / angle;
                for(var i=0; i < reps; i++) {
                    that.move(side + i*inc).turn(angle);
                }
                return that;
            },

            inspi: function inspi(side, angle, inc, reps) {
                if (!reps)
                    reps = 500;
                for (var i=0; i<reps; i++) {
                    that.move(parseInt(side)).turn(parseInt(angle) + parseInt(inc)*i);
                }
                return that;
            },

            doublepoly: function doublepoly(side1, side2, angle, reps) {
                if (!reps) 
                    reps = 180 / parseInt(angle);
                for (var i=0; i<reps; i++) {
                    that.move(side1).turn(angle);
                    that.move(side2).turn(angle);
                }
                return that;
            },

            spiro: function spiro(side, angle, inc, reps) {
                var sum = 0;
                angle = parseInt(angle);
                do {
                    that.polyspi(side, angle, inc, reps);
                    sum = sum + angle;
                } while (sum % 360 != 0);
                return that;
            },

            gspiro: function gspiro(side, angle, max /*rest*/) {
                var corners = [];
                for (var i = 3; i < arguments.length; i++)
                    corners.push(parseInt(arguments[i]));
                for (var j = 1; j <= max; j++)
                    that.move(side*j).turn(corners.indexOf(j) < 0 ? -angle : angle);
                return that;
            },

            flowerAndStem: function flowerAndStem() {
                that.home().pensize(8).pencolor('green').turn(50);
                for(var i=0; i<6; i++)
                    that.move(20).turn(10);
                that.turn(-160);
                for(var i=0; i<6; i++)
                    that.move(10).turn(10);
                that.turn(120);
                for(var i=0; i<6; i++)
                    that.move(10).turn(10);
                that.turn(-100);

                for(var i=0; i<6; i++)
                    that.move(20).turn(-10);
                that.home().pensize(12).pencolor('red');
                for(var j=0; j<5; j++) {
                    for(var i=0; i<12; i++)
                        that.move(10).turn(5);
                    that.turn(120);
                    for(var i=0; i<12; i++)
                        that.move(10).turn(5);
                    that.turn(120 + 72);
                }
                that.pensize(1).pencolor('blue').penup().turn(-90).move(150).turn(90).pendown();
            }

        });
        that.pendown();
        return that;
    }

    $.extend(tg, {
        examples: {
            crestagon: 'arc 100 180. turn 134. arc 141 90 ccw. turn 135',
            thing1: '4x: thing',
            thing2: '9x: thing. turn 10. move 50',
            thing3: '8x: thing. turn -45. move 100',
            circle: '360x: move 1. turn 1',
            circles: '9x: poly 15 10. turn 40',
            clickme9x: 'arcl 1 90. arcr 1 90. turn -160',
            flower: '6x: arcr 3 60. turn 120. arcr 3 60. turn 180',
            poly72: 'clear. poly 50 72 5',
            poly144: 'clear. poly 60 144 5',
            poly60: 'clear. poly 50 60 6',
            poly108: 'clear. poly 80 108 10',
            poly135: 'clear. poly 80 135 8',
            newpoly30: 'clear. newpoly 50 30 4',
            newpoly144: 'clear. newpoly 30 144 5',
            newpoly45: 'clear. newpoly 30 45 8',
            newpoly125: 'clear. newpoly 10 125 24',
            polyspi95: 'clear. polyspi 1 95',
            polyspi90: 'clear. polyspi 1 90',
            polyspi120: 'clear. polyspi 1 120',
            polyspi117: 'clear. polyspi 1 117',
            inspi_0_7: 'clear. inspi 10 0 7 550',
            inspi_2_20: 'clear. inspi 30 2 20 100',
            inspi_20_40: 'clear. inspi 30 40 30 100',
            spiro_90_10: 'clear. spiro 10 90 10 10',
            spiro_144_8: 'clear. spiro 10 144 8 8',
            spiro_60_10: 'clear. spiro 10 60 10 10',
            gspiro_45_11_89: '8x: gspiro 2 45 11 8 9',
            gspiro_120_6_13: '3x: gspiro 10 120 6 1 3',
            gspiro_90_11_345: '4x: gspiro 10 90 11 3 4 5',
            gspiro_90_8_48: 'clear. gspiro 10 90 8 4 8',
            gspiro_120_11_3467: 'clear. gspiro 10 120 11 3 4 6 7'
        }
    });

    $(function () {
        var $commandline = $('#tg-commandline');
        var $canvas = $('#tg-tracks');
        Turtle.interactiveCanvas(
            $canvas.get(0).getContext('2d'),
            $commandline.get(0)
        );
        window.tg_commandline_history = new Turtle.History($commandline.get(0), window.localStorage, {
            useInputValueForRevisionName: true
        });
        window.tg_commandline_history.syncLocalStorage();

        $("#tg-commandline-history-show").click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            $history = $(window.tg_commandline_history.element);
            if ($history.hasClass('turtle-hide')) {
                $(event.target).html('&#x25ba History');
            }
            else {
                $(event.target).html('&#x25bc History');
            }
            $history.toggleClass('turtle-hide');
            return false;
        });

        function dispatchChangeEvent($element) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, true ); // event type,bubbling,cancelable
            $element.get(0).dispatchEvent(event);
        }

        var $exercises = $('#tg-exercises');
        $.each(Object.keys(tg.examples).sort(), function (i, example) {
            var $link = $('<a href="">');
            var command = tg.examples[example];
            $link.html('<b>' + example + '</b> ' + command);
            $link.click(function (e) {
                e.preventDefault();
                $commandline.val(command);
                dispatchChangeEvent($commandline);
                return false;
            } );
            $exercises.append($link);
        });

        tg.T = init(Turtle.interactiveTurtle);
        
        setTimeout(tg.T.flowerAndStem, 200);
    });



})(jQuery, Turtle, this, this.document);