import { Tank } from "./tank"

//Section for drawing to the canvas
//Objects for the canvas
const canvas: HTMLCanvasElement = document.getElementById('viewport') as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

//function to draw the board onto the canvas
const drawBoard = (): void => {

    //draws a black test square
    context.fillStyle = "black"
    context.fillRect(120, 180, 100, 100)

    console.log("Board Drawn")
}

//section for handling the players
//holds a list of the players
let player: Tank[] = [];
//how far apart 2 tanks are for the purpose of checking if a tank is within
//range to shoot
const CheckRangeBetweenTanks = (tankA: Tank, tankB: Tank): number => Math.max(Math.abs(tankA.Position[0] - tankB.Position[0]), Math.abs(tankA.Position[1] - tankB.Position[1]))

drawBoard()