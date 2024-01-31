const { createElement } = require("./domElements.js");
const Ship = require("./ships.js");

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

// ************************************************************************************
// Classes:

class Gameboard {
  constructor(playerName) {
    this.playerName = playerName;
    this.ships = this.generateShips(this);
    this.isMyTurn = false;
    this.spaces = this.generateEmptySpaces(this);
  }
  generateShips() {
    let ships = [];
    const carrier = new Ship.Ship("Carrier", 5);
    const battleship = new Ship.Ship("Battleship", 4);
    const submarine = new Ship.Ship("Submarine", 3);
    const cruiser = new Ship.Ship("Cruiser", 3);
    const destroyer = new Ship.Ship("Destroyer", 2);
    ships.push(carrier);
    ships.push(battleship);
    ships.push(submarine);
    ships.push(cruiser);
    ships.push(destroyer);
    return ships;
  }
  generateEmptySpaces(board) {
    let spaces = [];
    for (let i = 0; i < alphabet.length; i++) {
      for (let j = 1; j < 11; j++) {
        const newSpace = new Space(board, alphabet[i], j);
        spaces.push(newSpace);
      }
    }
    return spaces;
  }
  getSpaceAt(verticleCoordinate, horizontalCoordinate) {
    // Returns a space object for the given coordinates
    for (let i = 0; i < this.spaces.length; i++) {
      if (
        this.spaces[i].verticleCoordinate === verticleCoordinate &&
        this.spaces[i].horizontalCoordinate === horizontalCoordinate
      ) {
        return this.spaces[i];
      }
    }
  }
  linkSpaces() {
    // This function establishes left/right and up/down references between all squares. It should be run immedietely after generating squares
    for (let i = 0; i < this.spaces.length; i++) {
      if (this.spaces[i].verticleCoordinate === "A") {
        this.spaces[i].up = null;
      } else {
        this.spaces[i].up = this.getSpaceAt(
          getPreviousLetter(this.spaces[i].verticleCoordinate),
          this.spaces[i].horizontalCoordinate
        );
      }
      if (this.spaces[i].verticleCoordinate === "J") {
        this.spaces[i].down = null;
      } else {
        this.spaces[i].down = this.getSpaceAt(
          getNextLetter(this.spaces[i].verticleCoordinate),
          this.spaces[i].horizontalCoordinate
        );
      }
      if (this.spaces[i].horizontalCoordinate === 1) {
        this.spaces[i].left = null;
      } else {
        this.spaces[i].left = this.getSpaceAt(
          this.spaces[i].verticleCoordinate,
          this.spaces[i].horizontalCoordinate - 1
        );
      }
      if (this.spaces[i].horizontalCoordinate === 10) {
        this.spaces[i].right = null;
      } else {
        this.spaces[i].right = this.getSpaceAt(
          this.spaces[i].verticleCoordinate,
          this.spaces[i].horizontalCoordinate + 1
        );
      }
    }
    return;
  }

  getRandomOrientation() {
    let orientation = "horizontal";
    if (Math.floor(Math.random() * 10) > 4) {
      orientation = "verticle";
    }
    return orientation;
  }

  getRandomSpace() {
    let randomSpace = this.spaces[Math.floor(Math.random() * 1000)];
    return randomSpace;
  }

  placeShipsRandomly() {
    for (let i = 0; i < this.ships.length; i++) {
      let ship = this.ships[i];
      let randomSpace = this.getRandomSpace();
      let randomOrientation = this.getRandomOrientation();
      while (ship.canShipMoveHere(randomSpace, randomOrientation) === false) {
        randomSpace = this.getRandomSpace();
        randomOrientation = this.getRandomOrientation();
      }
      console.log(
        `placing ${
          ship.name
        } at ${randomSpace.coordinates()} ${randomOrientation}`
      );
      ship.placeShipHere(randomSpace, randomOrientation);
    }
    console.log(`Done placing ships for: ${this.playerName}`);
  }

  strike(letter, number) {
    if (!alphabet.includes(letter) || number > 10 || number < 1) {
      throw new Error(`Attempted to strike an invalid space`);
    }
    let targetSpace = this.getSpaceAt(letter, number);
    if (targetSpace.status === "empty") {
      console.log(`[${letter},${number}] Miss`);
      return "Miss";
    } else if (targetSpace.status === "occupied") {
      targetSpace.status = "hit";
      let ship = targetSpace.occupant;
      ship.hits++;
      if (ship.hits === ship.size) {
        ship.isSunk = true;
        console.log(
          `[${letter},${number}] Hit, you've sunk the enemy's ${ship.name}`
        );
        return "Sunk";
      }
      console.log(`[${letter},${number}] Hit`);
      return "Hit";
    }
  }

