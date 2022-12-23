"use strict";
const ShowLoginFailed = () => {
    const loginFailedMessage = document.getElementById("login-failed-message");
    loginFailedMessage.innerHTML = `
        Unable to login?<br>
        Make sure that your login details and 
        the port and Game Key details are correct 
        for the server you are attempting to join. 
        Also, make sure that the server that you are 
        attempting to join is currently running. 
        Last, contact the person running the server 
        that you are attempting to join to make that you 
        registered for the game.   
    `;
    loginFailedMessage.style.border = "3px solid red";
    loginFailedMessage.style.borderRadius = "10px";
    loginFailedMessage.style.width = "80%";
    loginFailedMessage.style.marginLeft = "auto";
    loginFailedMessage.style.marginRight = "auto";
    loginFailedMessage.style.marginTop = "10px";
    loginFailedMessage.style.padding = "5px";
    loginFailedMessage.style.backgroundColor = "rgb(255, 161, 161)";
};
//checks the player's login credentials before letting them enter the game
const AttemptLogin = () => {
    //gets the local storage to store login information
    const playerStorage = window.sessionStorage;
    //target server
    const server = "http://localhost:";
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
            ShowLoginFailed();
            console.log("Login Failed: Incorrect Login");
            return;
        }
    })
        .catch(() => console.log("Server not responding"));
};
//# sourceMappingURL=login.js.map