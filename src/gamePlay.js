const boardsJS = require("./boards.js");
const shipsJS = require("./ships.js");
const domElements = require("./domElements.js");

// ************************************************************************************
// Helper functions:

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
function getPreviousLetter(letter) {
  for (let i = 0; i < alphabet.length; i++) {
    if (alphabet[i] === letter) {
      return alphabet[i - 1];
    }
  }
}
function getNextLetter(letter) {
  for (let i = 0; i < alphabet.length; i++) {
    if (alphabet[i] === letter) {
      return alphabet[i + 1];
    }
  }
}

function getCoordinatesList() {
  let array = [];

  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 1; j < 11; j++) {
      let nextEntry = [alphabet[i], j];
      array.push(nextEntry);
    }
  }
  return array;
}

// ************************************************************************************
// Classes:

class Game {
  constructor(player1Name, mode, player2Name) {
    this.mode = mode;
    this.turn = null;
    this.gameIsOver = false;
    this.winner = null;

    this.player1Name = player1Name;
    this.player1Gameboard = boardsJS.createGameboard(player1Name);
    this.player1Scoreboard = boardsJS.createScoreboard(player1Name);

    this.player2Name = player2Name;
    this.player2Gameboard = boardsJS.createGameboard(player2Name);
    this.player2Scoreboard = boardsJS.createScoreboard(player2Name);
  }

  checkForWin() {
    if (this.player1Gameboard.allShipsSunk() === true) {
      this.gameIsOver = true;
      this.winner = `player2`;
      return true;
    } else if (this.player2Gameboard.allShipsSunk() === true) {
      this.gameIsOver = true;
      this.winner = `player1`;
      return true;
    }
    return false;
  }
  //  We'll still need a function to handle what happens when winning conditions are met.

  startPlayer1Turn(game) {
    console.log(`********************************************`);
    console.log(`player1 turn started`);
    domElements.setSubTitle(`${game.player1Name}, your turn`);
    game.turn = "player1";
    const scoreBoard = document.getElementById(`${game.player1Name}ScoreBoard`);
    scoreBoard.classList.add("activeBoard");
    const gameSquares = scoreBoard.querySelectorAll(`.boardSpace`);
    for (let i = 0; i < gameSquares.length; i++) {
      gameSquares[i].classList.add("activeSquare");
    }
  }

  activatePlayer1(game) {
    console.log(`activatePlayer1 called`);
    const scoreBoard = document.getElementById(`${game.player1Name}ScoreBoard`);
    const gameSquares = scoreBoard.querySelectorAll(`.boardSpace`);
    const coordinatesList = getCoordinatesList();
    const player2Gameboard = game.player2Gameboard;
    for (let i = 0; i < gameSquares.length; i++) {
      gameSquares[i].addEventListener("click", function () {
        console.log(`player1 click event triggered`);
        if (game.turn == "player2") {
          console.log(`player1 tried to go when it wasn't their turn`);
          return;
        }
        let targetLetter = coordinatesList[i][0];
        let targetNumber = coordinatesList[i][1];
        let targetSpace = player2Gameboard.getSpaceAt(
          player2Gameboard,
          targetLetter,
          targetNumber
        );
        let targetSpaceStatus = targetSpace.status;
        if (targetSpaceStatus == "hit" || targetSpaceStatus == "miss") {
          console.log(`Player1 attempting a duplicate strike, not allowing`);
          // We could add a message here like "You've already tried to strike this square"
          return;
        }
        let result = player2Gameboard.strike(
          player2Gameboard,
          targetLetter,
          targetNumber
        );
        let targetSquare = [];
        targetSquare.push(targetLetter);
        targetSquare.push(targetNumber);
        if (result == "hit") {
          game.player1Scoreboard.paintHit(targetSquare);
        } else if (result == "miss") {
          game.player1Scoreboard.paintMiss(targetSquare);
        } else if (result == "sunk") {
          game.player1Scoreboard.paintHit(targetSquare);
          console.log(`checking for win`);
          game.checkForWin();
          console.log(`game.gameIsOver: ${game.gameIsOver}`);

          if (game.gameIsOver === true) {
            console.log(`game is over. winner is: ${game.winner}`);
            scoreBoard.classList.remove("activeBoard");
            for (let i = 0; i < gameSquares.length; i++) {
              gameSquares[i].classList.remove("activeSquare");
            }
            if (game.winner == "player1") {
              domElements.setSubTitle(
                `Congratulations ${game.player1Name}, you win! `
              );
              return;
            }
            if (game.winner == "player2") {
              domElements.setSubTitle(
                `You lose.... ${game.player2Name} sunk all your ships!`
              );
              return;
            } else {
              console.log(`game is over but winner couldn't be determined`);
              throw new Error(`Game over but winner not determined`);
            }
          } else {
            console.log(`Game is not over, continuing`);
          }
        } else {
          throw new Error(
            `Could not determine results of player1 strike. result: ${result}`
          );
        }
        console.log(
          `player1 turn result: ${result} on square ${targetLetter}, ${targetNumber}`
        );
        scoreBoard.classList.remove("activeBoard");
        for (let i = 0; i < gameSquares.length; i++) {
          gameSquares[i].classList.remove("activeSquare");
        }
        game.turn = "player2";
        console.log(`setting timeout for activatePlayer2`);
        domElements.setSubTitle(`${game.player2Name} Turn`);
        setTimeout(() => {
          game.startPlayer2Turn(game);
        }, 1500);
        return;
      });
    }
  }

