'use strict'

const Canvas = require('canvas')
const crypto = require('crypto')

class Captcha {
    constructor(params) {
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

        this.params = params
    }

    image() {
        return (req, res, next) => {
            const canvas = new Canvas(this.params.canvasWidth, this.params.canvasHeight)
            const ctx = canvas.getContext('2d')

            ctx.antialias = 'gray'
            ctx.fillStyle = this.params.background
            ctx.fillRect(0, 0, this.params.canvasWidth, this.params.canvasHeight)
            ctx.fillStyle = this.params.color
            ctx.lineWidth = this.params.lineWidth
            ctx.strokeStyle = this.params.color
            ctx.font = `${this.params.fontSize }px sans`

            // draw two curve lines:
            for (var i = 0; i < 2; i++) {
                ctx.moveTo(Math.floor(0.08 * this.params.canvasWidth), Math.random() * this.params.canvasHeight)
                ctx.bezierCurveTo(Math.floor(0.32 * this.params.canvasWidth), Math.random() * this.params.canvasHeight, Math.floor(1.07 * this.params.canvasHeight), Math.random() * this.params.canvasHeight, Math.floor(0.92 * this.params.canvasWidth), Math.random() * this.params.canvasHeight)
                ctx.stroke()
            }

            // draw text:
            const text = ('' + crypto.randomBytes(4).readUIntBE(0, 4)).substr(2, this.params.codeLength)
            text.split('').forEach((char, i) => {
                ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, Math.floor(0.375 * this.params.fontSize) * i + Math.floor(0.25 * this.params.fontSize), Math.floor(1.25 * this.params.fontSize))
                ctx.fillText(char, 0, 0)
            })

            // save text:
            if (req.session === undefined) {
                throw Error('node-captcha requires express-session!')
            }
            req.session[this.params.cookie] = text

            // send image:
            res.type('jpg')
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.header('Expires', 'Sun, 19 May 1984 02:00:00 GMT')
            canvas.jpegStream().pipe(res)
        }
    }

    check(req, text) {
        if (req.session === undefined) {
            throw Error('node-captcha requires express-session!')
        }
        const res = req.session[this.params.cookie] === text
        req.session[this.params.cookie] = null
        return res
    }
}

module.exports.create = params => new Captcha(params)
