const express = require("express")
const app = express()

let settings = require('./data/settings.json')
let playerList = require('./data/players.json')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", (request, response) => {
    response.send("Server Page")
})

//responses for requests for data from the client
app.get("/settings", (request, response) => {
    response.json(settings)
})

app.get("/players", (request, response) => {
    response.json(playerList)
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
    managerHTML +=     "</body>"
    managerHTML += "</html>"
    return managerHTML
}
//page setup
app.get("/manager", (request, response) => {
    response.send(ManagerHTML())
})

app.listen(settings.Port, () => {
    console.log("Listen on the port " + settings.Port + "...")
})