var boardLineWidth = 8;
var midLineWidth = 5;
var boardPosition = [];
var ballPosition = [];
var speed = 0;
var radius = 0;
var largeradius = 0;
var score = 0;
var offleft = 0;
var offtop = 0;
var ballspeed = 0;
var board_size = 0;
var obBall = [];
var stageflag = 0; //0:start 1:during 2:end 3:changelevel
var startX;
var startY;
var endX;
var endY;
var X;
var Y;


var maindiv = document.getElementById('main');
var count = document.getElementById('score');

var board = document.getElementById('board');
var board_context = board.getContext('2d');

var myball = document.getElementById('ball');
var myball_context = myball.getContext('2d');

var myfruit = document.getElementById('fruit');
var fruit_ctx = myfruit.getContext('2d');

var ob = document.getElementById('obstacle');
var ob_ctx = ob.getContext('2d');

var startp = document.getElementById('start');
var endp = document.getElementById('end');
var mylevel = document.getElementById('level');



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
	this.moveTo(x + size / 3, y + boardLineWidth / 2 + linewidth * 2);
	this.lineTo(x + size / 3, offtop + size - linewidth * 2);
	this.moveTo(x + size / 3 * 2, y + boardLineWidth / 2 + linewidth * 2);
	this.lineTo(x + size / 3 * 2, offtop + size - linewidth * 2);
	this.moveTo(x + boardLineWidth / 2 + linewidth * 2, y + size / 3);
	this.lineTo(offleft + size - linewidth * 2, y + size / 3);
	this.moveTo(x + boardLineWidth / 2 + linewidth * 2, y + size / 3 * 2);
	this.lineTo(offleft + size - linewidth * 2, y + size / 3 * 2);
	this.closePath();
	return this;
};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
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



var obstacle = function(num) {
	this.num = num;
	this.or = this.r = ballPosition[num][0];
	this.oc = this.c = ballPosition[num][1];
	this.speedy = ballspeed * ballPosition[num][2];
	this.speedx = ballspeed * ballPosition[num][3];
	this.active = 0;

};

obstacle.prototype = {
	constructor: obstacle,

	draw: function() {
		ob_ctx.beginPath();
		ob_ctx.arc(this.r, this.c, largeradius, 0, Math.PI * 2, false);
		ob_ctx.closePath();

		ob_ctx.fillStyle = "#333333";
		ob_ctx.fill();
	},

	isactive: function() {
		if (this.num < 6 && this.num % 2 === 0) {
			return this.c < offtop + board_size + largeradius;
		} else if (this.num < 6) {
			return this.c > offtop - largeradius;
		} else if (this.num % 2 === 0) {
			return this.r < offleft + board_size + largeradius;
		} else {
			return this.r > offleft - largeradius;
		}
	},

	isselected: function() {
		if (this.r + largeradius < 0 || this.r - largeradius > ob.width || this.c + largeradius < 0 || this.c - largeradius > ob.height) {
			this.r = this.or;
			this.c = this.oc;
			return false;
		}
		return true;
	},

	move: function() {
		this.r = this.r + this.speedx;
		this.c = this.c + this.speedy;
		this.draw();
		this.active = this.isactive();
	},

	fastMove: function() {
		this.r = this.r + this.speedx * 2;
		this.c = this.c + this.speedy * 2;
		this.draw();
		this.active = this.isactive();
	}

};



var amount = 2;
var select = [];
var active = 0;
// var method = [
// [
// [0, 5],
// [1, 4],
// [2, 3]
// ],
// [
// [6, 11],
// [8, 9],
// [10, 7]
// ]
// ];

var level = function() {
	this.curopyacity = 0;
	this.speed = 0.01;
};

level.prototype.play = function() {
	if (stageflag === 3) {
		this.curopyacity = this.curopyacity + this.speed;
		if (this.curopyacity > 1) {
			this.speed = -this.speed;
		} else if (this.curopyacity <= 0) {
			stageflag = 1;
			this.curopyacity = 0;
			this.speed = 0.01;
		}
		mylevel.style.opacity = this.curopyacity;
	}
	return;
};

var changelevel = function(t) {
	ob_ctx.clearRect(0, 0, ob.width, ob.height);
	if (select.length > 0) {
		select.forEach(function(item, index) {
			if (t) {
				obBall[item].move();
			} else {
				obBall[item].fastMove();
			}
			if (!obBall[item].isselected()) {
				select.splice(index, 1);
			}
			if (!islegal(item)) {
				stageflag = 2;
				mainend.setData(mainball.r, mainball.c);
			}
		});
	}

	mainlevel.play();

};

