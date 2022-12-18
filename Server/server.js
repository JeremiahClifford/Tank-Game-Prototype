//express server setup
const express = require("express")
const bodyParser = require('body-parser')
const app = express()

const fs = require("fs")

//data from the json files
let settings = require('./data/settings.json')
let playerList = require('./data/players.json')
let responseFile = require('./data/responseFile.json')

//array for of the list of players
let playerListArray = []
let i = 1
while (playerList[i] != undefined) {
    playerListArray.push(playerList[i])
    i++
}

//settings to make data parsing and connecting work
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

//default page
app.get("/", (request, response) => {
    response.send("Server Page")
})

//responses for requests for data from the client
app.get("/settings", (request, response) => {
    response.json(settings)
})

//login function
//user submits data, server valifdates, and sends back if they are valid or not
app.post("/login", bodyParser.json(), (request, response) => {
    const loginSubmitted = request.body

    responseFile.responseValue = (
        (playerListArray.filter((p) => p.PlayerName === loginSubmitted.username))
            .length === 1
         && (loginSubmitted.gameKey == settings.GameKey) 
         && (loginSubmitted.password === (playerListArray.filter((p) => p.PlayerName === loginSubmitted.username)[0].Password))
    )
    response.json(responseFile)
})

//move function
//client submits move action, server validates if allowed, executes move
//client should refresh and reaquire the data from the server and thus nothing should need to be sent back
app.post("/move", bodyParser.json(), (request, response) => {
    //ingests the data
    const moveSubmitted = request.body

    //gets the player that is trying to make the move
    const movingPlayer = playerListArray.filter((p) => p.PlayerName === moveSubmitted.username)[0]

    //checks that the move is allowed, if so execute the move in the data
    if (
        movingPlayer.Points > 0 &&
        moveSubmitted.destination.xCoordinate > 0 &&
        moveSubmitted.destination.xCoordinate < 38 &&
        moveSubmitted.destination.yCoordinate > 0 &&
        moveSubmitted.destination.yCoordinate < 18 &&
        Math.abs(moveSubmitted.destination.xCoordinate - movingPlayer.Position.xCoordinate) <= 1 &&
        Math.abs(moveSubmitted.destination.yCoordinate - movingPlayer.Position.yCoordinate) <= 1 &&
        playerListArray.filter((p) => p.Position.xCoordinate === moveSubmitted.destination.xCoordinate && p.Position.yCoordinate === moveSubmitted.destination.yCoordinate).length === 0
    ) {
        playerListArray.forEach((p) => {
            if (p.PlayerName === movingPlayer.PlayerName) {
                //puts the player in the destination space
                p.Position = {
                    xCoordinate: moveSubmitted.destination.xCoordinate,
                    yCoordinate: moveSubmitted.destination.yCoordinate
                }
                //takes an action point from the player
                p.Points -= 1
            }
        })
        //TODO: make the data write to the json file
        //fs.writeFile("data/test.json", JSON.stringify(playerList))

        responseFile.responseValue = true
    } else {
        responseFile.responseValue = false
    }

    //sends a response to the client
    response.json(responseFile)
})

//sends the list of players to the client
app.get("/players", (request, response) => {
    response.json(playerList)
})

//game manager page to manage the game settings
//html setup
const ManagerHTML = () => {
    let managerHTML = `
        <!DOCTYPE html>
        <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Game Manager</title>
            </head>
            <body>
                <h2>Game Manager</h2>
                <h3>Port: ${settings.Port}</h3>
                <h3>Game Key: ${settings.GameKey}</h3>
            </body>
        </html>
    `
    return managerHTML
}
//page setup
app.get("/manager", (request, response) => {
    response.send(ManagerHTML())
})

//opens the server on the specified port
app.listen(settings.Port, () => {
    console.log("Listen on the port " + settings.Port + "...")
})