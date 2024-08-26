// Logic

const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

//create board
function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines) //generate mines

  for (let x = 0; x < boardSize; x++) {//for crating the rows
    const row = []
    for (let y = 0; y < boardSize; y++) { //for creating the columns
      const element = document.createElement("div") //div element from html for tile
      element.dataset.status = TILE_STATUSES.HIDDEN //have tiles hiden by default 

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(p => positionMatch(p, { x, y })),//chack if mines match current x, y position
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }

      row.push(tile)
    }
    board.push(row)
  }

  return board
}

function markTile(tile) {
  if (//check if tile can be marked
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return
  }

  if (tile.status === TILE_STATUSES.MARKED) { //hide tiles that are unmarked 
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) { //disable for marked tiles to be revealed
    return
  }

  if (tile.mine) { //check if its a mine
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter(t => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))//reveal tiles that are empty near marked tile
  } else {//writing how many mines are near that tile
    tile.element.textContent = mines.length
  }
}

function checkWin(board) {//check if all revealed tiles are not mines -> true -> win
  return board.every(row => {
    return row.every(tile => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      )
    })
  })
}

function checkLose(board) {//if a mine is revealed -> lose
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
    })
  })
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) { //wile loop in case two mines generate on the same tile
    const position = {//randomly placing the mines 
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }

    if (!positions.some(p => positionMatch(p, position))) { //it continues going trough the loop till it places the mines "correctly"
      positions.push(position)
    }
  }

  return positions
}

function positionMatch(a, b) {//function to check if twomines match
  return a.x === b.x && a.y === b.y
}

function randomNumber(size) {//geting a random placment for mines
  return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {//checking how many mines are next to a tile
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)//add to tile array
    }
  }

  return tiles
}