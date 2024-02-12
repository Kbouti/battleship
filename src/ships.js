const boardsJS = require("./boards.js");
const { createElement } = require("./domElements.js");

function subtract(a, b) {
  return a - b;
}

class Ship {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.hits = 0;
    this.isSunk = false;
    this.startingSpace = null;
    this.orientation = "Horizontal";
  }

  getShipClass() {
    let shipClass = this.name + this.orientation;
    return shipClass;
  }

  canShipMoveHere(startingSpace, orientation) {
    this.orientation = orientation;
    const shipLength = this.size;
    let currentSpace = startingSpace;
    let moveAllowed = true;
    if (this.orientation == "Horizontal") {
      for (let i = 0; i < shipLength; i++) {
        if (currentSpace == null || currentSpace.status !== "empty") {
          moveAllowed = false;
          return false;
        } else {
          currentSpace = currentSpace.right;
        }
      }
      return true;
    } else {
      for (let i = 0; i < shipLength; i++) {
        if (currentSpace == null || currentSpace.status !== "empty") {
          moveAllowed = false;
          return false;
        } else {
          currentSpace = currentSpace.down;
        }
      }
      return true;
    }
  }

  placeShipHere(startingSpace, orientation) {
    this.orientation = orientation;
    this.startingSpace = startingSpace;
    let size = this.size;
    let currentSpace = startingSpace;
    for (let i = 0; i < size; i++) {
      currentSpace.status = "occupied";
      currentSpace.occupant = this;
      if (orientation === "Horizontal") {
        currentSpace = currentSpace.right;
      } else {
        currentSpace = currentSpace.down;
      }
    }
    return;
  }

  render(playerName) {
    const GameBoard = document.getElementById(`${playerName}GameBoard`);
    const targetCoordinates = this.startingSpace.coordinates();
    const targetClass = targetCoordinates.join("");
    const targetDiv = GameBoard.getElementsByClassName(targetClass);
// targetDiv actually returns a nodelist with one element, so we're using targetDiv[0]
    const ship = createElement("div", targetDiv[0], null, [
      "ship",
      this.getShipClass(), this.name
    ]);
  }
}

module.exports = {
  subtract,
  Ship,
};
