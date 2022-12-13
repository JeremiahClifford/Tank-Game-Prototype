import { CoordinatePoint } from "./CoordinatePoint";
import { Tank } from "./tank"

//section for handling the players
//defines the size of a player on the screen to be used when calculating player position and board grid size
const playerSize: number = 40
//defines the size of the drawn board squares
const boardSquareSize: number = 50
//holds a list of the players
let players: Tank[] = [];
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
    //TODO: Detect if a player is in that position and open the appropriate
    //context menu based on if it is their tank or another player's

    //handles the context menu text which tells the player which grid square they have selected
    const currentlySelectedDefaultString: string = "Currently Selected Grid Space: "
    const currentlySelectedMessage: HTMLElement = document.getElementById('currently-selected-message') as HTMLElement

    //sets the context menu message to tell the player which grid square they have selected
    currentlySelectedMessage.innerHTML = currentlySelectedDefaultString + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate

    console.log("Grid Square (" + gridPosition.xCoordinate + ", " + gridPosition.yCoordinate + ") Selected");

    //handles the context menu text which tells the player which player if any is in the selected square
    const currentlyOccupyingDefaultText: string = "This space is occupied by: "
    const currentlyOccupyingEmptyText: string = "This square in not occupied"
    const currentlyOccupyingMessage: HTMLElement = document.getElementById('currently-occupied-message') as HTMLElement
    //sets the message
    currentlyOccupyingMessage.innerHTML = currentlyOccupyingEmptyText
    players.forEach((p): void => {
        if (p.Position.xCoordinate === gridPosition.xCoordinate && p.Position.yCoordinate == gridPosition.yCoordinate) {
            currentlyOccupyingMessage.innerHTML = currentlyOccupyingDefaultText + p.PlayerName
        }
    })
}
//adds an event listener to test the functionaily by outputing the position to the console
canvas.addEventListener("mousedown", function(e) {
    const gridPosition: CoordinatePoint = GetMouseGridPosition(canvas, e)
    SelectGridSquare(gridPosition)
})

//function to draw the board onto the canvas
const drawBoard = (): void => {

    //dras a black background to be the lines between the spaces
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

    //draws all of the players in the game
    //loops through the list of players and draws them at their position
    players.forEach((p) => {
        //sets the color of the players
        context.fillStyle = "black"
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
    })
}

//variables for handling the importing of the player list
let playerListImport: any
//get the list of players from the server and draws the board when the site loads
fetch("http://localhost:3000/players", {method: "GET"})
   .then(res => res.json())
   //.then((players) => playerListImport = JSON.parse(players))
   .then((players) => playerListImport = players)
   .then(() => {
        let i = 1
        while (playerListImport[i] != undefined) {
            players.push(playerListImport[i] as Tank)
            i++
        }
   })
   .then(drawBoard)
   .catch(() => console.log("Error loading data from server"))