
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
		*app.use(captcha('/captcha.jpg'));*
		app.use(express.static(__dirname + '/public'));
	...

## Render captcha:

	<img src="/captcha.jpg" />

## Check captcha:

	app.post('/user/create', function(req, res, next){
		if(req.body.captcha != *req.session.captcha*)
			return next(new Error('Captcha stop!'));
	...

