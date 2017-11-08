# Captcha

Simple captcha for Express.

WARNING! New API (0.0.5 -> 0.1.0)

## Installation

Via npm:

	$ npm install captcha

## Usage (for Express 4)

```javascript
'use strict'

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const captchaUrl = '/captcha.jpg'
const captchaId = 'captcha'
const captchaFieldName = 'captcha'

const captcha = require('./captcha').create({ cookie: captchaId })

const app = express()
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({ extended: false }))

app.get(captchaUrl, captcha.image())

app.get('/', (req, res) => {
    res.type('html')
    res.end(`
        <img src="${ captchaUrl }"/>
        <form action="/login" method="post">
            <input type="text" name="${ captchaFieldName }"/>
            <input type="submit"/>
        </form>
    `)
})

app.post('/login', (req, res) => {
    res.type('html')
    res.end(`
        <p>CAPTCHA VALID: ${ captcha.check(req, req.body[captchaFieldName]) }</p>
    `)
})

app.listen(8080, () => {
    console.log('server started')
})
```

## Options

   - cookie = default('captcha')
   - cryptoAlg = default('sha1')
   - cryptoPass = default(crypto.randomBytes(32))
   - color = default('rgb(0,100,100)')
   - background = default('rgb(255,200,150)')
   - lineWidth = default(8)
   - fontSize = default(80)
   - codeLength = default(6)
   - canvasWidth = default(250)
   - canvasHeight = default(150)
   - letterSpacing = default(0.375)
   

    var nodecaptcha = require('./captcha')
    var captcha = nodecaptcha.create({ cookie: 'captcha',canvasHeight: 200,letterSpacing:10})