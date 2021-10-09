module.exports = class Player {
	constructor(id, no, x, y) {
		this.y = y
		this.x = x
		this.id = id
		this.no = 'j' + no
        this.moves = 40
	}

	move(y, x, map) {
		if (map[this.x + x] && map[this.x + x][this.y + y] && this.moves > 0) {
			map[this.x][this.y] = '.'
			this.x += x
			this.y += y
			map[this.x][this.y] = this.no
            this.moves --
        }
	}
}