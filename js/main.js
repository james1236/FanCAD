var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext('2d');

var mouse = {x:0,y:0}

var image = new Image();
image.src = "img/scripts/default/Set Camera.png";

var camera = {x:0, y:0, scale:64}

function drawGrid() {
	context.strokeStyle = "white";
	//Decreases grid line opacity when zoomed far out
	context.globalAlpha = 0.25 - ((24-Math.min(24,camera.scale))/24)*0.25;
	
	//Vertical grid lines
	for (x = camera.x % camera.scale; x < canvas.width; x+=camera.scale) {
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height);
		context.lineWidth = 1;
		context.stroke();
	}	
	//Horizontal grid lines
	for (y = camera.y % camera.scale; y < canvas.height; y+=camera.scale) {
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(canvas.width, y);
		context.lineWidth = 1;
		context.stroke();
	}
	
	context.globalAlpha = 1;
}

function floorToScale(num, scale) {
	return Math.floor(num / scale) * scale;
}

function renderLoop() {
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;
	
	context.imageSmoothingEnabled = false;
	
	context.fillStyle = "#00B8FF";
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawGrid();
	
	try {
		context.drawImage(image, 0+camera.x, 0+camera.y, camera.scale*2, camera.scale*3);
	} catch (e) {}
	
	requestAnimationFrame(renderLoop);
}

function click(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	mouse.pressed = true;
	startDrag();
}

function mousemove(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
	
	if (mouse.pressed) {
		camera.x = camera.x + (mouse.x - mouse.drag.x)*0.8;
		camera.y = camera.y + (mouse.y - mouse.drag.y)*0.8;
		mouse.drag = {x:mouse.x, y:mouse.y};
	}
}

function unclick(event) {
	mouse.pressed = false;
}

document.onmousewheel = function(event) {
	delta = null;
    if (event.wheelDelta) {
		delta = event.wheelDelta / 60;
    } else if (event.detail) {
		delta = -event.detail / 2;
    }
	
	zoom(!(delta > 0));
}


function zoom(out) {
	oldScale = camera.scale;
	if (out) {
		camera.scale = Math.max(camera.scale-2,8);
		
	} else {
		camera.scale = Math.min(camera.scale+2,256);
	}
	
	//Zoom relative to mouse
	zoomFactor = camera.scale/oldScale;
	
	scw = {x:mouse.x,y:mouse.y};
	camera.x -= scw.x;
	camera.y -= scw.y;
	camera.x *= zoomFactor;
	camera.y *= zoomFactor;
	camera.x += scw.x;
	camera.y += scw.y;
}


function screenToWorld(x,y) {
	//pass
}

function startDrag() {
	mouse.drag = {x:mouse.x, y:mouse.y};
}

document.addEventListener("mousedown", click);
document.addEventListener("mousemove", mousemove);
document.addEventListener("mouseup", unclick);

requestAnimationFrame(renderLoop);