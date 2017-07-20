// var canvas = document.getElementById("myCanvas");
// var cxt = canvas.getContext("2d");
// cxt.strokeStyle = "#ff8040";
// cxt.fillStyle = "#0000ff";
// cxt.arc(100,100,50,0,2*Math.PI,true);
// cxt.fill();
// cxt.strokeRect(30,20,100,150);

// function resize(w,h)
// {
// var imgData = cxt.getImageData(0,0,canvas.width,canvas.height);
// canvas.width = w;
// canvas.height = h;
// cxt.putImageData(imgData,0,0);
// }
function resize(width, height, canvas, context) {
	var imgData = context.getImageData(0, 0, canvas.weight, canvas.height);
	canvas.width = width;
	canvas.height = height;
	context.putImageData(imgData, 0, 0);
}

var main = document.getElementById('main');
var back=document.getElementById('back');
var back_context=back.getContext('2d');

back_context.strokeStyle='white';
back_context.lineWidth=6;
back_context.strokeRect(100,100,300,300);
