var Canvas = require('canvas');

module.exports = function(params){
    if(typeof params == 'string')
        params = { url: params };
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';

	return function(req, res, next){
		if(req.url != params.url)
			return next();

		var canvas = new Canvas(250, 150);
		var ctx = canvas.getContext('2d');
		ctx.antialias = 'gray';
		ctx.fillStyle = params.background;
		ctx.fillRect(0, 0, 250, 150);
		ctx.fillStyle = params.color;
		ctx.lineWidth = 8;
		ctx.strokeStyle = params.color;
		ctx.font = '80px sans';

		for (var i = 0; i < 2; i++) {
			ctx.moveTo(20, Math.random() * 150);
			ctx.bezierCurveTo(80, Math.random() * 150, 160, Math.random() * 150, 230, Math.random() * 150);
			ctx.stroke();
		}

		var text = ('' + Math.random()).substr(3, 6);

		for (i = 0; i < text.length; i++) {
			ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, 30 * i + 20, 100);
			ctx.fillText(text.charAt(i), 0, 0);
		}

//	    ctx.setTransform(1, 0, 0, 1, 0, 0);
//	    ctx.font = '25px sans';
//	    ctx.fillStyle = "rgb(255,255,255)";
//	    ctx.fillText(text, 70, 145);

		canvas.toBuffer(function(err, buf) {
            if(req.session)
			    req.session.captcha = text;
			res.end(buf);
		});
	};
};
