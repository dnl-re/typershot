

function startTypingGame() {
	tgArea.start();
	canvasWords = [];
	aWordOnCanvas1 = new textComponent('Moin', '30px Arial', 50, 50);
	aWordOnCanvas2 = new textComponent('Happy', '30px Arial', 151, 150);
	aWordOnCanvas3 = new textComponent('juhu!', '30px Arial', 251, 250);
	canvasWords.push(aWordOnCanvas1);
	canvasWords.push(aWordOnCanvas2);
	canvasWords.push(aWordOnCanvas3);
}

var tgArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 400;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateTGArea, 100);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function textComponent(text, font, x, y) {
	this.x = x;
	this.y = y; 
	ctx = tgArea.context;
	this.text = text;
	ctx.font = font;
	ctx.fillText(this.text, this.x ,this.y );
	this.update = function(){
		ctx = tgArea.context;
		ctx.font = font;
		ctx.fillText(this.text, this.x ,this.y );
	};
}

function updateTGArea(){
	tgArea.clear();
	for (var i = 0; i < canvasWords.length; i++){
		canvasWords[i].y += 1;
		canvasWords[i].update();
	}
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