# Captcha

Simple captcha for Express.

## Installation

Via npm:

	$ npm install captcha

## Usage (for Express 4)

```javascript
'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const captchaUrl = '/captcha.jpg'
const captchaCookieName = 'captcha'
const captchaFieldName = 'captcha'

const captcha = require('./captcha').create({ cookie: captchaCookieName })

const app = express()
app.use(cookieParser())
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
        <p>CAPTCHA VALID: ${ captcha.check(req.body[captchaFieldName], req.cookies[captchaCookieName]) }</p>
    `)
})

app.listen(8080, () => {
  console.log('server started')
})
```