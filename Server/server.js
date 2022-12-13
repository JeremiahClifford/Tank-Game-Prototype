//express server setup
const express = require("express")
const bodyParser = require('body-parser')
const app = express()

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

//sends the list of players to the client
app.get("/players", (request, response) => {
    response.json(play)
})

//game manager page to manage the game settings
//html setup
const ManagerHTML = () => {
    let managerHTML = ""
    managerHTML += "<!DOCTYPE html>"
    managerHTML += "<html lang='en'>"
    managerHTML +=     "<head>"
    managerHTML +=         "<meta charset='UTF-8'>"
    managerHTML +=         "<meta http-equiv='X-UA-Compatible' content='IE=edge'>"
    managerHTML +=         "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
    managerHTML +=         "<title>Game Manager</title>"
    managerHTML +=     "</head>"
    managerHTML +=     "<body>"
    managerHTML +=         "<h2>Game Manager</h2>"
    managerHTML +=         "<h3>Port: " + settings.Port + "</h3>"
    managerHTML +=         "<h3>game Key: " + settings.GameKey + "</h3>"
    managerHTML +=     "</body>"
    managerHTML += "</html>"
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