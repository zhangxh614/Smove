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


function resize(sizeidth, height, canvas, context) {
	var imgData = context.getImageData(0, 0, canvas.sizeeight, canvas.height);
	canvas.sizeidth = sizeidth;
	canvas.height = height;
	context.putImageData(imgData, 0, 0);
}

var main = document.getElementById('main');
var board = document.getElementById('board');
var board_context = board.getContext('2d');
board_size = main.clientWidth > main.clientHeight ? main.clientHeight / 3 : main.clientWidth / 3;

board.width = board_size;
board.height = board_size;

var boardLineWidth = board_context.lineWidth = 8;
board_context.strokeStyle = '#fde6d8';
board_context.drawBoard(boardLineWidth / 2, boardLineWidth / 2, board_size - boardLineWidth, board_size / 4);
board_context.stroke();
midLineWidth = board_context.lineWidth = 5;
board_context.strokeStyle = '#f9cfb6';
board_context.drawBoardLine(boardLineWidth / 2, boardLineWidth / 2, board_size - boardLineWidth, midLineWidth);
board_context.stroke();