  startPlayer2Turn(game) {
    console.log(`********************************************`);
    console.log(`starting player2 Turn`);
    game.turn = "player2";
    let randomA = Math.floor(Math.random() * 10);
    let randomB = Math.floor(Math.random() * 10) + 1;
    let randomSquare = [];
    randomSquare.push(alphabet[randomA]);
    randomSquare.push(randomB);
    console.log(`random targetSquare: ${randomSquare}`);
    let targetSquare = game.player1Gameboard.getSpaceAt(
      this.player1Gameboard,
      randomSquare[0],
      randomSquare[1]
    );
    while (targetSquare.status == "hit" || targetSquare.status == "miss") {
      console.log(`Computer tried to duplicate a move`);
      randomA = Math.floor(Math.random() * 10);
      randomB = Math.floor(Math.random() * 10) + 1;
      randomSquare = [];
      randomSquare.push(alphabet[randomA]);
      randomSquare.push(randomB);
      targetSquare = game.player1Gameboard.getSpaceAt(
        this.player1Gameboard,
        randomSquare[0],
        randomSquare[1]
      );
    }
    let result = game.player1Gameboard.strike(
      game.player1Gameboard,
      randomSquare[0],
      randomSquare[1]
    );
    if (result == "hit") {
      game.player1Gameboard.paintHit(randomSquare);
    } else if (result == "miss") {
      game.player1Gameboard.paintMiss(randomSquare);
    } else if (result == "sunk") {
      console.log(`Sunk a ship`);
      game.player1Gameboard.paintHit(randomSquare);
      console.log(`checking for win`);
      game.checkForWin();
      if (game.gameIsOver === true) {
        console.log(`game is over. winner is: ${game.winner}`);
        if (game.winner == "player1") {
          domElements.setSubTitle(
            `Congratulations ${game.player1Name}, you win! `
          );
          return;
        }
        if (game.winner == "player2") {
          domElements.setSubTitle(
            `You lose.... ${game.player2Name} sunk all your ships!`
          );
          return;
        } else {
          console.log(`game is over but winner couldn't be determined`);
          throw new Error(`Game over but winner not determined`);
        }
      }
    } else {
      throw new Error(`Could not determine strike result. result: ${result}`);
    }
    console.log(
      `player2 turn result: ${result} on square ${randomSquare[0]}, ${randomSquare[1]}`
    );
    game.turn = "player1";
    game.startPlayer1Turn(game);
    return;
  }

  beginMatch(game) {
    // domElements.setSubTitle(game.player1Name);
    game.player1Gameboard.placeShipsRandomly();
    game.player1Scoreboard.render();
    game.player1Gameboard.render();

    const body = document.body;
    const acceptBoardButton = domElements.createElement(
      "button",
      body,
      "acceptBoardButton",
      ["button"]
    );
    acceptBoardButton.innerHTML = "Begin";

    const player1GameBoard = document.getElementById(
      `${game.player1Name}GameBoard`
    );
    const player1ScoreBoard = document.getElementById(
      `${game.player1Name}ScoreBoard`
    );

    domElements.setSubTitle(`Approve your board`);

    if (game.mode === "pVc") {
      // Player vs computer...
      acceptBoardButton.addEventListener("click", () => {
        player1GameBoard.classList.remove("setMode");
        player1ScoreBoard.classList.remove("hidden");
        player1GameBoard.classList.add("playMode");
        player1ScoreBoard.classList.add("playMode");
        acceptBoardButton.remove();

        game.player2Gameboard.placeShipsRandomly();

        game.coinFlip();

        game.activatePlayer1(game);

        if (game.turn === "player1") {
          game.startPlayer1Turn(game);
        } else if (game.turn === "player2") {
          domElements.setSubTitle(`${game.player2Name} Turn`);
          setTimeout(() => {
            game.startPlayer2Turn(game);
          }, 2250);
        } else {
          throw new Error(`Could not determine current player`);
        }

        game.messageFirstTurn();
      });
    } else if (game.mode === "pVp") {
      // Player vs Player....   We'll come back to this later
    } else {
      throw new Error("Game mode is neither pVc or pVp");
    }
  }

  coinFlip() {
    const num = Math.floor(Math.random() * 100);
    if (num > 49) {
      this.turn = "player1";
    } else if (num < 50) {
      this.turn = "player2";
    } else {
      throw new Error("Coin flip indeterminate");
    }
  }

  messageFirstTurn() {
    let message;
    if (this.turn == "player1") {
      message = `You won the coin flip! It's your turn first. Click a square to strike`;
    } else if (this.turn == "player2") {
      message = `You lost the coin flip. Your opponenet will strike first.`;
    }

    const messageBox = document.getElementById("messageBox");
    messageBox.classList.remove("hidden");
    messageBox.classList.add("flex");
    messageBox.innerHTML = message;
    function messageDisolve() {
      messageBox.classList.add("hidden");
      messageBox.classList.remove("flex");
    }
    setTimeout(messageDisolve, 1500);
  }
}

module.exports = {
  Game,
};
