var Canvas = require('canvas');

module.exports = function(url){
	return function(req, res, next){
		if(req.url != url)
			return next();
		
		var canvas = new Canvas(250, 150);
		var ctx = canvas.getContext('2d');
		ctx.antialias = 'gray';
		ctx.fillStyle = "rgb(255,200,150)";
		ctx.fillRect(0, 0, 250, 150);
		ctx.fillStyle = "rgb(0,100,100)";
		ctx.lineWidth = 8;
		ctx.strokeStyle = "rgb(0,100,100)";
		ctx.font = '80px sans';

		for (var i = 0; i < 2; i++) {
			ctx.moveTo(20, Math.random() * 150);
			ctx.bezierCurveTo(80, Math.random() * 150, 160, Math.random() * 150,
					230, Math.random() * 150);
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
			req.session.captcha = text;
			res.end(buf);
		});		
	};
};
