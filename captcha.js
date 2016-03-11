var Canvas = require('canvas');

module.exports = function(params){
    if(typeof params == 'string')
        params = { url: params };
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';
    params.lineWidth = params.lineWidth || 8;
    params.fontSize = params.fontSize || 80;
    params.codeLength = params.codeLength || 6;
    params.canvasWidth = params.canvasWidth || 250;
    params.canvasHeight = params.canvasHeight || 150;


    return function(req, res, next){
        if(req.path.replace(/\?.*$/, '') != params.url)
            return next();

        var canvas = new Canvas(params.canvasWidth , params.canvasHeight);
        var ctx = canvas.getContext('2d');
        ctx.antialias = 'gray';
        ctx.fillStyle = params.background;
        ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight);
        ctx.fillStyle = params.color;
        ctx.lineWidth = params.lineWidth;
        ctx.strokeStyle = params.color;
        ctx.font = params.fontSize+'px sans';

        for (var i = 0; i < 2; i++) {
            ctx.moveTo(Math.floor(0.08*params.canvasWidth), Math.random() * params.canvasHeight);
            ctx.bezierCurveTo(Math.floor(0.32*params.canvasWidth), Math.random() * params.canvasHeight, Math.floor(1.07*params.canvasHeight), Math.random() * params.canvasHeight, Math.floor(0.92*params.canvasWidth), Math.random() * params.canvasHeight);
            ctx.stroke();
        }

                var text = params.text || ('' + Math.random()).substr(3, params.codeLength);

      for (i = 0; i < text.length; i++) {
                        ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, Math.floor(0.375*params.fontSize) * i + Math.floor(0.25*params.fontSize), Math.floor(1.25*params.fontSize));
                        ctx.fillText(text.charAt(i), 0, 0);
                }

                canvas.toBuffer(function(err, buf) {
            if(req.session)
                req.session.captcha = text;
            res.type('jpg');
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.header('Expires', 'Sun, 12 Jan 1986 12:00:00 GMT');
            res.end(buf);
        });
    };
};
