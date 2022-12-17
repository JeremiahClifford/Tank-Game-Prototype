import { CoordinatePoint } from "./CoordinatePoint";
import { Tank } from "./tank"

//gets the local storage to store login information
const playerStorage: Storage = window.sessionStorage

//target server
const server: string = "http://localhost:"
//target port
const port: string = playerStorage.getItem("Port") as string

//section for handling the players
//defines the size of a player on the screen to be used when calculating player position and board grid size
const playerSize: number = 40
//defines the size of the drawn board squares
const boardSquareSize: number = 50
//defines the size of the indicator marks
const indicatorMarkSize: number = 30
//holds a list of the players
let players: Tank[] = [];
//variables to hold the status of the client
//bool to hold the status of if the player is currently trying to move
let moving: boolean = false;
//list of spaces that the player can move to
let movableSpaces: CoordinatePoint[] = []

//how far apart 2 tanks are for the purpose of checking if a tank is within
//range to shoot
const CheckRangeBetweenTanks = (tankA: Tank, tankB: Tank): number => Math.max(Math.abs(tankA.Position.xCoordinate - tankB.Position.xCoordinate), Math.abs(tankA.Position.yCoordinate - tankB.Position.yCoordinate))

//Section for drawing to the canvas
//Objects for the canvas
const canvas: HTMLCanvasElement = document.getElementById('viewport') as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

//function to detect which space the player licks on
const GetMouseGridPosition = (canvas: HTMLCanvasElement, event: any): CoordinatePoint => {
    let canvasBounds = canvas.getBoundingClientRect();

    return {
        xCoordinate: Math.ceil((event.clientX - canvasBounds.left) / boardSquareSize),
        yCoordinate: Math.ceil((event.clientY - canvasBounds.top) / boardSquareSize)
    }
}
//function to select a grid square
const SelectGridSquare = (gridPosition: CoordinatePoint): void => {

    //resets the button zone so that buttons dont stack up
    const buttonZone: HTMLElement = document.getElementById("button-zone") as HTMLElement
    buttonZone.innerHTML = ``

    //handles if the player is clicking on a space to try to move to it
    if (moving) {
        //checks if the player can move to the selected coordinate by filtering the list of movableSpaces to any that match the selected space
        if (movableSpaces.filter((c) => c.xCoordinate == gridPosition.xCoordinate && c.yCoordinate == gridPosition.yCoordinate).length == 1) {
            //TODO: send a movement order to the server to move the player
            
            console.log("Can move there \nMoving not yet implemented")
        } else {
            console.log("Can't move there \nMoving not yet implemented")
        }
        
        moving = false
    }

    //handles the context menu text which tells the player which grid square they have selected
    const currentlySelectedDefaultString: string = "Currently Selected Grid Space: "
    const currentlySelectedMessage: HTMLElement = document.getElementById('currently-selected-message') as HTMLElement

    //sets the context menu message to tell the player which grid square they have selected
    currentlySelectedMessage.innerHTML = currentlySelectedDefaultString + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate

    //handles the context menu text which tells the player which player if any is in the selected square
    const currentlyOccupyingDefaultText: string = "This space is occupied by: "
    const currentlyOccupyingEmptyText: string = "This square in not occupied"
    const currentlyOccupyingMessage: HTMLElement = document.getElementById('currently-occupied-message') as HTMLElement
    //sets the message
    currentlyOccupyingMessage.innerHTML = currentlyOccupyingEmptyText

    //resets the button zone so there are not duplicated or stacked up buttons
    buttonZone.innerHTML = ``
    //checks for players in the selected spaces by filtering the list of players
    let filteredPlayers = players.filter((p) => p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate === gridPosition.yCoordinate)
    if (filteredPlayers.length === 1) {
        //if the name of the player in the space matches the logged in player
        if (filteredPlayers[0].PlayerName == playerStorage.getItem("Username")) {
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + "you"
            buttonZone.innerHTML += `<button id="move-button" onclick="initiateMove()">Move</button>`
        } else { //if it is not the logged in player it must be a different player
            //fill in the context menu
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + filteredPlayers[0].PlayerName
            buttonZone.innerHTML += `<button id="send-point-button" onclick="SendActionPoint()">Send Action Point</button>`
        }
    }
    //console log for debugging which shows the selected space and who is in it
    console.log("Grid Square (" + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate + ") Selected \nCurrently occupied by " + (filteredPlayers.length === 1 ? filteredPlayers[0].PlayerName : "no one"))

    drawBoard()
}

//adds an event listener to test the functionaily by outputing the position to the console
canvas.addEventListener("mousedown", function(e) {
    SelectGridSquare(GetMouseGridPosition(canvas, e))
})

