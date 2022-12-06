const express = require("express")
const app = express()

let settings = require('./data/settings.json')
let playerList = require('./data/players.json')

//test function to test running functions from the client to get data
const TestFunction = () => {
    return "Data sent and received"
}

app.get("/", (request, response) => {
    response.send("Server Page")
})

//game manager page to manage the game settings
app.get("/manager", (request, response) => {
    response.sendFile(__dirname + "/manager.html")
})

app.listen(settings.Port, () => {
    console.log("Listen on the port " + settings.Port + "...")
})