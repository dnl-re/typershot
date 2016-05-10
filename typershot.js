"use strict";

var canvasWords = [];
var scoreElement;
var score = 0;
var scoreText = "Score: " + score;


function startTypingGame() {
    
    $('#game-text-input-wrapper').toggleClass('hidden show');
    $('#start-game-button').toggleClass('show hidden');
    $('.cover-heading').addClass('show hidden');
    
    $('input').focus();
    
    tsArea.start();
    // scoreElement = new TextComponent(scoreText, tsArea.size + " " + tsArea.font,
            // tsArea.canvas.width - 150, 30)
    scoreElement = new TextComponent(scoreText, tsArea.size + " " + tsArea.font,
            tsArea.canvas.width - 150, 30)
}


// Creates and handles the canvas. Initializes the canvas, starts an interval
// checker and has a few configuration properties

var tsArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 400;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        $('.cover-heading').after(this.canvas);
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
    font: "Helvetica",
    size: "20px",
    style: ("font-family: " + this.font + "; font-size: " + this.size + ";"),
    textHeight: determineFontHeight(this.style)
};


// returns the text height of a given font style

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


// Creates a random Word with a specified word length

function createRandomWord(wordlength){
    var text = chance.word({length: wordlength});
    var font;
    var x;
    var y;
    var ctx = tsArea.context;
    var textWidth = ctx.measureText(text).width;
    x = chance.natural({min: 1, max: tsArea.canvas.width - textWidth -1})
    y = -tsArea.textHeight;
    canvasWords.push(new TextComponent(text, tsArea.size + " " + tsArea.font, x, y));
}


// This class helps drawing canvas text elements

function TextComponent(text, font, x, y, color) {
    var ctx = tsArea.context;
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = "#555" || color;
    ctx.font = font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x ,this.y );
    this.update = function(){
        ctx = tsArea.context;
        ctx.font = font;
        ctx.fillText(this.text, this.x ,this.y );
    };
}

// Coninually updates the tsArea. It checks if a word hits the bottom
// and then calls the Game Over screen, empties the canvasWords array
// and breaks out of the function.
// If no collision was found it updates thy y coordinate of all words.
// It then redraws the words and also the scoreElement.
// The frame number is incremented and it is checked if another word
// should be created. If so it sets the next frame number for the next
// word and creates a random word.

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
    scoreElement.update();
    tsArea.frameNo += 1;
    if (tsArea.frameNo === 1 || tsArea.frameNo === tsArea.nextFrame){
        var minFrameNearness = 60;
        tsArea.nextFrame = tsArea.frameNo + minFrameNearness + chance.natural({min: 1, max: 50});
        createRandomWord(4);
    }
}


// Displays the Game Over message and the Highscore.

function gameOver(){
    tsArea.end();
    var ctx = tsArea.context;
    var gameOverMessage = new TextComponent("",
            '30px Courier',0 , -100);
        ctx.textAlign="center";
        ctx.fillText("GAME OVER",
                tsArea.canvas.width / 2,
                tsArea.canvas.height / 2);
    
    var gameOverScore = new TextComponent("",
            '30px Courier', 0, -100);
        ctx.textAlign="center";
        ctx.fillText("Ihr Highscore: " + score,
                tsArea.canvas.width / 2,
                tsArea.canvas.height / 2 + 50);
    $('#game-text-input-wrapper').toggleClass('hidden show');
    $('#start-game-button').toggleClass('show hidden');
    $('input').val('');
}


// Checks the input text fiel on each stroke if a Word matches the input.
// It then adds the points for the word to the score and removes the word
// from the canvasWords array.
// Finally it empties the input text field.

$(function() {
    $('input').bind('input propertychange', function() {
        for (var i = 0; i < canvasWords.length; i++){
            if (canvasWords[i].text === ($(this).val())){
                var wordScore = canvasWords[i].text.length;
                score += wordScore;
                scoreElement.text = "Score: " + score;
                canvasWords.splice(i, 1);
                $(this).val('');
            }
        }
    });
});