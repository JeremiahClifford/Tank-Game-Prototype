"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//section for handling the players
//defines the size of a player on the screen to be used when calculating player position and board grid size
const playerSize = 40;
//defines the size of the drawn board squares
const boardSquareSize = 50;
//holds a list of the players
let players = [];
//how far apart 2 tanks are for the purpose of checking if a tank is within
//range to shoot
const CheckRangeBetweenTanks = (tankA, tankB) => Math.max(Math.abs(tankA.Position.xCoordinate - tankB.Position.xCoordinate), Math.abs(tankA.Position.yCoordinate - tankB.Position.yCoordinate));
//players to test the board drawing functions
let player1 = {
    Position: {
        xCoordinate: 5,
        yCoordinate: 2
    },
    Points: 0
};
players.push(player1);
let player2 = {
    Position: {
        xCoordinate: 5,
        yCoordinate: 4
    },
    Points: 0
};
players.push(player2);
let player3 = {
    Position: {
        xCoordinate: 8,
        yCoordinate: 3
    },
    Points: 0
};
players.push(player3);
//Section for drawing to the canvas
//Objects for the canvas
const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');
//function to draw the board onto the canvas
const drawBoard = () => {
    //dras a black background to be the lines between the spaces
    //sets the color to black
    context.fillStyle = "black";
    //draws the background
    context.fillRect(0, 0, canvas.width, canvas.height);
    //draws the various board squares
    for (let i = 0; i < canvas.width / 50; i++) {
        for (let j = 0; j < canvas.height / 50; j++) {
            context.clearRect(i * boardSquareSize + 1, j * boardSquareSize + 1, boardSquareSize - 2, boardSquareSize - 2);
        }
    }
    //draws all of the players in the game
    //sets the color of the players
    context.fillStyle = "black";
    //loops through the list of players and draws them at their position
    players.forEach((p) => context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2), ((p.Position.yCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2), playerSize, playerSize));
    console.log("Board Drawn");
};
drawBoard();
console.log(CheckRangeBetweenTanks(player1, player3));
//# sourceMappingURL=gameLogic.js.map