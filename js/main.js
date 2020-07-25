var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext('2d');

var mouse = {x:0,y:0}

var imageCache = {};

var project = {
	world: {
		scripts:{}
	}
}

createScript("Set Camera",0,0);
createScript("Set Camera",0,3);

function createScript(type,x,y) {	
	id = Math.random().toString(); //roughly 1 in one hundred quintillion chance of ID overlap :sweatsmile:
	script = {
		type:type,
		x:x,
		y:y,
		scale: defaultScriptProperties?.[type]?.scale || {x:1,y:1},
		ports: {}
	};
	
	//Populating ports from template
	for (port of defaultScriptProperties?.[type]?.ports || []) {
		p = JSON.parse(JSON.stringify(port)); //dereferencing
		p.connections = {};  //connections stored as {"scriptID":["portID"]}
		script.ports[Math.random().toString()] = p;
	}
	
	project.world.scripts[id] = script;
}

var colors = {
	"vector": "#A6FF65",
	"rotation": "#EE8A56",
	"number": "#13D9F3",
	"execute": "#F0E764",
	"sheath1": "#D4E2EF",
	"sheath2": "#FFFFFF",
	
	"background" : "#00B8FF"
};

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
	
	//Draw background
	context.fillStyle = colors.background;
	context.fillRect(0,0,canvas.width,canvas.height);
	
	drawGrid();
	
	//Draw script
	for (script in project.world.scripts) {
		drawScript(project.world.scripts[script]);
	}
	
	requestAnimationFrame(renderLoop);
}


function drawScript(script) {
	//Script image already cached
	if (imageCache?.[script.type] !== undefined) {
		//Fade out shadow with zoom out
		context.shadowColor = "rgba(0,0,0," + (0.3 - ((24-Math.min(24,camera.scale))/24)*0.3) + ")";
		
		context.shadowBlur = 7;
		context.shadowOffsetX = -camera.scale/8;
		context.shadowOffsetY = camera.scale/8;
	
		context.drawImage(
			imageCache[script.type],	//image
			(script.x*camera.scale)+camera.x,
			(script.y*camera.scale)+camera.y,
			camera.scale*script.scale.x,
			camera.scale*script.scale.y
		);
		
		//A transparent shadow color disables shadow drawing
		context.shadowColor = "rgba(0,0,0,0)";
	} else {
		imageCache[script.type] = new Image();
		imageCache[script.type].src = `img/scripts/default/${script.type}.png`;
	}
	
	//Draw ports
	for (portID in script.ports) {
		port = script.ports[portID]
		context.fillStyle = colors[port.type];

		portX = (camera.scale*script.x)+(camera.scale*port.x)+camera.x;
		portY = (camera.scale*script.y)+(camera.scale*port.y)+camera.y;
		
		if (!Object.keys(port.connections).length) {
			switch (port.side) {
				case "left":
					context.fillRect(
						portX-camera.scale/16,
						portY+(camera.scale/2-camera.scale/8),
						camera.scale/16,
						camera.scale/4
					);
					break;				
				case "right":
					context.fillRect(
						portX+camera.scale-camera.scale/8,
						portY+(camera.scale/2-camera.scale/8),
						camera.scale/16,
						camera.scale/4
					);
					break;
				case "up":
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8),
						portY+camera.scale/16,
						camera.scale/4,
						camera.scale/16
					);
					break;				
				case "down":
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8),
						portY+camera.scale,
						camera.scale/4,
						camera.scale/16
					);
					break;
			}
		} else {
			//Draw connection sheath
			context.fillStyle = colors.sheath1;
			switch (port.side) {
				case "left":
					context.fillRect(
						portX-camera.scale/8,
						portY+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						camera.scale/8,
						camera.scale*0.375
					);
					
					context.fillStyle = colors.sheath2;
					
					context.fillRect(
						portX-camera.scale/8,
						portY+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						camera.scale/8,
						camera.scale/8
					);
					
					break;				
				case "right":
					context.fillRect(
						portX+camera.scale-camera.scale/8,
						portY+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						camera.scale/8,
						camera.scale*0.375
					);
					
					context.fillStyle = colors.sheath2;
					
					context.fillRect(
						portX+camera.scale-camera.scale/8,
						portY+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						camera.scale/8,
						camera.scale/8
					);
					break;
				case "up":
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						portY,
						camera.scale*0.375,
						camera.scale/8
					);
					
					context.fillStyle = colors.sheath2;
					
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8)-camera.scale*0.0625+camera.scale/4,
						portY,
						camera.scale/8,
						camera.scale/8
					);
					break;				
				case "down":
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8)-camera.scale*0.0625,
						portY+camera.scale,
						camera.scale*0.375,
						camera.scale/8
					);
					
					context.fillStyle = colors.sheath2;
					
					context.fillRect(
						portX+(camera.scale/2-camera.scale/8)-camera.scale*0.0625+camera.scale/4,
						portY+camera.scale,
						camera.scale/8,
						camera.scale/8
					);
					break;
			}
		}
	}
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

function startDrag() {
	mouse.drag = {x:mouse.x, y:mouse.y};
}

document.addEventListener("mousedown", click);
document.addEventListener("mousemove", mousemove);
document.addEventListener("mouseup", unclick);

requestAnimationFrame(renderLoop);