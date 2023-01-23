//express server setup
const express = require("express")
const bodyParser = require('body-parser')
const app = express()

const fs = require('fs')

//data from the json files
let settings = require('./data/settings.json')
let playerList = require('./data/players.json')
let responseFile = require('./data/responseFile.json')

//array for of the list of players
//this makes it a list of references so by changing data on one of them changes the data on both
//this just makes it easier to work with and send
let playerListArray = []
let i = 1
while (playerList[i] != undefined) {
    playerListArray.push(playerList[i])
    i++
}

//magic numbers
//max spaces on the x and y of the board
const xMax = 37
const yMax = 37
//conversion ratio of milliseconds to units in the settings file
//current conversion is to hours
const intervalConversion = 3600000

//helper functions
const CheckRangeBetweenTanks = (tankA, tankB) => Math.max(Math.abs(tankA.Position.xCoordinate - tankB.Position.xCoordinate), Math.abs(tankA.Position.yCoordinate - tankB.Position.yCoordinate))
const GiveActionPoints = () => {
    //gives 1 action point to each player
    playerListArray.forEach((p) => {
        p.Points++
    })

    //vote counting
    //creates a list to count the votes for each player
    let votesFor = []
    //adds an index in the votes for array for each player
    playerListArray.forEach((p) => votesFor.push(0))
    //counts the votes from each player
    playerListArray.forEach((p) => {
        //if the player is dead, count their vote
        if (p.Health === 0) {
            //checks which player they voted for and adds a count to them
            for (let i = 0; i < playerListArray.length; i++) {
                //checks which player they voted for and gives them 1 vote
                if (playerListArray[i].PlayerName === p.Vote) {
                    votesFor[i]++
                }
            }
        }
    })
    //counts up the votes and awars the extra action point
    let highestIndex = 0
    for (let i = 0; i < votesFor.length; i++) {
        votesFor[i] > votesFor[highestIndex] ? highestIndex = i : null
    }
    //gives the voted for player the award
    //makes sure there is at least 1 vote
    if (votesFor[highestIndex] > 0) {
        //gives the voted for player their extra point
        playerListArray[highestIndex].Points++
    }

    //winner checking
    checkWinner()

    //saves the changes to the local files if enabled in the settings
    if (settings.SaveOnAction) {
        const data = JSON.stringify(playerList)
        fs.writeFile("./Server/data/players.json", data, (err) => {
            if (err) throw err
        })
    }
}
const checkWinner = () => {
    //checks if there is only 1 player left alive
    let alivePlayers = 0
    //checks every player to see if they are alive and counts them
    playerListArray.forEach((p) => p.Health > 0 ? alivePlayers++ : null)
    //ends the game
    if (alivePlayers === 1) {
        //TODO: end the game if only 1 player remains
        let winner = ""
        playerListArray.forEach((p) => p.Health > 0 ? winner = p.PlayerName : null)
        console.log(`Game Over! ${winner} wins!`)
    }
}

//settings to make data parsing and connecting work
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
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

//sends the list of players to the client
app.get("/players", (request, response) => {
    response.json(playerList)
})

//login function
//user submits data, server valifdates, and sends back if they are valid or not
app.post("/login", (request, response) => {
    const loginSubmitted = request.body

    responseFile.responseValue = (
        (playerListArray.filter((p) => p.PlayerName === loginSubmitted.username))
            .length === 1
         && (loginSubmitted.gameKey == settings.GameKey) 
         && (loginSubmitted.password === (playerListArray.filter((p) => p.PlayerName === loginSubmitted.username)[0].Password))
    )
    response.json(responseFile)
})
//spectate function
//user submits data, server validates, and sends back if they are valid or not
app.post("/spectate", (request, response) => {
    const loginSubmitted = request.body

    responseFile.responseValue = loginSubmitted.gameKey == settings.GameKey
    response.json(responseFile)
})

