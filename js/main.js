var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext('2d');


var image = new Image();
image.src = "img/scripts/default/Set Camera.png";


function renderLoop() {
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;
	
	context.imageSmoothingEnabled = false;
	
	context.fillStyle = "#00B8FF";
	context.fillRect(0,0,canvas.width,canvas.height);
	
	try {
		context.drawImage(image, canvas.width/2-64, canvas.height/2-96,128,128+64);
	} catch (e) {}
	
	requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);