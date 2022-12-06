const express = require("express");
const app = express();

const port = 3000

app.get("/", (request, response) => {
    response.send("Hi there");
});

//game manager page to manage the game settings
//html setup
let managerHTML = ""
const assignManagerHTML = () => {
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
    managerHTML +=     "</body>"
    managerHTML += "</html>"
}
assignManagerHTML();
//page setup
app.get("/manager", (request, response) => {
    response.send(managerHTML);
});

app.listen(port, () => {
    console.log("Listen on the port 3000...");
});