//move function
//client submits move action, server validates if allowed, executes move
//client should refresh and reacquire the data from the server and thus nothing should need to be sent back
app.post("/move", (request, response) => {
    //ingests the data
    const moveSubmitted = request.body

    //gets the player that is trying to make the move
    const movingPlayer = playerListArray.filter((p) => p.PlayerName === moveSubmitted.username)[0]

    //checks that the move is allowed, if so execute the move in the data
    if (
        movingPlayer.Points > 0 &&
        moveSubmitted.destination.xCoordinate > 0 &&
        moveSubmitted.destination.xCoordinate < xMax &&
        moveSubmitted.destination.yCoordinate > 0 &&
        moveSubmitted.destination.yCoordinate < yMax &&
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
        if (settings.SaveOnAction) {
            const data = JSON.stringify(playerList)
            fs.writeFile("./Server/data/players.json", data, (err) => {
                if (err) throw err
            })
        }

        responseFile.responseValue = true
    } else {
        responseFile.responseValue = false
    }

    //sends a response to the client
    response.json(responseFile)
})

//shoot function
app.post("/shoot", (request, response) => {
    //ingests the data
    const shootSubmitted = request.body

    //gets the player that is trying to make the move
    const shootingPlayer = playerListArray.filter((p) => p.PlayerName === shootSubmitted.username)[0]

    //gets the target player from the data
    const targetPlayer = playerListArray.filter((p) => p.PlayerName === shootSubmitted.target)[0]

    //checks if the shoot is valid
    if (
        shootingPlayer.Points > 0 &&
        CheckRangeBetweenTanks(shootingPlayer, targetPlayer) <= 2
    ) {

        shootingPlayer.Points -= 1
        targetPlayer.Health -= 1
        //Handles if the target dies
        if (targetPlayer.Health === 0) {
            targetPlayer.Position = {
                xCoordinate: 0,
                yCoordinate: 0
            }
            targetPlayer.Points = 0
        }
        if (settings.SaveOnAction) {
            const data = JSON.stringify(playerList)
            fs.writeFile("./Server/data/players.json", data, (err) => {
                if (err) throw err
            })
        }

        responseFile.responseValue = true
    } else {
        responseFile.responseValue = false
    }

    checkWinner()
    
    //sends a response to the client
    response.json(responseFile)
})

//send action points function
//sends 1 action point between 1 player and another
app.post("/send", (request, response) => {

    //ingests the data
    const moveSubmitted = request.body

    //gets the player that is trying to send the point
    const sendingPlayer = playerListArray.filter((p) => p.PlayerName === moveSubmitted.sender)[0]
    //gets the player that is going to recieve the point
    const recievingPlayer = playerListArray.filter((p) => p.PlayerName === moveSubmitted.reciever)[0]

    //make sure the sender has enough points
    if (sendingPlayer.Points > 0) {
        //remove the point from the sender
        sendingPlayer.Points -= 1
        //give it to the reciever
        recievingPlayer.Points += 1
        //set the response to true
        responseFile.responseValue =true
    } else {
        //if the sender cant send, make the response false
        responseFile.responseValue = false
    }
    if (settings.SaveOnAction) {
        const data = JSON.stringify(playerList)
        fs.writeFile("./Server/data/players.json", data, (err) => {
            if (err) throw err
        })
    }
    //sends a response to the client
    response.json(responseFile)
})

//function for dead players to vote in the jury
app.post("/vote", (request, response) => {
    //ingests the data
    const voteSubmitted = request.body

    //gets the player that is voting
    const votingPlayer = playerListArray.filter((p) => p.PlayerName === voteSubmitted.voter)[0]
    //gets the player that they are voting for
    const votedPlayer = voteSubmitted.voted

    //sets the vote of the voter to the vote that they submitted
    votingPlayer.Vote = votedPlayer

    //sets the response to true
    responseFile.responseValue = true
    //sends a response to the client
    response.json(responseFile)
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

setInterval(GiveActionPoints, settings.PointInterval * intervalConversion)

//opens the server on the specified port
app.listen(settings.Port, () => {
    console.log(`Listen on the port ${settings.Port}`)
})