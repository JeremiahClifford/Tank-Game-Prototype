"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//gets the local storage to store login information
const playerStorage = window.sessionStorage;
//target server
const server = "http://localhost:";
//target port
const port = playerStorage.getItem("Port");
//section for handling the players
//defines the size of a player on the screen to be used when calculating player position and board grid size
const playerSize = 40;
//defines the size of the drawn board squares
const boardSquareSize = 50;
//defines the size of the indicator marks
const indicatorMarkSize = 30;
//holds a list of the players
let players = [];
//variables to hold the status of the client
//bool to hold the status of if the player is currently trying to move
let moving = false;
//list of spaces that the player can move to
let movableSpaces = [];
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
    //resets the button zone so that buttons dont stack up
    const buttonZone = document.getElementById("button-zone");
    buttonZone.innerHTML = ``;
    //handles if the player is clicking on a space to try to move to it
    if (moving) {
        //checks if the player can move to the selected coordinate by filtering the list of movableSpaces to any that match the selected space
        if (movableSpaces.filter((c) => c.xCoordinate == gridPosition.xCoordinate && c.yCoordinate == gridPosition.yCoordinate).length == 1) {
            //TODO: send a movement order to the server to move the player
            fetch(server + port + "/move", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": playerStorage.getItem("Username"),
                    "destination": gridPosition
                })
            })
                .then((response) => response.json())
                .then((responseFile) => console.log(responseFile.responseValue))
                .then(() => drawBoard())
                .catch(() => console.log("Server not responding"));
            console.log("Can move there \nMoving not yet implemented");
        }
        else {
            console.log("Can't move there \nMoving not yet implemented");
        }
        moving = false;
    }
    //handles the context menu text which tells the player which grid square they have selected
    const currentlySelectedDefaultString = "Currently Selected Grid Space: ";
    const currentlySelectedMessage = document.getElementById('currently-selected-message');
    //sets the context menu message to tell the player which grid square they have selected
    currentlySelectedMessage.innerHTML = currentlySelectedDefaultString + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate;
    //handles the context menu text which tells the player which player if any is in the selected square
    const currentlyOccupyingDefaultText = "This space is occupied by: ";
    const currentlyOccupyingEmptyText = "This square in not occupied";
    const currentlyOccupyingMessage = document.getElementById('currently-occupied-message');
    //sets the message
    currentlyOccupyingMessage.innerHTML = currentlyOccupyingEmptyText;
    //resets the button zone so there are not duplicated or stacked up buttons
    buttonZone.innerHTML = ``;
    //checks for players in the selected spaces by filtering the list of players
    let filteredPlayers = players.filter((p) => p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate === gridPosition.yCoordinate);
    if (filteredPlayers.length === 1) {
        //if the name of the player in the space matches the logged in player
        if (filteredPlayers[0].PlayerName == playerStorage.getItem("Username")) {
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + "you";
            //gives the player the move button if they have enough action points
            if (filteredPlayers[0].Points > 0) {
                buttonZone.innerHTML += `<button id="move-button" onclick="initiateMove()">Move</button>`;
            }
        }
        else { //if it is not the logged in player it must be a different player
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + filteredPlayers[0].PlayerName;
            //gives the player the move button if they have enough action points
            if (players.filter((p) => p.PlayerName === playerStorage.getItem("Username"))[0].Points > 0) {
                buttonZone.innerHTML += `<button id="send-point-button" onclick="SendActionPoint(${filteredPlayers[0].PlayerName})">Send Action Point</button>`;
            }
        }
    }
    //console log for debugging which shows the selected space and who is in it
    console.log("Grid Square (" + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate + ") Selected \nCurrently occupied by " + (filteredPlayers.length === 1 ? filteredPlayers[0].PlayerName : "no one"));
    drawBoard();
};
//adds an event listener to test the functionaily by outputing the position to the console
canvas.addEventListener("mousedown", function (e) {
    SelectGridSquare(GetMouseGridPosition(canvas, e));
});
//function to bring up the indicators to allow the player to move
const initiateMove = () => {
    moving = true;
    movableSpaces = [];
    const currentPlayer = players.filter((p) => p.PlayerName === playerStorage.getItem("Username"))[0];
    //does 2 nested for loops to move around the player in all directions to show which spaces the player can move to
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const currentSpace = {
                xCoordinate: currentPlayer.Position.xCoordinate + i,
                yCoordinate: currentPlayer.Position.yCoordinate + j
            };
            //makes sure that the space being worked on is a valid space
            if ((currentSpace.xCoordinate > 0 && currentSpace.yCoordinate > 0) && (currentSpace.xCoordinate <= 38 && currentSpace.yCoordinate <= 18) && !(currentSpace.xCoordinate === currentPlayer.Position.xCoordinate && currentSpace.yCoordinate === currentPlayer.Position.yCoordinate)) {
                //checks if the current space is empty by filtering the list of players down to only the players whose position matches the position of the current space
                if (players.filter((p) => p.Position.xCoordinate === currentSpace.xCoordinate && p.Position.yCoordinate === currentSpace.yCoordinate).length === 0) {
                    //adds each space to the list of spaces that the player can move to
                    movableSpaces.push({
                        xCoordinate: currentSpace.xCoordinate,
                        yCoordinate: currentSpace.yCoordinate
                    });
                    //draws a marker in each of the squares that the player can move to
                    context.fillStyle = "orange";
                    context.fillRect(((currentSpace.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - indicatorMarkSize) / 2), ((currentSpace.yCoordinate - 1) * boardSquareSize) + ((boardSquareSize - indicatorMarkSize) / 2), indicatorMarkSize, indicatorMarkSize);
                }
            }
        }
    }
};
const SendActionPoint = (reciever) => {
    //TODO: make it send an action point to the selected player
    console.log(`Sending 1 action point to ${reciever}`);
    console.log(`Function not yet implemented`);
};
//function to draw the board onto the canvas
const drawBoard = () => {
    //draws a black background to be the lines between the spaces
    //sets the color to black
    context.fillStyle = "black";
    //draws the background
    context.fillRect(0, 0, canvas.width, canvas.height);
    //draws the grid of board squares
    for (let i = 0; i < canvas.width / 50; i++) {
        for (let j = 0; j < canvas.height / 50; j++) {
            context.clearRect(i * boardSquareSize + 1, j * boardSquareSize + 1, boardSquareSize - 2, boardSquareSize - 2);
        }
    }
    //variables for handling the importing of the player list
    let playerListImport = [];
    //resets the list of players to be empty
    players = [];
    //get the list of players from the server and draws the board when the site loads
    fetch(server + port + "/players", { method: "GET" })
        .then(res => res.json())
        //.then((players) => playerListImport = JSON.parse(players))
        .then((playersImport) => playerListImport = playersImport)
        .then(() => {
        let i = 1;
        while (playerListImport[i] != undefined) {
            players.push(playerListImport[i]);
            i++;
        }
    })
        .then(() => {
        //draws all of the players in the game
        //loops through the list of players and draws them at their position
        players.forEach((p) => {
            //sets the color of the players
            context.fillStyle = "black";
            //if it is drawing the player, set it to blue
            if (p.PlayerName === playerStorage.getItem("Username")) {
                context.fillStyle = "blue";
            }
            context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2), ((p.Position.yCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2), playerSize, playerSize);
            //draws a pip for each health point the player has
            //sets the color of the pips
            context.fillStyle = "Red";
            //draws the pip for 1 health
            if (p.Health >= 1) {
                context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2), ((p.Position.yCoordinate - 1) * boardSquareSize) + (playerSize - 10), 10, 10);
            }
            //draws the pip for 2 health
            if (p.Health >= 2) {
                context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2) + ((playerSize / 2) - 5), ((p.Position.yCoordinate - 1) * boardSquareSize) + (playerSize - 10), 10, 10);
            }
            //draws the pip for 3 health
            if (p.Health >= 3) {
                context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - playerSize) / 2) + (playerSize - 10), ((p.Position.yCoordinate - 1) * boardSquareSize) + (playerSize - 10), 10, 10);
            }
            //fills in  the player info for the player
            const availablePointsDefaultText = "Available Action Points: ";
            if (p.PlayerName == playerStorage.getItem("Username")) {
                const availablePointsDisplay = document.getElementById("points");
                availablePointsDisplay.innerHTML = availablePointsDefaultText + p.Points;
            }
        });
    })
        .catch(() => console.log("Error loading data from server"));
};
drawBoard();
//# sourceMappingURL=gameLogic.js.map