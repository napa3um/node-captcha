var Canvas = require('canvas');

module.exports = function(params){
    if(typeof params == 'string')
        params = { url: params };
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';
    params.codeLength = params.codeLength || 6;
    params.canvasWidth = params.canvasWidth || 250;
    params.canvasHeight = params.canvasHeight || 150;
    params.fontSize = params.fontSize || params.canvasHeight * 0.7;
    params.lineWidth = params.lineWidth || Math.ceil(params.fontSize / 10);

    return function(req, res, next){
        if(req.path != params.url)
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
            ctx.moveTo(params.canvasWidth * 0.05, Math.random() * params.canvasHeight);
            ctx.bezierCurveTo(params.canvasWidth * 0.33, Math.random() * params.canvasHeight, params.canvasWidth * 0.66, Math.random() * params.canvasHeight, params.canvasWidth * 0.95, Math.random() * params.canvasHeight);
            ctx.stroke();
        }

		var text = params.text || ('' + Math.random()).substr(3, params.codeLength);
    var fontWidth = (params.fontSize / 2);
    var marginY = (params.canvasWidth - (fontWidth * text.length)) / 2;

    if (marginY < 0) {
        marginY = params.canvasWidth * 0.05;
        fontWidth = (params.canvasWidth * 0.9) / text.length;
    }

    for (i = 0; i < text.length; i++) {
        ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, marginY + fontWidth * i, params.fontSize + params.fontSize * 0.25);
        ctx.fillText(text.charAt(i), 0, 0);
		}

//	    ctx.setTransform(1, 0, 0, 1, 0, 0);
//	    ctx.font = '25px sans';
//	    ctx.fillStyle = "rgb(255,255,255)";
//	    ctx.fillText(text, 70, 145);

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
