'use strict';

const Canvas = require('canvas');
const sha256 = require('js-sha256');

function randomFromTo(a, b) {
  return () => {
    return Math.floor(Math.random() * (b - a)) + a
  }
}

const randomTextColor = randomFromTo(0, 100);
const randomBgColor = randomFromTo(101, 255);
const random10t30 = randomFromTo(10, 30);
const random2t6 = randomFromTo(2, 6);
const random1t3 = randomFromTo(1, 3);
const random0t3 = randomFromTo(0, 3);
const random0t57 = randomFromTo(0, 57);

// Removed o,O,0,I,l for simplicity for humans
const chars = ['a','b','c','d','e','f','g','h','i','j','k','m','n','p','q','r','s','t','u','v','w','x','y','z',
  'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
  '0','1','2','3','4','5','6','7','8','9',
];

const getRandomChar = () => {
  return chars[random0t57()];
};

class Captcha {
  constructor(params) {
    params.cookie = params.cookie || 'captcha';
    params.color = params.color || 'rgb(0,100,100)';
    params.background = params.background || 'rgb(255,200,150)';
    params.lineWidth = params.lineWidth || 6;
    params.fontSize = params.fontSize || 70;
    params.codeLength = params.codeLength || 6;
    params.canvasHeight = params.canvasHeight || 120;

    this.randomHeightInCanvas = randomFromTo(0, params.canvasHeight);

    this.params = params
  }

  randomHeightInCanvas() {}
  randomWidthInCanvas() {}

  image() {
    return (req, res, next) => {
      const codeLength = this.params.codeLength + random0t3();
      this.params.canvasWidth = 40 * codeLength;
      this.randomWidthInCanvas = randomFromTo(0, this.params.canvasWidth);
      const canvas = new Canvas(this.params.canvasWidth, this.params.canvasHeight);
      const ctx = canvas.getContext('2d');

      ctx.antialias = 'gray';
      ctx.fillStyle = `rgb(${randomBgColor()},${randomBgColor()},${randomBgColor()})`;
      ctx.fillRect(0, 0, this.params.canvasWidth, this.params.canvasHeight);
      ctx.strokeStyle = this.params.color;
      ctx.font = `${this.params.fontSize }px sans`;

      // draw text:
      // draw two curve lines:
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgb(${randomTextColor()},${randomTextColor()},${randomTextColor()})`;
        ctx.beginPath();
        ctx.lineWidth = random2t6();
        ctx.moveTo(Math.floor(0.08 * this.params.canvasWidth), Math.random() * this.params.canvasHeight);
        ctx.bezierCurveTo(Math.floor(0.32 * this.params.canvasWidth), Math.random() * this.params.canvasHeight, Math.floor(1.07 * this.params.canvasHeight), Math.random() * this.params.canvasHeight, Math.floor(0.92 * this.params.canvasWidth), Math.random() * this.params.canvasHeight)
        ctx.stroke();
      }

      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `rgb(${randomTextColor()},${randomTextColor()},${randomTextColor()})`;
        ctx.beginPath();
        ctx.lineWidth = random1t3();
        ctx.arc(this.randomWidthInCanvas(), this.randomHeightInCanvas(), random10t30(), 0, 2 * Math.PI);
        ctx.stroke();
      }

      for (let i = 0; i < 30; i++) {
        ctx.strokeStyle = `rgb(${randomTextColor()},${randomTextColor()},${randomTextColor()})`;
        ctx.beginPath();
        ctx.lineWidth = random1t3();
        ctx.rect(this.randomWidthInCanvas(), this.randomHeightInCanvas(), random10t30(), random10t30());
        ctx.stroke();
      }

      let text = '';
      for (let i = 0; i < codeLength; i++) {
        const char = getRandomChar();
        text += char;
        ctx.fillStyle = `rgb(${randomTextColor()},${randomTextColor()},${randomTextColor()})`;
        ctx.setTransform(Math.random() * 0.5 + 1, Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.5 + 1, Math.floor(0.375 * this.params.fontSize) * i + Math.floor(0.25 * this.params.fontSize), Math.floor(1.25 * this.params.fontSize));
        ctx.fillText(char, 0, 0);
      }

      // save text:
      if (req.session === undefined) {
        throw Error('node-captcha requires express-session!')
      }
      req.session[this.params.cookie] = text.toLowerCase();

      // send image:
      if (typeof res.type !== 'undefined') {
        res.type('jpg');
      } else {
        res.setHeader('content-type', 'image/jpeg')
      }
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.header('Expires', 'Sun, 19 May 1984 02:00:00 GMT');
      canvas.jpegStream().pipe(res)
    }
  }

  check(req, text) {
    if (req.session === undefined) {
      throw Error('node-captcha requires express-session!')
    }
    const res = req.session[this.params.cookie] === text.toLowerCase();
    req.session[this.params.cookie] = null;
    return res
  }
}

module.exports.create = params => new Captcha(params);
