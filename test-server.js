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
