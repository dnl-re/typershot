"use strict";

var canvasWords = [];

function startTypingGame() {
    $('input').focus();
    tsArea.start();
    //createRandomWord(2);
}

var tsArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 400;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updatesArea, 25);
        this.frameNo = 0;
        this.nextFrame; 
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    end: function() {
        clearInterval(this.interval);
        this.clear();
    },
    font: "Courier",
    size: "20px",
    style: ("font-family: " + this.font + "; font-size: " + this.size + ";"),
    textHeight: determineFontHeight(this.style)
};

function determineFontHeight(fontStyle) {
  var body = document.getElementsByTagName("body")[0];
  var dummy = document.createElement("div");
  var dummyText = document.createTextNode("M");
  dummy.appendChild(dummyText);
  dummy.setAttribute("style", fontStyle);
  body.appendChild(dummy);
  var result = dummy.offsetHeight;
  body.removeChild(dummy);
  return result;
  // src: http://bit.ly/1T7BZFx
}


function createRandomWord(){
    var text = 'einWort';
    var font;
    var x;
    var y;
    var ctx = tsArea.context;
    var textWidth = ctx.measureText(text).width;
    x = Math.floor(Math.random() * (tsArea.canvas.width - textWidth -1) + 1);
    y = - tsArea.textHeight;
    canvasWords.push(new TextComponent(text, tsArea.size + " " + tsArea.font, x, y));
}

function TextComponent(text, font, x, y) {
    var ctx = tsArea.context;
    this.x = x;
    this.y = y;
    this.text = text;
    ctx.font = font;
    ctx.fillText(this.text, this.x ,this.y );
    this.update = function(){
        ctx = tsArea.context;
        ctx.font = font;
        ctx.fillText(this.text, this.x ,this.y );
    };
}

function updatesArea(){
    tsArea.clear();
    for (var i = 0; i < canvasWords.length; i += 1){
        if (canvasWords[i].y >= tsArea.canvas.height){
            gameOver();
            canvasWords = [];
            return false;
        }
        else {
            canvasWords[i].y += 1;
            canvasWords[i].update();
        }
    }
    tsArea.frameNo += 1;
    if (tsArea.frameNo === 1 || tsArea.frameNo === tsArea.nextFrame){
        var wordNearness = 100;
        tsArea.nextFrame = tsArea.frameNo + Math.floor(Math.random() * wordNearness + tsArea.textHeight * 2);
        createRandomWord();
    }
}

function gameOver(){
    tsArea.end();
    var text = 'GAME OVER';
    var ctx = tsArea.context;
    var gameOverMessage = new TextComponent(text,
            '30px Courier',
            tsArea.canvas.width / 2 - ctx.measureText(text).width / 2,
            tsArea.canvas.height / 2);
}

$(function() {
    $('input').bind('input propertychange', function() {
        for (var i = 0; i < canvasWords.length; i++){
            if (canvasWords[i].text === ($(this).val())){
                canvasWords.splice(i, 1);
                $(this).val('');
            }
        }
    });

});