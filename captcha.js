'use strict'

const crypto = require('crypto')
const Canvas = require('canvas')

let captchaParams

function captchaImage(params) {
    params.cookie = params.cookie || 'captcha'
    params.cryptoAlg = params.cryptoAlg || 'sha1'
    params.cryptoPass = params.cryptoPass || crypto.randomBytes(32)
    params.color = params.color || 'rgb(0,100,100)'
    params.background = params.background || 'rgb(255,200,150)'
    params.lineWidth = params.lineWidth || 8
    params.fontSize = params.fontSize || 80
    params.codeLength = params.codeLength || 6
    params.canvasWidth = params.canvasWidth || 250
    params.canvasHeight = params.canvasHeight || 150

    captchaParams = params

    return (req, res, next) => {
        const canvas = new Canvas(params.canvasWidth, params.canvasHeight)
        const ctx = canvas.getContext('2d')

        ctx.antialias = 'gray'
        ctx.fillStyle = params.background
        ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight)
        ctx.fillStyle = params.color
        ctx.lineWidth = params.lineWidth
        ctx.strokeStyle = params.color
        ctx.font = `${params.fontSize }px sans`

        // draw two curve lines:
        for (var i = 0; i < 2; i++) {
            ctx.moveTo(Math.floor(0.08 * params.canvasWidth), Math.random() * params.canvasHeight)
            ctx.bezierCurveTo(Math.floor(0.32 * params.canvasWidth), Math.random() * params.canvasHeight, Math.floor(1.07 * params.canvasHeight), Math.random() * params.canvasHeight, Math.floor(0.92 * params.canvasWidth), Math.random() * params.canvasHeight)
            ctx.stroke()
        }

        // draw text:
        const text = ('' + crypto.randomBytes(4).readUIntBE(0, 4)).substr(2, params.codeLength)
        text.split('').forEach((char, i) => {
            ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, Math.floor(0.375 * params.fontSize) * i + Math.floor(0.25 * params.fontSize), Math.floor(1.25 * params.fontSize))
            ctx.fillText(char, 0, 0)
        })

        // send cookie:
        const hash = crypto.createHash(params.cryptoAlg)
        hash.update(params.cryptoPass)
        hash.update(text)
        
        res.cookie(params.cookie, hash.digest('hex'))

        // send image:
        res.type('jpg')
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
        res.header('Expires', 'Sun, 19 May 1984 02:00:00 GMT')
        canvas.jpegStream().pipe(res)
    }
}

function captchaCheck(text, cookieData) {
    const hash = crypto.createHash(captchaParams.cryptoAlg)
    hash.update(captchaParams.cryptoPass)
    hash.update(text)
    return hash.digest('hex') === cookieData
}

module.exports = {
    image: captchaImage,
    check: captchaCheck,
}
