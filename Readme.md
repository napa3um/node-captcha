# Captcha

Simple captcha for Connect/Express.

## Installation

Via npm:

	$ npm install captcha

## Usage (for Express 3)

```javascript
var express = require('express');
var captcha = require('captcha');

var app = express();

app.configure(function(){
    app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.cookieSession({ secret: 'keyboard-cat' }));
	app.use(captcha({ url: '/captcha.jpg', color:'#0064cd', background: 'rgb(20,30,200)' })); // captcha params
});

app.get('/', function(req, res){
	res.type('html');
	res.end('<img src="/captcha.jpg"/><form action="/login" method="post"><input type="text" name="digits"/></form>'); // captcha render
});

app.post('/login', function(req, res){
	res.type('html');
	res.end('CONFIRM: ' + (req.body.digits == req.session.captcha)); // captcha verify
});

app.listen(8080);
console.log('Web server started.');
```