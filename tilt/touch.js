var touch = touch || {};
(function ($, window, document, undefined) {
    var touchHistory = touch.touchHistory = [];
    var xMotionHistory = touch.xMotionHistory = [];
    var yMotionHistory = touch.yMotionHistory = [];
    var zMotionHistory = touch.zMotionHistory = [];
    var alphaOrientationHistory = touch.alphaOrientationHistory = [];
    var betaOrientationHistory = touch.betaOrientationHistory = [];
    var gammaOrientationHistory = touch.gammaOrientationHistory = [];

    function savetouches(jqevent) {
        if (jqevent.target.tagName == 'BUTTON')
            return;
        if (jqevent.type == 'touchstart') {
            touchHistory = [];
        }
        jqevent.preventDefault();
        var timestamp = new Date();
        var event = jqevent.originalEvent;
        var touches = $.map(event.touches, function (touch) {
            return {x:touch.pageX, y:touch.pageY};
        });
        touches.unshift(timestamp);
        touchHistory.push(touches);
    }

    function showtouches (jqevent) {
        var context = $('#touch').get(0).getContext('2d');
        var touches = $.map(jqevent.originalEvent.touches, function (touch) {
            return {x:touch.pageX, y:touch.pageY};
        });
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        $.each(touches, function  (i, touch) {
            drawtouch(context, touch, color[i], 40);
        });
    }

    function drawtouch(context, touch, color, radius) {
        if (!radius)
            radius = 5;
        context.beginPath();
        context.arc(touch.x, touch.y, radius, 0, 2*Math.PI);
        context.fillStyle = color;
        context.fill();
    }

    function savedevicemotion (jqevent) {
        var acc = jqevent.originalEvent.accelerationIncludingGravity;
        xMotionHistory.push(acc.x);
        yMotionHistory.push(acc.y);
        zMotionHistory.push(acc.z);
        if (xMotionHistory.length > 300) {
            xMotionHistory.shift();
            yMotionHistory.shift();
            zMotionHistory.shift();
        }
    }

    function drawmotionchart(context) {
        function line(color, ys) {
            context.beginPath();
            context.moveTo(0,ys[0]);
            for (var x=1, xmax=context.canvas.width; x<xmax; x++) {
                context.lineTo(x,ys[x]);
            }
            context.strokeStyle = color;
            context.stroke();
        }
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.save();
        context.translate(0, 25);
        line('red', xMotionHistory);
        line('green', yMotionHistory);
        line('blue', zMotionHistory);
        context.restore();

        context.save();
        context.translate(0, 75);
        context.scale(1, 50/360);
        line('orange', alphaOrientationHistory);
        line('purple', betaOrientationHistory);
        line('teal', gammaOrientationHistory);
        context.restore();
    }

    function savedeviceorientation (jsevent) {
        alphaOrientationHistory.push(jsevent.originalEvent.alpha);
        betaOrientationHistory.push(jsevent.originalEvent.beta);
        gammaOrientationHistory.push(jsevent.originalEvent.gamma);
        if (alphaOrientationHistory.length > 300) {
            alphaOrientationHistory.shift();
            betaOrientationHistory.shift();
            gammaOrientationHistory.shift();
        }
    }

    function drawtouchhistory (jqevent) {
        if (touchHistory.length == 0)
            return;
        var touchCtx = $('#touch').get(0).getContext('2d');
        touchCtx.clearRect(0, 0, touchCtx.canvas.width, touchCtx.canvas.height);
        var T0 = touchHistory[0][0];
        $.each(touchHistory, function  (i, event) {
            var touches = [].concat(event);
            var T1 = touches.shift() - T0;
            $.each(touches, function  (i, touch) {
                drawtouch(touchCtx, touch, color[i]);
            });
        });
    }

    var color = ['red', 'orange', 'yellow', 'green', 'blue'];

    $(function  () {
        $('button').on('click', drawtouchhistory);
        $(document)
            .on('touchstart', savetouches)
            .on('touchmove', savetouches)
            .on('touchmove', showtouches);
        $(window)
            .on('devicemotion', savedevicemotion)
            .on('deviceorientation', savedeviceorientation);

        var chartCtx = $('#chart').get(0).getContext('2d');
        (function drawchart () {
            drawmotionchart(chartCtx);
            setTimeout(drawchart, 500);
        })();
    });

})(jQuery, this, this.document);