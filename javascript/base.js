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

var boardLineWidth = 8;
var midLineWidth = 5;

init_board = function(board, board_context) {
	var board_size = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
	board.width = board_size;
	board.height = board_size;

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

var main = document.getElementById('main');
var board = document.getElementById('board');
var board_context = board.getContext('2d');
var myball = document.getElementById('ball');
var myball_context = myball.getContext('2d');

var board_size = init_board(board, board_context);
var block_size = (board_size - 2 * boardLineWidth - 2 * midLineWidth) / 3;
var radius = block_size / 3;

var handler_size = function(event) {
	board_size = init_board(board, board_context);
	block_size = (board_size - 2 * boardLineWidth - 2 * midLineWidth) / 3;
	//console.log(window.innerWidth,board_size);
};

window.onresize = handler_size;

init_myball = function() {
	myball.width = board.width;
	myball.height = board.height;

	myball_context.beginPath();
	myball_context.arc(board_size / 2, board_size / 2, radius, 0, Math.PI * 2, false);
	myball_context.closePath();

	myball_context.fillStyle = "white";
	myball_context.fill();
};

init_myball();

// var main = function() {
// //var size = init_board(board, board_context);
// };

// setInterval(main, 20);
