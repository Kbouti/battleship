const { createHtmlTagObject } = require("html-webpack-plugin");
const gameBoard = require("./gameBoard.js");
const ships = require("./ships.js");

test("subtract from ships file", () => {
  expect(ships.subtract(70, 1)).toBe(69);
});

test(`expect spaces[0].getCoordinates to return [A,1]`, () => {
  const testGameBoard = gameBoard.createGameboard("testBoard");
  expect(testGameBoard.spaces[0].coordinates()).toStrictEqual(["A", 1]);
});

test(`findPreviousLetter returns B if given C`, () => {
  expect(gameBoard.getPreviousLetter("C")).toBe("B");
});

test('get square above ["C", 4]', () => {
  const testGameBoard = gameBoard.createGameboard("testBoard");
  const C4 = testGameBoard.getSpaceAt("C", 4);
  const A4 = testGameBoard.getSpaceAt("A", 4);
  expect(C4.up).toEqual(A4.down);
});
