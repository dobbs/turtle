(function(window){
    window.tilt = {};

    tilt.circle = function circle(ctx, x, y, acc) {
        var r = 15 + 2*acc;
        if (r < 0)
            r = 1;
        ctx.arc(x, y, r, 0, Math.PI*2);
        return tilt;
    };

    tilt.before = function begin(ctx) {
        ctx.beginPath();
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        return tilt;
    };

    tilt.after = function finish(ctx, color) {
        ctx.fillStyle = color;
        ctx.fill();
        return tilt;
    };

    tilt.alpha = function alpha(angle) {
        var radians = Math.PI*parseFloat(angle)/180, c = tilt.zCtx.canvas;
        tilt.zCtx.save();
        tilt.before(tilt.zCtx);
        tilt.zCtx.translate(c.width/2, c.height/2);
        tilt.zCtx.rotate(radians);
        tilt.circle(tilt.zCtx, 0, parseInt(c.height/4), tilt.zAcc);
        tilt.after(tilt.zCtx, 'yellow');
        tilt.zCtx.restore();
    };

    tilt.beta = function beta(angle) {
        var percent = (90 + parseFloat(angle))/180, c = tilt.yCtx.canvas;
        var x = parseInt(c.width/2), y = parseInt(c.height * percent);
        tilt.before(tilt.yCtx).circle(tilt.yCtx, x, y, tilt.yAcc).after(tilt.yCtx, 'red');
    };

    tilt.gamma = function gamma(angle) {
        var percent = (90 + parseFloat(angle))/180, c = tilt.xCtx.canvas;
        var x = parseInt(c.width * percent), y = parseInt(c.height/2);
        tilt.before(tilt.xCtx).circle(tilt.xCtx, x, y, tilt.xAcc).after(tilt.xCtx, 'blue');
    };

    tilt.render = _.throttle(function  (event) {
        tilt.alpha(event.alpha);
        tilt.beta(event.beta);
        tilt.gamma(event.gamma);
    }, 20);

    tilt.savemotion = _.throttle(function  (event) {
        tilt.xAcc = event.acceleration.x;
        tilt.yAcc = event.acceleration.y;
        tilt.zAcc = event.acceleration.z;
    }, 20);

    tilt.xCtx = document.getElementById('x_chart').getContext('2d');
    tilt.yCtx = document.getElementById('y_chart').getContext('2d');
    tilt.zCtx = document.getElementById('z_chart').getContext('2d');
    window.addEventListener('deviceorientation', tilt.render);
    window.addEventListener('devicemotion', tilt.savemotion);
})(this);
