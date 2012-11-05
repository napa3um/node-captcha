# Captcha

Simple captcha.

## Installation

via npm:

	$ npm install captcha

## Application init:

	...
	var captcha = require('captcha');
	...
	app.configure(function(){
	...
		app.use(app.router);
		app.use(captcha('/captcha.jpg')); // url for captcha jpeg
		app.use(express.static(__dirname + '/public'));
	...

## Color Options

You can setup colors with an object, instead of just URL, like this:

	...
	app.use(captcha({url: '/captcha.jpg', fg:'#0064cd', bg: '#049cdb', interference: '#049cdb'}));
	...

All color options are optional, and you should probably set interference to teh same color as fg or bg, to make it harder for bots to read.

## Render captcha:

	<img src="/captcha.jpg" />

## Check captcha:

	app.post('/user/create', function(req, res, next){
		if(req.body.captcha != req.session.captcha) // text from captcha stored into session
			return next(new Error('Captcha stop!'));
	...

PS: thanks for more detailed description: http://stackoverflow.com/questions/9487844/nodejs-how-to-use-node-captcha-module
