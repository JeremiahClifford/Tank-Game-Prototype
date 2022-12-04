const canvas: HTMLCanvasElement = document.getElementById('viewport') as HTMLCanvasElement

const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D

const drawBoard = (): void => {

    //draws a black test square
    context.fillStyle = "black"
    context.fillRect(120, 180, 100, 100)

    console.log("Board Drawn")
}

drawBoard()