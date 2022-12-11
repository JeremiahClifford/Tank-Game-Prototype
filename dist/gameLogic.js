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
//Section for drawing to the canvas
//Objects for the canvas
const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');
//function to detect which space the player licks on
const GetMouseGridPosition = (canvas, event) => {
    let canvasBounds = canvas.getBoundingClientRect();
    return {
        xCoordinate: Math.ceil((event.clientX - canvasBounds.left) / boardSquareSize),
        yCoordinate: Math.ceil((event.clientY - canvasBounds.top) / boardSquareSize)
    };
};
//function to select a grid square
const SelectGridSquare = (gridPosition) => {
    //TODO: Detect if a player is in that position and open the appropriate
    //context menu based on if it is their tank or another player's
    //handles the context menu text which tells the player which grid square they have selected
    const currentlySelectedDefaultString = "Currently Selected Grid Space: ";
    const currentlySelectedMessage = document.getElementById('currently-selected-message');
    //sets the context menu message to tell the player which grid square they have selected
    currentlySelectedMessage.innerHTML = currentlySelectedDefaultString + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate;
    console.log("Grid Square (" + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate + ") Selected");
    //handles the context menu text which tells the player which player if any is in the selected square
    const currentlyOccupyingDefaultText = "This space is occupied by: ";
    const currentlyOccupyingEmptyText = "This square in not occupied";
    const currentlyOccupyingMessage = document.getElementById('currently-occupied-message');
    //sets the message
    currentlyOccupyingMessage.innerHTML = currentlyOccupyingEmptyText;
    players.forEach((p) => {
        if (p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate == gridPosition.yCoordinate) {
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + p.PlayerName;
        }
    });
};
//adds an event listener to test the functionaily by outputing the position to the console
canvas.addEventListener("mousedown", function (e) {
    const gridPosition = GetMouseGridPosition(canvas, e);
    SelectGridSquare(gridPosition);
});
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
//variables for handling the importing of the player list
let playerListImport;
//get the list of players from the server and draws the board when the site loads
fetch("http://localhost:3000/players", { method: "GET" })
    .then(res => res.json())
    //.then((players) => playerListImport = JSON.parse(players))
    .then((players) => playerListImport = players)
    .then(() => console.log(playerListImport))
    .then(() => {
    let i = 1;
    while (playerListImport[i] != undefined) {
        players.push(playerListImport[i]);
        i++;
    }
    console.log(players);
})
    .then(drawBoard)
    .catch(() => console.log("Error loading data from server"));
//# sourceMappingURL=gameLogic.js.map