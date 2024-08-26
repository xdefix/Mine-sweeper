// Display

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES) //drawing the board
const boardElement = document.querySelector(".board") //get board from html
const minesLeftText = document.querySelector("[data-mine-count]")//set mine counter
const messageText = document.querySelector(".subtext")//change text to win/lose message

board.forEach(row => { //rows
  row.forEach(tile => { //individual tiles
    boardElement.append(tile.element) //element created in mindsweeper.js
    tile.element.addEventListener("click", () => {//left click
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", e => {//right click
      e.preventDefault()//doesn't get default menu from right click
      markTile(tile)//pass it to tile we want to mark
      listMinesLeft()//write the number of mines left
    })
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE)//set the property from styles.css
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {//counting the marked tiles
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount // how many are left
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "Great success!"
  }
  if (lose) {
    messageText.textContent = "Insignificant failure!"
    board.forEach(row => {//reveal all mines to let player see if they are right
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)//remove marked tiles
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(e) { //make game unplayable if won
  e.stopImmediatePropagation()
}