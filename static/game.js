let tileSize
let map = [[]];
let players = []
let info = "En attente de joueurs"
let canvas
let me
let ingame = false

socket.on('start-game', function(data) {
	ingame = true
	players = data.players
	info = ""
	map = data.map
	tileSize = Math.floor(600 / map.length)
	setup()
});

socket.on('end-game', function(data) {
	ingame = false
	map = [[]]
	players = []
	info = "En attente de joueurs"
});

socket.on("update-players", function(newPlayers) {
	players = []
	players = newPlayers
})

socket.on("update-state", (data) => {
	map = data.map
})

socket.on("me", (data) => {
	me = data.me
})

function setup() {
	canvas =createCanvas(800, 600)
}

function draw() {
	background(1)
	ui()
	drawMap()
}

function drawMap() {
	for ( let i = 0; i < map[0].length; i++) {
		for ( let j = 0; j < map.length; j++) {
			if (
			    mouseX > i * tileSize &&
			    mouseX < i * tileSize + tileSize &&
			    mouseY > j * tileSize &&
			    mouseY < j * tileSize + tileSize

		  	) {
				innerH(".mousex", i)
				innerH(".mousey", j)
				document.querySelector(".mousex").innerHTML = i + ":"
				document.querySelector(".mousey").innerHTML = j
				fill('rgba(255,255,255, 0.25)')
		  	}
		  	else if (map[j][i] === '.') {
				fill(0)
			}
			else if (map[j][i] === 'j1') {
				fill(50, 204, 100)
			}
			else if (map[j][i] === 'j2') {
				fill(255, 50, 50)
			}
			else {
				fill(255)
			}
			stroke(100, 100, 100);
			rect(i * tileSize + 1, j * tileSize + 1, tileSize-1, tileSize-1);
		}
	}
}

function keyPressed() {
	if(ingame) {
		if (keyCode === 81) {
			socket.emit("move", {x: -1, y: 0});
		} else if (keyCode === 68) {
			socket.emit("move", {x: 1, y: 0});
		} else if (keyCode === 90) {
			socket.emit("move", {x: 0, y: -1});
		} else if (keyCode === 83) {
			socket.emit("move", {x: 0, y: 1});
		}
	}
}

function ui() {
	textSize(32);
	fill(255,20,147);
	text(info, width / 2 - 170, height / 2);
	if (ingame) {
		innerH(".xcoord", me && "x: " +  me.y)
		innerH(".ycoord", me && "y" + me.x)
		innerH(".left", me && me.moves)
	}
}

function innerH(tag, value) {
	document.querySelector(tag).innerHTML = value
}