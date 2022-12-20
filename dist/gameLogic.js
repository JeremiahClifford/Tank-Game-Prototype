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
//defines the max number of spaces on the x and y directions
const xMax = 36;
const yMax = 16;
//holds a list of the players
let players = [];
//variables to hold the status of the client
//bool to hold the status of if the player is currently trying to move
let moving = false;
//list of spaces that the player can move to
let movableSpaces = [];
//bool to hold the status of if the player is currently trying to shoot
let shooting = false;
//list of other players that the player can shoot
let shootablePlayers = [];
//how far apart 2 tanks are for the purpose of checking if a tank is within
//range to shoot
const CheckRangeBetweenTanks = (tankA, tankB) => Math.max(Math.abs(tankA.Position.xCoordinate - tankB.Position.xCoordinate), Math.abs(tankA.Position.yCoordinate - tankB.Position.yCoordinate));
//Section for drawing to the canvas
//Objects for the canvas
const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');
//grabs the context menu from the document
const contextMenu = document.getElementById("context-menu");
//function to get the position of the mouse on the whole page
const GetAbsoluteMousePosition = (body, event) => {
    let bodyBounds = body.getBoundingClientRect();
    return [event.clientX, event.clientY];
};
//function to detect which space the player licks on
const GetMouseGridPosition = (canvas, event) => {
    let canvasBounds = canvas.getBoundingClientRect();
    return {
        xCoordinate: Math.ceil((event.clientX - canvasBounds.left) / boardSquareSize),
        yCoordinate: Math.ceil((event.clientY - canvasBounds.top) / boardSquareSize)
    };
};
//function to select a grid square
const SelectGridSquare = (gridPosition, event) => {
    //handles if the player is clicking on a space to try to move to it
    if (moving) {
        //checks if the player can move to the selected coordinate by filtering the list of movableSpaces to any that match the selected space
        if (movableSpaces.filter((c) => c.xCoordinate == gridPosition.xCoordinate && c.yCoordinate == gridPosition.yCoordinate).length == 1) {
            //sends the move request to the server
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
                .then(() => HideContextMenu())
                .then(() => drawBoard())
                .catch(() => console.log("Server not responding"));
        }
        moving = false;
    }
    //handles if the player is clicking on a space to try to shoot the person on it
    if (shooting) {
        //TODO: make shooting work
        const filteredTargets = shootablePlayers.filter((p) => p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate === gridPosition.yCoordinate);
        //checks if the selected space has a valid target in it
        if (filteredTargets.length === 1) {
            //sends the move request to the server
            fetch(server + port + "/shoot", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": playerStorage.getItem("Username"),
                    "target": filteredTargets[0].PlayerName
                })
            })
                .then((response) => response.json())
                .then((responseFile) => console.log(responseFile.responseValue))
                .then(() => HideContextMenu())
                .then(() => drawBoard())
                .catch(() => console.log("Server not responding"));
        }
        shooting = false;
    }
    //handles the context menu text which tells the player which grid square they have selected
    contextMenu.innerHTML = `
        <h2 id="currently-selected-message">(0, 0)</h2>
    `;
    const currentlySelectedMessage = document.getElementById('currently-selected-message');
    //sets the context menu message to tell the player which grid square they have selected
    currentlySelectedMessage.innerHTML = `(${gridPosition.xCoordinate}, ${gridPosition.yCoordinate})`;
    //checks for players in the selected spaces by filtering the list of players
    let filteredPlayers = players.filter((p) => p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate === gridPosition.yCoordinate);
    if (filteredPlayers.length === 1) {
        //handles the context menu text which tells the player which player if any is in the selected square
        contextMenu.innerHTML += `<h2 id="currently-occupied-message">No one</h2>`;
        const currentlyOccupyingMessage = document.getElementById('currently-occupied-message');
        //sets the message
        currentlyOccupyingMessage.innerHTML = `${filteredPlayers[0].PlayerName}`;
        //if the name of the player in the space matches the logged in player
        if (filteredPlayers[0].PlayerName === playerStorage.getItem("Username")) {
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = `${filteredPlayers[0].PlayerName} (You)`;
            //gives the player the move button if they have enough action points
            if (filteredPlayers[0].Points > 0) {
                //adds the button zone
                contextMenu.innerHTML += `
                    <div id="button-zone">

                    </div>
                `;
                const buttonZone = document.getElementById("button-zone");
                buttonZone.innerHTML += `<button id="move-button" onclick="initiateMove()">Move</button>`;
                if (filteredPlayers[0].Points >= 0) {
                    buttonZone.innerHTML += `<button id="shoot-button" onclick="initiateShoot()">Shoot</button>`;
                }
            }
        }
        else { //if it is not the logged in player it must be a different player
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = `${filteredPlayers[0].PlayerName}`;
            //gives the player the move button if they have enough action points
            if (players.filter((p) => p.PlayerName === playerStorage.getItem("Username"))[0].Points > 0) {
                //adds the button zone
                contextMenu.innerHTML += `
                    <div id="button-zone">

                    </div>
                `;
                const buttonZone = document.getElementById("button-zone");
                buttonZone.innerHTML += `<button id="send-point-button" onclick="SendActionPoint('${filteredPlayers[0].PlayerName}')">Send Action Point</button>`;
            }
        }
    }
    //console log for debugging which shows the selected space and who is in it
    console.log("Grid Square (" + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate + ") Selected \nCurrently occupied by " + (filteredPlayers.length === 1 ? filteredPlayers[0].PlayerName : "no one"));
    ShowContextMenu(event);
    drawBoard();
};
//function to open the context menu
const ShowContextMenu = (event) => {
    let mousePos = GetAbsoluteMousePosition(document.body, event);
    contextMenu.style.position = 'absolute';
    contextMenu.style.top = `${mousePos[1]}px`;
    contextMenu.style.left = `${mousePos[0]}px`;
    contextMenu.style.border = `2px solid black`;
    contextMenu.style.backgroundColor = `white`;
    contextMenu.style.padding = `5px`;
};
//function to hide the context menu
const HideContextMenu = () => {
    contextMenu.innerHTML = ``;
    contextMenu.style.border = `0px`;
    contextMenu.style.padding = `0px`;
};
//adds an event listener to select the grid square
canvas.addEventListener("mousedown", (e) => e.button === 0 ? SelectGridSquare(GetMouseGridPosition(canvas, e), e) : HideContextMenu());
//lets the player also right click on the context menu to close it
document.body.addEventListener("mousedown", (e) => e.button === 0 ? null : HideContextMenu());
//function to bring up the indicators to allow the player to move
const initiateMove = () => {
    HideContextMenu();
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
            if ((currentSpace.xCoordinate > 0 && currentSpace.yCoordinate > 0) && (currentSpace.xCoordinate <= xMax && currentSpace.yCoordinate <= yMax) && !(currentSpace.xCoordinate === currentPlayer.Position.xCoordinate && currentSpace.yCoordinate === currentPlayer.Position.yCoordinate)) {
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
//function to send an action point to another player
const SendActionPoint = (reciever) => {
    //TODO: make it send an action point to the selected player
    fetch(server + port + "/send", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "sender": playerStorage.getItem("Username"),
            "reciever": reciever
        })
    })
        .then((response) => response.json())
        .then((responseFile) => console.log(responseFile.responseValue))
        .then(() => drawBoard())
        .catch(() => console.log("Server not responding"));
    console.log(`Sending 1 action point to ${reciever}`);
};
//function to bring up indicators to allow the player to shoot
const initiateShoot = () => {
    HideContextMenu();
    shooting = true;
    shootablePlayers = [];
    const currentPlayer = players.filter((p) => p.PlayerName === playerStorage.getItem("Username"))[0];
    players.forEach((p) => {
        if (CheckRangeBetweenTanks(currentPlayer, p) <= 2 && p.PlayerName !== playerStorage.getItem("Username")) {
            //draws a targeting indicator around the target
            context.strokeStyle = "red";
            context.lineWidth = 5;
            context.strokeRect((p.Position.xCoordinate - 1) * boardSquareSize, (p.Position.yCoordinate - 1) * boardSquareSize, boardSquareSize, boardSquareSize);
            context.lineWidth = 1;
            //adds the player to the list of shootable players
            shootablePlayers.push(p);
        }
    });
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