var remainBall = function(stage) {
	ob_ctx.clearRect(0, 0, ob.width, ob.height);
	switch (stage) {
		case 0:
			while (select.length < amount) {
				let index = Math.floor(Math.random() * 12);
				if (!select.contains(index)) {
					obBall[index].active = 1;
					select.push(index);
				}
			}
			active = 0;
			select.forEach(function(item, index) {
				obBall[item].move();
				if (!obBall[item].isselected()) {
					select.splice(index, 1);
				}
				if (!islegal(item)) {
					stageflag = 2;
					mainend.setData(mainball.r, mainball.c);
				}
			});
			break;

		case 1:
			while (select.length < amount) {
				let index = Math.floor(Math.random() * 12);
				if (!select.contains(index)) {
					obBall[index].active = 1;
					select.push(index);
				}
			}
			active = 0;
			select.forEach(function(item, index) {
				obBall[item].fastMove();
				if (!obBall[item].isselected()) {
					select.splice(index, 1);
				}
				if (!islegal(item)) {
					stageflag = 2;
					mainend.setData(mainball.r, mainball.c);
				}
			});
			break;


		case 2:
			while (active < amount) {
				let index = Math.floor(Math.random() * 12);
				obBall[index].active = 1;
				active++;
				select.push(index);
			}
			active = 0;
			select.forEach(function(item, index) {
				obBall[item].move();
				if (!obBall[item].isselected()) {
					select.splice(index, 1);
				}
				if (obBall[item].active) {
					active++;
				}
				if (!islegal(item)) {
					stageflag = 2;
					mainend.setData(mainball.r, mainball.c);
				}

			});
			break;


		case 3:
			while (active < amount) {
				let index = Math.floor(Math.random() * 12);
				obBall[index].active = 1;
				active++;
				select.push(index);
			}
			active = 0;
			select.forEach(function(item, index) {
				obBall[item].fastMove();
				if (!obBall[item].isselected()) {
					select.splice(index, 1);
				}
				if (obBall[item].active) {
					active++;
				}
				if (!islegal(item)) {
					stageflag = 2;
					mainend.setData(mainball.r, mainball.c);
				}

			});
			break;


		default:
			break;
	}
};



var startpart = function() {
	this.speed = 0.01;
	this.cur = 0.5;
};

startpart.prototype.play = function() {
	this.cur = this.cur + this.speed;
	if (this.cur <= 0.01 || this.cur >= 1) {
		this.speed = -this.speed;
	}
	startp.style.opacity = this.cur;
};

startpart.prototype.disappear = function() {
	this.cur = 0;
	startp.style.opacity = this.cur;
};

startpart.prototype.setData = function() {
	this.speed = 0.01;
	this.cur = 0.5;
};



var endpart = function() {
	this.curangle = 0;
	this.cursize = 1;
	this.curopyacity = 1;
	this.speed = 0.4;
	this.dx = 0;
	this.dy = 0;
};

endpart.prototype.setData = function(dx, dy) {
	this.curangle = 0;
	this.cursize = 1;
	this.curopyacity = 1;
	this.speed = 0.4;

};

endpart.prototype.play = function() {
	endp.style.display = 'block';
	if (this.curangle <= 25) {
		this.curangle = this.curangle + this.speed;
		maindiv.style.transform = 'rotate(' + String(this.curangle) + 'deg) ' + 'scale(' + String(this.cursize) + ')';

	}
	if (this.cursize <= 3.5) {
		this.cursize = this.cursize + this.speed / 10;
		maindiv.style.transform = 'rotate(' + String(this.curangle) + 'deg) ' + 'scale(' + String(this.cursize) + ')';
	}
	if (this.curopyacity >= 0.4) {
		this.curopyacity = this.curopyacity - this.speed / 70;
		maindiv.style.opacity = this.curopyacity;
		endp.style.opacity = 1 - this.curopyacity;
	}
	return;

};



var init_board = function(board, board_context) {
	var board_size = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
	offleft = (window.innerWidth - board_size) / 2;
	offtop = (window.innerHeight - board_size) / 2;
	//console.log(offleft, offtop);
	board.width = window.innerWidth;
	board.height = window.innerHeight;
	myball.width = window.innerWidth;
	myball.height = window.innerHeight;
	myfruit.width = window.innerWidth;
	myfruit.height = window.innerHeight;
	ob.width = window.innerWidth;
	ob.height = window.innerHeight;
	mylevel.style.top = startp.style.top = String(offtop / 3) + 'px';
	mylevel.style.fontSize = startp.style.fontSize = String(board_size / 5) + 'px';
	count.style.top = offtop / 3;
	count.style.left = String(offleft / 3) + 'px';
	count.style.fontSize = board_size / 3 * 2;
	endp.style.width = String(board_size * 2) + 'px';
	endp.style.height = String(board_size / 3) + 'px';
	endp.style.fontSize = String(board_size / 3) + 'px';

	board_context.lineWidth = boardLineWidth;
	board_context.strokeStyle = '#fde6d8';
	board_context.drawBoard(offleft + boardLineWidth / 2, offtop + boardLineWidth / 2, board_size - boardLineWidth, board_size / 4);
	board_context.stroke();

	board_context.lineWidth = midLineWidth;
	board_context.strokeStyle = '#f9cfb6';
	board_context.drawBoardLine(offleft + boardLineWidth / 2, offtop + boardLineWidth / 2, board_size - boardLineWidth, midLineWidth);
	board_context.stroke();
	return board_size;
};

