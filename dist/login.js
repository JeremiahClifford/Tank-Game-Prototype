"use strict";
//gets the local storage to store login information
const playerStorage = window.sessionStorage;
//target server
const server = "http://localhost:";
//checks the player's login credentials before letting them enter the game
const AttemptLogin = () => {
    //gets the inputted values
    //username
    const usernameInputField = document.getElementById('usernameinput');
    const usernameInputted = usernameInputField.value;
    //password
    const passwordInputField = document.getElementById('passwordinput');
    const passwordInputted = passwordInputField.value;
    //gameKey
    const gameKeyInputField = document.getElementById('gamekeyinput');
    const gameKeyInputted = gameKeyInputField.value;
    //port
    const portInputField = document.getElementById('portinput');
    const portInputted = portInputField.value;
    //get the response to the login check
    let loginSucceeded = false;
    fetch(server + portInputted + "/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": usernameInputted,
            "password": passwordInputted,
            "gameKey": gameKeyInputted
        })
    })
        .then((response) => response.json())
        .then((responseFile) => loginSucceeded = responseFile.responseValue)
        .then(() => {
        if (loginSucceeded) {
            playerStorage.setItem("Username", usernameInputted);
            playerStorage.setItem("Port", portInputted);
            window.open('game.html', '_self');
        }
        else {
            console.log("Login Failed: Incorrect Login");
            return;
        }
    })
        .catch(() => console.log("Server not responding"));
};
//# sourceMappingURL=login.js.map