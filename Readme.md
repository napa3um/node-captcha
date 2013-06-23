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

## Full list of parameters
```javascript
    var params={
       "url":"/captcha.jpg",
       "color":"#ffffff",// can be omitted, default 'rgb(0,100,100)'
       "background":"#000000",// can be omitted, default 'rgb(255,200,150)'
       "lineWidth" : 6, // can be omitted, default 8
       "fontSize" : 60, // can be omitted, default 80
       "codeLength" : 6, // length of code, can be omitted, default 6
       "canvasWidth" : 250,// can be omitted, default 250
       "canvasHeight" : 150,// can be omitted, default 150
    }
    app.use(captcha(params)); // captcha params
```