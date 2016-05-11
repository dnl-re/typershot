"use strict";

var canvasWords = [];

var score = 0;
var scoreText = "Score: " + score;
var scoreElement;

var level = 1;
var levelText = "Level: " + level;
var levelElement;

var speed = 25;
var minWordlength = 4;
var maxWordlength = 4;

var changeLevelAtWords = 6;
var wordsOfLevel = 0;

var backgroundImageNumber = 1;

function startTypingGame(){
    
    $('#game-text-input-wrapper').toggleClass('hidden show');
    $('#start-game-button').toggleClass('show hidden');
    $('.cover-heading').addClass('show hidden');
    
    $('input').focus();
    
    tsArea.start();
    scoreElement = new TextComponent(scoreText, tsArea.size + " " + tsArea.font,
            tsArea.canvas.width - 150, 30)
    levelElement = new TextComponent(levelText, tsArea.size + " " + tsArea.font,
            30, 30)
}


// Creates and handles the canvas. Initializes the canvas, starts an interval
// checker and has a few configuration properties

var tsArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = 400;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        $('#game-text-input-wrapper').before(this.canvas);
        this.interval = setInterval(updatesArea, speed);
        this.frameNo = 0;
        this.nextFrame; 
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    end: function(){
        clearInterval(this.interval);
    },
    updateInterval: function(optionalInterval){
        var optInterval = optionalInterval || speed;
        clearInterval(this.interval);
        this.interval = setInterval(updatesArea, optInterval);
    },
    font: "Helvetica",
    size: "20px",
    style: ("font-family: " + this.font + "; font-size: " + this.size + ";"),
    textHeight: determineFontHeight(this.style)
};


// returns the text height of a given font style

function determineFontHeight(fontStyle){
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
    wordsOfLevel += 1;
}


// This class helps drawing canvas text elements

function TextComponent(text, font, x, y, color){
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

// Continually updates the tsArea. It checks if a word hits the bottom
// and then calls the Game Over screen, empties the canvasWords array.
// If no collision was found it updates thy y coordinate of all words.
// It then redraws the words and also the scoreElement.
// The frame number is incremented and it is checked if another word
// should be created. If so it sets the next frame number for the next
// word and creates a random word.

function updatesArea(){
    tsArea.clear();
    var collision = false;
    for (var i = 0; i < canvasWords.length; i += 1){
        canvasWords[i].y += 1;
        canvasWords[i].update();
        if (canvasWords[i].y >= tsArea.canvas.height){
            collision = true;
        }
    }
    levelElement.update();
    if (collision){
        gameOver();
        canvasWords = [];
        return false;
    }
    scoreElement.update();
    tsArea.frameNo += 1;
    if (tsArea.frameNo === 1 || tsArea.frameNo === tsArea.nextFrame){
        var minFrameNearness = 60;
        tsArea.nextFrame = tsArea.frameNo + minFrameNearness + chance.natural({min: 1, max: 50});
        createRandomWord(chance.natural({min: minWordlength, max: maxWordlength}));
        if (wordsOfLevel % changeLevelAtWords === 0){
            levelUp();
            if (level >= 4 && (level - 1) % 3 === 0){
                changeLevelAtWords += 1;
            }
        }
    }
}


// Speeds up the game every second level.
// Every odd level from level 3 on the maximum word length is increased.
// Every odd level from level 7 on the minimum word length is increased.
// Increments the level number and updating the level lable


function levelUp(){
    if (level % 2 === 0 ) {
        speed -= 1;
        tsArea.updateInterval();
    }
    if (level >= 3 && (level - 1)  % 2 === 0 ){
        maxWordlength += 1;
        backgroundImageNumber += 1;
        if (backgroundImageNumber == 7) {backgroundImageNumber = 1;}
        $('body').fadeTo('slow', 0.3, function() {
            $(this).css('background-image', 'url(img/background-bild' + backgroundImageNumber +'.jpg)');
        }).fadeTo('slow', 1);
    }
    if (level >= 7 && (level - 3)  % 4 === 0 ){
        minWordlength += 1;
    }
    level += 1;
    levelElement.text = "Level: " + level;
    wordsOfLevel = 0;
    console.log("====== Level Up ======");
    console.log("level: " + level);
    console.log("speed: " + speed);
    console.log("minWordlength: " + minWordlength);
    console.log("maxWordlength: " + maxWordlength);
    console.log("changeLevelAtWords: " + changeLevelAtWords);
}


// Displays the Game Over message and the Highscore.

function gameOver(){
    tsArea.end();
    var ctx = tsArea.context;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, 0, tsArea.canvas.width, tsArea.canvas.height);
    var gameOverMessage = new TextComponent("",
            '30px Helvetica',0 , -100);
        ctx.textAlign="center";
        ctx.fillText("GAME OVER",
                tsArea.canvas.width / 2,
                tsArea.canvas.height / 2);
    var gameOverScore = new TextComponent("",
            '30px Helvetica', 0, -100);
        ctx.textAlign="center";
        ctx.fillText("Your Highscore: " + score,
                tsArea.canvas.width / 2,
                tsArea.canvas.height / 2 + 40);
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