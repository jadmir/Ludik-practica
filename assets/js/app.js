const rows = Array(3).fill('')
let isPlayerTurn = true
let isFinishedGame = false
let isPlayerWin = false

function init() {
    const playerNameExists = localStorage.getItem('playerName');
    const playerContent = document.getElementById('playerContent');
    const initGameForm = document.getElementById('initGameForm')
    const exitButton = document.getElementById('exitButton')

    exitButton.addEventListener('click', () => {
        localStorage.removeItem('playerName');
        playerContent.classList.add('hidden');
        window.location.href = 'index.html';
    });


    if (!playerNameExists) {
        initGameForm.classList.remove('hidden');
        playerContent.classList.add('hidden');
        initGameForm.addEventListener('submit', ev => {
            ev.preventDefault()
            createPlayer()
        })
    } else {
        initGame()
    }
}

function createPlayer() {
    const playerName = document.getElementById('playerNameInput')?.value
    localStorage.setItem('playerName', playerName)
    initGame()
}

function setPlayerData() {
    const playerContent = document.getElementById('playerContent');
    const initGameForm = document.getElementById('initGameForm')
    const playerName = document.getElementById('playerName')

    initGameForm.classList.add('hidden')
    playerContent.classList.remove('hidden');
    playerName.innerHTML = localStorage.getItem('playerName');
}

function initGame() {
    setPlayerData()
    const gameBoard = document.getElementById('gameBoard')

    rows.forEach((element, index, array) => [
        array[index] = Array(3).fill('')
    ])

    rows.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div')
        rowElement.classList.add('row')

        row.forEach((element, index) => {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            row[index] = `${rowIndex}-${index}`
            cell.id = `${rowIndex}-${index}`
            cell.addEventListener('click', () => isPlayerTurn && playerTurn(row, index))
            rowElement.appendChild(cell)
        })

        gameBoard.appendChild(rowElement)
    })
}

init()

