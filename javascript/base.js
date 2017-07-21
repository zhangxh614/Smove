var boardLineWidth = 8;
var midLineWidth = 5;
var boardPosition = [];
var speed = 0;
var radius = 0;


var main = document.getElementById('main');
var board = document.getElementById('board');
var board_context = board.getContext('2d');
var myball = document.getElementById('ball');
var myball_context = myball.getContext('2d');
var myfruit = document.getElementById('fruit');
var fruit_ctx = myfruit.getContext('2d');


CanvasRenderingContext2D.prototype.drawBoard = function(x, y, size, r) {
	this.beginPath();
	this.moveTo(x + r, y);
	this.arcTo(x + size, y, x + size, y + size, r);
	this.arcTo(x + size, y + size, x, y + size, r);
	this.arcTo(x, y + size, x, y, r);
	this.arcTo(x, y, x + size, y, r);
	this.closePath();
	return this;
};

CanvasRenderingContext2D.prototype.drawBoardLine = function(x, y, size, linewidth) {
	this.beginPath();
	this.moveTo(x + size / 3, y + y + linewidth * 2);
	this.lineTo(x + size / 3, size - linewidth * 2);
	this.moveTo(x + size / 3 * 2, y + y + linewidth * 2);
	this.lineTo(x + size / 3 * 2, size - linewidth * 2);
	this.moveTo(x + x + linewidth * 2, y + size / 3);
	this.lineTo(size - linewidth * 2, y + size / 3);
	this.moveTo(x + x + linewidth * 2, y + size / 3 * 2);
	this.lineTo(size - linewidth * 2, y + size / 3 * 2);
	this.closePath();
	return this;
};

var ball = function(x = 1, y = 1) {
	this.x = x;
	this.y = y;
	this.final_r = this.r = boardPosition[this.x * 3 + this.y][0];
	this.final_c = this.c = boardPosition[this.x * 3 + this.y][1];
	this.speed = speed;
};

ball.prototype = {
	constructor: ball,

	clear: function() {
		myball_context.clearRect(0, 0, myball.width, myball.height);
	},

	draw: function() {
		myball_context.beginPath();
		myball_context.arc(this.r, this.c, radius, 0, Math.PI * 2, false);
		myball_context.closePath();

		myball_context.fillStyle = "white";
		myball_context.fill();
	},

	update: function(x, y) {
		if (this.x + x >= 0 && this.x + x <= 2 && this.y + y >= 0 && this.y + y <= 2) {
			this.x = this.x + x;
			this.y = this.y + y;
			this.final_r = boardPosition[this.x * 3 + this.y][0];
			this.final_c = boardPosition[this.x * 3 + this.y][1];
		}
	},

	setBall: function() {
		this.final_r = this.r = boardPosition[this.x * 3 + this.y][0];
		this.final_c = this.c = boardPosition[this.x * 3 + this.y][1];
		this.speed = speed;
	},

	move: function() {
		if (this.final_c === this.c && this.final_r === this.r) {
			return;
		}
		this.clear(this.r, this.c);
		if (this.final_c - this.c > this.speed) {
			this.c += this.speed;
		} else if (this.final_c - this.c < -speed) {
			this.c -= this.speed;
		} else {
			this.c = this.final_c;
		}
		if (this.final_r - this.r > this.speed) {
			this.r += this.speed;
		} else if (this.final_r - this.r < -speed) {
			this.r -= this.speed;
		} else {
			this.r = this.final_r;
		}
		this.draw();
	}

};


var fruit = function(index = 0) {
	this.index = this.last = index;
	this.r = boardPosition[this.index][0];
	this.c = boardPosition[this.index][1];
	this.size = radius * Math.SQRT1_2;
	this.speed = 1 * Math.PI / 180;
	this.angle = 0;

};

fruit.prototype = {
	constructor: fruit,

	clear: function() {
		fruit_ctx.clearRect(0, 0, myfruit.width, myfruit.height);
	},

	draw: function() {
		fruit_ctx.drawBoard(this.r - this.size, this.c - this.size, this.size * 2, this.size / 2);
		fruit_ctx.fillStyle = "#175fa4";
		fruit_ctx.fill();

	},

	setData: function() {
		fruit_ctx.translate(this.r, this.c);
		fruit_ctx.rotate(-this.angle);
		fruit_ctx.translate(-this.r, -this.c);
		this.angle = 0;
		this.r = boardPosition[this.index][0];
		this.c = boardPosition[this.index][1];
		this.size = radius * Math.SQRT1_2;
		this.last = this.index;
	},

	generate: function() {
		do {
			this.index = Math.floor(Math.random() * 9);
		} while (this.index === this.last);
		this.setData();
		this.draw();
	},

	rotate: function() {
		this.clear();
		fruit_ctx.translate(this.r, this.c);
		fruit_ctx.rotate(this.speed);
		fruit_ctx.translate(-this.r, -this.c);
		this.draw();
		this.angle += this.speed;
	}


};

init_board = function(board, board_context) {
	var board_size = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
	board.width = board_size;
	board.height = board_size;
	myball.width = board.width;
	myball.height = board.height;
	myfruit.width = board.width;
	myfruit.height = board.height;

	board_context.lineWidth = boardLineWidth;
	board_context.strokeStyle = '#fde6d8';
	board_context.drawBoard(boardLineWidth / 2, boardLineWidth / 2, board_size - boardLineWidth, board_size / 4);
	board_context.stroke();

	board_context.lineWidth = midLineWidth;
	board_context.strokeStyle = '#f9cfb6';
	board_context.drawBoardLine(boardLineWidth / 2, boardLineWidth / 2, board_size - boardLineWidth, midLineWidth);
	board_context.stroke();
	return board_size;
};

var getData = function() {
	var board_size = init_board(board, board_context);
	var block_size = (board_size - 2 * boardLineWidth - 2 * midLineWidth) / 3;
	radius = block_size / 3;
	if (boardPosition !== []) {
		boardPosition = [];
	}
	for (var i = boardLineWidth + block_size / 2; i < board_size; i += block_size + midLineWidth) {
		for (var j = boardLineWidth + block_size / 2; j < board_size; j += block_size + midLineWidth) {
			boardPosition.push([j, i]);
		}
	}
	speed = block_size / 3;
};

getData();

var mainball = new ball();
mainball.draw();
var mainfruit = new fruit();
mainfruit.draw();

var handler_size = function(event) {
	getData();
	mainball.clear();
	mainball.setBall();
	mainball.draw();
	//console.log(window.innerWidth,board_size);
};

var handler_ball = function(event) {
	switch (event.keyCode) {
		case 38:
			mainball.update(-1, 0);
			break;
		case 37:
			mainball.update(0, -1);
			break;
		case 40:
			mainball.update(1, 0);
			break;
		case 39:
			mainball.update(0, 1);
			break;
		default:
			break;
	}
};

window.onresize = handler_size;
window.onkeydown = handler_ball;


var main = function() {
	mainball.move();
	mainfruit.rotate();
	if (mainball.r === mainfruit.r && mainball.c === mainfruit.c) {
		mainfruit.generate();
	}
};

setInterval(main, 20);