var getData = function() {
	board_size = init_board(board, board_context);
	var block_size = (board_size - 2 * boardLineWidth - 2 * midLineWidth) / 3;
	radius = block_size / 3;
	largeradius = block_size / 2.7;
	if (boardPosition !== []) {
		boardPosition = [];
	}
	if (ballPosition !== []) {
		ballPosition = [];
	}
	var flag = true;
	for (var i = boardLineWidth + block_size / 2; i < board_size; i += block_size + midLineWidth) {
		for (var j = boardLineWidth + block_size / 2; j < board_size; j += block_size + midLineWidth) {
			boardPosition.push([offleft + j, offtop + i]);
			if (flag) {
				ballPosition.push([j + offleft, 0 - largeradius, 1, 0]);
				ballPosition.push([j + offleft, ob.height + largeradius, -1, 0]);
			}
		}
		flag = false;
		ballPosition.push([0 - largeradius, i + offtop, 0, 1]);
		ballPosition.push([ob.width + largeradius, i + offtop, 0, -1]);

	}
	speed = block_size / 6;
	ballspeed = board_size / 60;
	if (obBall !== []) {
		obBall = [];
	}
	for (var i = 0; i < 12; i++) {
		var tmp = new obstacle(i);
		obBall.push(tmp);
	}
};

var islegal = function(i) {
	if (Math.abs(mainball.r - obBall[i].r) * Math.abs(mainball.r - obBall[i].r) + Math.abs(mainball.c - obBall[i].c) * Math.abs(mainball.c - obBall[i].c) < (radius + largeradius) * (radius + largeradius)) {
		return false;
	}
	return true;
};


var resetGame = function() {
	score = 0;
	changeflag = true;
	mainend.setData();
	mainstart.setData();
	ob_ctx.clearRect(0, 0, ob.width, ob.height);
	maindiv.style.transform = '';
	maindiv.style.opacity = 1;
	count.style.opacity = 0;
	stageflag = 0;
	mainball.x = 1;
	mainball.y = 1;
	mainball.clear();
	mainball.setBall();
	mainball.draw();
	mainfruit.x = 0;
	mainfruit.y = 0;
	mainfruit.clear();
	mainfruit.setData();
	mainfruit.draw();
	endp.style.opacity = 0;
	endp.style.display = 'none';
	select = [];
	active = 0;
};



getData();

var mainball = new ball();
mainball.draw();
var mainfruit = new fruit();
mainfruit.draw();
var mainstart = new startpart();
var mainend = new endpart();
var mainlevel = new level();



var handler_size = function(event) {
	getData();
	mainball.clear();
	mainball.setBall();
	mainball.draw();
	mainfruit.clear();
	mainfruit.setData();
	mainfruit.draw();
	//console.log(window.innerWidth,board_size);
};

var handler_click = function(event) {
	resetGame();
};

var handler_ball = function(event) {
	if (stageflag === 0) {
		stageflag = 1;
		mainstart.disappear();
		count.style.opacity = 1;
	}
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

maindiv.addEventListener('touchstart', function(e) {
	e.preventDefault();
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
	console.log(startX, startY);
});

maindiv.addEventListener('touchmove', function(e) {
	e.preventDefault();
	endX = e.changedTouches[0].pageX;
	endY = e.changedTouches[0].pageY;
	X = endX - startX;
	Y = endY - startY;
});
maindiv.addEventListener('touchend', function(e) {
	e.preventDefault();
	if (stageflag === 0) {
		stageflag = 1;
		mainstart.disappear();
		count.style.opacity = 1;
	}

	if (Math.abs(X) > Math.abs(Y) && X > 0) {
		mainball.update(0, 1);
	} else if (Math.abs(X) > Math.abs(Y) && X < 0) {
		mainball.update(0, -1);
	} else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
		mainball.update(1, 0);
	} else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
		mainball.update(-1, 0);
	} else {
		return;
	}
});

window.onresize = handler_size;
window.onkeydown = handler_ball;
endp.onclick = handler_click;

var changeflag = true;

var main = function() {
	if (score % 10 === 0 && score !== 0 && changeflag) {
		stageflag = 3;
		changeflag = false;
	}
	switch (stageflag) {
		case 0:
			mainstart.play();
			break;
		case 1:
			mainball.move();
			mainfruit.rotate();
			remainBall(Math.floor(score / 10) % 4);
			if (mainball.r === mainfruit.r && mainball.c === mainfruit.c) {
				mainfruit.generate();
				score++;
				changeflag = true;
			}
			break;
		case 2:
			mainend.play();
			break;
		case 3:
			mainfruit.clear();
			mainball.move();
			changelevel(Math.floor(score / 10) % 2);
			break;
	}
	count.textContent = score;
};

setInterval(main, 15);
