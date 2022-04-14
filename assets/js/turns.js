// Turno del jugador
function playerTurn(row, index) {
  if (isFinishedGame) return;
  const [x, y, color] = row[index].split("-");
  if (color) return;
  putImageInCell(x, y);

  setTimeout(() => {
    verifyWinner();
    isPlayerTurn = false;
    botTurn();
  }, 100);
}

// Turno del bot
function botTurn() {
  if (isPlayerTurn || isFinishedGame) return;

  setTimeout(() => {
    // Verficar si el player puede ganar
    rows.forEach((row) => {
      const cellToBlock = canPlayerWinInRow(row);

      if (cellToBlock.length >= 1) {
        botBlockCell(cellToBlock);
        return;
      }
    });

    if (isPlayerTurn) return;

    const rowsTransposed = transpose(rows);
    rowsTransposed.forEach((row) => {
      const cellToBlock = canPlayerWinInRow(row);

      if (cellToBlock.length >= 1) {
        botBlockCell(cellToBlock);
        return;
      }
    });
    if (isPlayerTurn) return;
    const cellToBlockInDiagonal = canPlayerWinInDiagonal();
    if (cellToBlockInDiagonal.length >= 1) {
      botBlockCell(cellToBlockInDiagonal);
      return;
    }
    // Verificar si el bot puede ganar

    if (isPlayerTurn) return;

    const freeList = getFreeCells();

    if (freeList.length === 0) {
      isFinishedGame = true;
      return;
    }

    const randRow = freeList[Math.floor(Math.random() * freeList.length)];
    const [x, y] = randRow.split("-");

    putImageInCell(x, y);

    setTimeout(() => {
      verifyWinner();
      setTimeout(() => {
        isPlayerTurn = true;
      }, 2000);
    }, 100);
  }, 1000);
}

function botBlockCell(cellToBlock) {
  const [x, y] = cellToBlock[0].split("-");
  putImageInCell(x, y);
  isPlayerTurn = true;
  setTimeout(() => {
    verifyWinner();
  }, 100);
}

// Verifica si hay un ganador
function verifyWinner() {
  verifyRowXWinner();
  verifyRowYWinner();
  verifyDiagonalWinner();
}

// Obtiene la lista de celdas que pueden jugarse
function getFreeCells() {
  let freeList = [];
  rows.forEach((row) => {
    const freeRows = row.filter((element) => {
      const [, , color] = element.split("-");
      if (!color) return element;
    });
    freeList = [...freeList, ...freeRows];
  });
  return freeList;
}

// Coloca la imagen de la ficha correspondiente
function putImageInCell(x, y) {
  const cell = document.getElementById(`${x}-${y}`);
  const image = document.createElement("img");
  image.src = isPlayerTurn
    ? "./assets/images/black.svg"
    : "./assets/images/red.svg";
  rows[x][y] = isPlayerTurn ? `${x}-${y}-black` : `${x}-${y}-red`;
  cell.appendChild(image);
}

// Verifica que haya ganador en la fila X o Y
function verifyRowWinner(rowToVerify) {
  rowToVerify.forEach((row) => {
    winVerification(row);
  });
}

// Genera la transpuesta de la matriz del juego
function transpose(mat) {
  const newMat = JSON.parse(JSON.stringify(mat));
  for (let i = 0; i < newMat.length; i++) {
    for (let j = 0; j < i; j++) {
      const tmp = newMat[i][j];
      newMat[i][j] = newMat[j][i];
      newMat[j][i] = tmp;
    }
  }

  return newMat;
}

// Verifica que haya ganador en el eje Y
function verifyRowYWinner() {
  const rowsTransposed = transpose(rows);
  verifyRowWinner(rowsTransposed);
}

// Verifica que haya ganador en el eje X
function verifyRowXWinner() {
  verifyRowWinner(rows);
}

function canPlayerWinInRow(row) {
  const colorInRow = row.map((element) => {
    const [, , color] = element.split("-");
    return color;
  });

  if (
    colorInRow.filter((color) => color === "black").length === 2 &&
    colorInRow.filter((color) => color === undefined).length === 1
  ) {
    return row.filter((element) => {
      const [, , color] = element.split("-");
      return !color ? element : undefined;
    });
  } else {
    return false;
  }
}

function canPlayerWinInDiagonal() {
  const [dOne, dTwo] = getDiagonals();

  return canPlayerWinInRow(dOne) || canPlayerWinInRow(dTwo);
}

// Verifica si gano el player o el bot
function winVerification(row) {
  const colorInRow = row.map((element) => {
    const [, , color] = element.split("-");
    return color;
  });

  if (colorInRow.every((element) => element === "red")) {
    isPlayerWin = false;
    finishGame();
  }

  if (colorInRow.every((element) => element === "black")) {
    isPlayerWin = true;
    finishGame();
  }
}

function getDiagonals() {
  const diagonalOne = ["0-0", "1-1", "2-2"];
  const diagonalTwo = ["0-2", "1-1", "2-0"];

  const dOne = [];
  const dTwo = [];
  rows.forEach((row, rowIndex) => {
    row.forEach((element, elementIndex) => {
      if (diagonalOne.includes(`${rowIndex}-${elementIndex}`)) {
        dOne.push(element);
      }

      if (diagonalTwo.includes(`${rowIndex}-${elementIndex}`)) {
        dTwo.push(element);
      }
    });
  });
  return [dOne, dTwo];
}
// Verifica si hay ganador en la diagonal
function verifyDiagonalWinner() {
  const [dOne, dTwo] = getDiagonals();

  winVerification(dOne);
  winVerification(dTwo);
}

// Finaliza el juego y muestra el modal
function finishGame() {
  isFinishedGame = true;
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");

  modalTitle.innerText = isPlayerWin
    ? `Felicidades ${localStorage.getItem("playerName")}`
    : `¡Oh no ${localStorage.getItem("playerName")}!`;
  modalSubtitle.innerText = isPlayerWin
    ? "¡Ganaste el juego!"
    : "¡Perdiste el juego!";
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
}
