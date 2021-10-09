const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const {map, placePlayerOnMap, removePlayerFromMap} = require('./assets/map')
const { randomPosition } = require("./assets/funk")
const io = new Server(server)
const Player = require('./assets/player')
let players = []
const numPlayers = 2

//=============================IO========================================//

io.on('connection', (socket) => {
	managePlayers(socket)

	if (players.length === numPlayers) {
		console.log(numPlayers + " players game start")
		io.emit("start-game", {map: map, players: players})
	}

	socket.on("move", function(data) {
		let p  = findPlayer(socket)
		p.move(data.x, data.y, map)
		io.emit("update-state", {map: map})
		io.to(socket.id).emit("me", {me: p});
	})

	socket.on('disconnect', function() {
		removePlayer(socket)
		io.emit("update-players", {players: players})
		reindexPlayers()
	});

})

app.use(express.static('static'))
server.listen(3000, () => {  console.log('listening on *:3000')})




//============================== Players funks ===============================//

function addPlayer(id, no) {
	let newP = new Player(
		id,
		no,
		randomPosition(map.length),
		randomPosition(map[0].length)
		)
	players.push(newP)
	placePlayerOnMap(newP, map)
}

function removePlayer(socket) {
	let i = players.findIndex(p => p.id === socket.id);
	removePlayerFromMap(players[i], map)
	players.splice(i, 1);
	if (players.length !== numPlayers) {
		io.emit("end-game")
	}
}

function findPlayer(socket) {
	return players.find(p => p.id === socket.id)
}

function managePlayers(socket) {
	if (players.length <= numPlayers) {
		addPlayer(socket.id, players.length + 1)
	}
}

function reindexPlayers() {
	let u = 1
	for (let i = 0; i < players.length; i++){
		players[i].no = 'j' + u
		u++
	}
}