//function to bring up the indicators to allow the player to move
const initiateMove = (): void => {
    moving = true
    movableSpaces = []
    const currentPlayer: Tank = players.filter((p) => p.PlayerName === playerStorage.getItem("Username"))[0]
    //does 2 nested for loops to move around the player in all directions to show which spaces the player can move to
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const currentSpace: CoordinatePoint = {
                xCoordinate: currentPlayer.Position.xCoordinate + i,
                yCoordinate: currentPlayer.Position.yCoordinate + j
            }
            //makes sure that the space being worked on is a valid space
            if ((currentSpace.xCoordinate > 0 && currentSpace.yCoordinate > 0) && (currentSpace.xCoordinate <= 38 && currentSpace.yCoordinate <= 18) && !(currentSpace.xCoordinate === currentPlayer.Position.xCoordinate && currentSpace.yCoordinate === currentPlayer.Position.yCoordinate)) {
                //checks if the current space is empty by filtering the list of players down to only the players whose position matches the position of the current space
                if (players.filter((p) => p.Position.xCoordinate === currentSpace.xCoordinate && p.Position.yCoordinate === currentSpace.yCoordinate).length === 0) {
                    //adds each space to the list of spaces that the player can move to
                    movableSpaces.push({
                        xCoordinate: currentSpace.xCoordinate,
                        yCoordinate: currentSpace.yCoordinate
                    })
                    //draws a marker in each of the squares that the player can move to
                    context.fillStyle = "orange"
                    context.fillRect(((currentSpace.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize - indicatorMarkSize) / 2), ((currentSpace.yCoordinate - 1) * boardSquareSize) + ((boardSquareSize - indicatorMarkSize) / 2), indicatorMarkSize, indicatorMarkSize)
                }
            }
        }
    }
}

const SendActionPoint =  (): void => {
    //TODO: make it send an action point to the selected player 
    console.log("Function not yet implemented")
}

//function to draw the board onto the canvas
const drawBoard = (): void => {

    //draws a black background to be the lines between the spaces
    //sets the color to black
    context.fillStyle = "black"
    //draws the background
    context.fillRect(0, 0, canvas.width, canvas.height)
    //draws the grid of board squares
    for (let i = 0; i < canvas.width / 50; i++) {
        for (let j = 0; j < canvas.height / 50; j++) {
            context.clearRect(i*boardSquareSize+1, j*boardSquareSize+1, boardSquareSize-2, boardSquareSize-2)
        }
    }

    //variables for handling the importing of the player list
    let playerListImport: any = []
    //resets the list of players to be empty
    players = []
    //get the list of players from the server and draws the board when the site loads
    fetch(server + port + "/players", {method: "GET"})
       .then(res => res.json())
       //.then((players) => playerListImport = JSON.parse(players))
       .then((playersImport) => playerListImport = playersImport)
       .then(() => {
            let i = 1
            while (playerListImport[i] != undefined) {
                players.push(playerListImport[i] as Tank)
                i++
            }
       })
       .then(() => {
            //draws all of the players in the game
            //loops through the list of players and draws them at their position
            players.forEach((p) => {
                //sets the color of the players
                context.fillStyle = "black"
                //if it is drawing the player, set it to blue
                if (p.PlayerName === playerStorage.getItem("Username")) {
                    context.fillStyle = "blue"
                }
                context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize-playerSize) / 2), ((p.Position.yCoordinate-1) * boardSquareSize) + ((boardSquareSize-playerSize) / 2),  playerSize, playerSize)
                //draws a pip for each health point the player has
                //sets the color of the pips
                context.fillStyle = "Red"
                //draws the pip for 1 health
                if (p.Health >= 1) {
                    context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize-playerSize) / 2), ((p.Position.yCoordinate-1) * boardSquareSize) + (playerSize - 10), 10, 10)
                }
                //draws the pip for 2 health
                if (p.Health >= 2) {
                    context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize-playerSize) / 2) + ((playerSize / 2) - 5), ((p.Position.yCoordinate-1) * boardSquareSize) + (playerSize - 10), 10, 10)
                }
                //draws the pip for 3 health
                if (p.Health >= 3) {
                    context.fillRect(((p.Position.xCoordinate - 1) * boardSquareSize) + ((boardSquareSize-playerSize) / 2) + (playerSize - 10), ((p.Position.yCoordinate-1) * boardSquareSize) + (playerSize - 10), 10, 10)
                }
            
                //fills in  the player info for the player
                const availablePointsDefaultText: string = "Available Action Points: "
                if (p.PlayerName == playerStorage.getItem("Username")) {
                    const availablePointsDisplay: HTMLElement = document.getElementById("points") as HTMLElement
                    availablePointsDisplay.innerHTML = availablePointsDefaultText + p.Points
                }
            })
       })
       .catch(() => console.log("Error loading data from server"))
}

drawBoard()