  render() {
    // First check to see if a gameboard dom unit exists for this gameboard.
    // If true, remove it.
    // Then, create a grid with dom elements including a visual representation of where the ships are


// Changes needed:
// All squares, even oppupied spaces and legends should have ocean blbue background
// Determine a color for legend characters with enough contrast
// Instead of an "occupied" class, I think we need ship objects to lay on top of the board. 




    if (document.getElementById(`${this.playerName}GameBoard`) !== null) {
      const gameBoard = document.getElementById(`${this.playerName}GameBoard`);
      gameBoard.remove();
    }

    const body = document.body;
    const gameBoard = createElement(
      "div",
      body,
      `${this.playerName}GameBoard`,
      ["gameBoardGrid"]
    );

      for (let i = 0;i< 121; i++){
        let newSpace = createElement("div", gameBoard, null, ["onTheBoard"]);
        let randomNum = Math.floor(Math.random() * 10);
        let remainder = randomNum % 6;
        if (remainder == 0) {
          newSpace.classList.add(`oceanBlue1`);
        }
        if (remainder == 1) {
          newSpace.classList.add(`oceanBlue2`);
        }
        if (remainder == 2) {
          newSpace.classList.add(`oceanBlue3`);
        }
        if (remainder == 3) {
          newSpace.classList.add(`oceanBlue4`);
        }
        if (remainder == 4) {
          newSpace.classList.add(`oceanBlue5`);
        }
        if (remainder == 5) {
          newSpace.classList.add(`oceanBlue5`);
        }
      }
      // Ok, we've made our square, now we need to create the legend
      // We're also gonna need a way to put ships on it. Perhaps we name out grid lines? 

      const squares = document.querySelectorAll(".onTheBoard");
      console.log(`squares.length: ${squares.length}`);
      // Boom, now we're got an array of all the elements



    }




  //   const blankCornerSpace = createElement("div", gameBoard, null, [
  //     ".onTheBoard", "oceanBlue2"
  //   ]);
  //   for (let i = 1; i < 11; i++) {
  //     const newSpace = createElement("div", gameBoard, null, [
  //       "ontheBoard",
  //       "boardLegend",
  //     ]);
  //     newSpace.innerHTML = i;
  //   }
  //   for (let j = 0; j < alphabet.length; j++) {
  //     const legend = createElement("div", gameBoard, null, [
  //       "onTheBoard",
  //       "boardLegend",
  //     ]);
  //     legend.innerHTML = alphabet[j];

  //     for (let i = 1; i < 11; i++) {
  //       const newSpace = createElement("div", gameBoard, null, [
  //         "ontheBoard",
  //         "boardSpace",
  //         `space${j}${i}`,
  //       ]);
  //       console.log(this);
  //       console.log(`j: ${j}`);
  //       console.log(`i: ${i}`);
  //       const space = this.getSpaceAt(alphabet[j], i);
  //       if (space.status == "empty") {
  //         let randomNum = Math.floor(Math.random() * 10);
  //         let remainder = randomNum % 6;
  //         console.log(randomNum);
  //         console.log(`remainder: ${remainder}`);
  //         if (remainder == 0) {
  //           newSpace.classList.add(`empty1`);
  //         }
  //         if (remainder == 1) {
  //           newSpace.classList.add(`empty2`);
  //         }
  //         if (remainder == 2) {
  //           newSpace.classList.add(`empty3`);
  //         }
  //         if (remainder == 3) {
  //           newSpace.classList.add(`empty4`);
  //         }
  //         if (remainder == 4) {
  //           newSpace.classList.add(`empty5`);
  //         }
  //         if (remainder == 5) {
  //           newSpace.classList.add(`empty5`);
  //         }
  //       }
  //       if (space.status == "occupied") {
  //         newSpace.classList.add("occupied");
  //       }
  //       if (space.status == "hit") {
  //         newSpace.classList.add("hit");
  //       }
  //     }
  //   }
  // }
}

class Scoreboard {
  constructor(playerName) {
    this.playerName = playerName;
    this.spaces = this.generateEmptySpaces();
  }

  generateEmptySpaces() {
    let spaces = [];
    for (let i = 0; i < alphabet.length; i++) {
      for (let j = 1; j < 11; j++) {
        const newSpace = new ScoreboardSpace(alphabet[i], j);
        spaces.push(newSpace);
      }
    }
    return spaces;
  }

  render() {
    // We can copy most of this from gameboard.render, but we'll want to take a closer look at the classes
  }
}

class Space {
  constructor(board, verticleCoordinate, horizontalCoordinate) {
    this.board = board;
    this.verticleCoordinate = verticleCoordinate;
    this.horizontalCoordinate = horizontalCoordinate;
    this.status = "empty";
    this.occupant = null;
    this.up = null;
    this.down = null;
    this.right = null;
    this.left = null;
  }
  coordinates() {
    return [this.verticleCoordinate, this.horizontalCoordinate];
  }
}

class ScoreboardSpace {
  constructor(verticleCoordinate, horizontalCoordinate) {
    this.verticleCoordinate = verticleCoordinate;
    this.horizontalCoordinate = horizontalCoordinate;
    this.status = "empty";
  }
}

// ************************************************************************************
// Export functions:

// (These could maybe have been written as methods)

function createGameboard(playerName) {
  let newBoard = new Gameboard(playerName);
  newBoard.linkSpaces();
  return newBoard;
}

function createScoreboard(playerName) {
  let newScoreboard = new Scoreboard(playerName);
  return newScoreboard;
}

module.exports = {
  // createGameBoard is the only export that's really necessary, the rest are exported to be tested
  Gameboard,
  Scoreboard,
  alphabet,
  getPreviousLetter,
  getNextLetter,
  createGameboard,
  createScoreboard,
};