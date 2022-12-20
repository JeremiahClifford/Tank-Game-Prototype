"use strict";
const AttemptSpectate = () => {
    //gets the local storage to store login information
    const playerStorage = window.sessionStorage;
    //target server
    const server = "http://localhost:";
    //gets the inputted values
    //gameKey
    const gameKeyInputField = document.getElementById('gamekeyinput');
    const gameKeyInputted = gameKeyInputField.value;
    //port
    const portInputField = document.getElementById('portinput');
    const portInputted = portInputField.value;
    //get the response to the login check
    let loginSucceeded = false;
    fetch(server + portInputted + "/spectate", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "gameKey": gameKeyInputted
        })
    })
        .then((response) => response.json())
        .then((responseFile) => loginSucceeded = responseFile.responseValue)
        .then(() => {
        if (loginSucceeded) {
            playerStorage.setItem("Port", portInputted);
            playerStorage.setItem("Username", "spectator");
            window.open('game.html', '_self');
        }
        else {
            console.log("Login Failed: Incorrect Login");
            return;
        }
    })
        .catch(() => console.log("Server not responding"));
};
//# sourceMappingURL=spectate.js.map