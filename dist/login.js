"use strict";
//checks the player's login credentials before letting them enter the game
const AttemptLogin = () => {
    //gets the inputted values
    //username
    const usernameInputField = document.getElementById('usernameinput');
    const usernameInputted = usernameInputField.value;
    //gameKey
    const gameKeyInputField = document.getElementById('gamekeyinput');
    const gameKeyInputted = gameKeyInputField.value;
    //get the response to the login check
    let loginSucceeded = false;
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": usernameInputted,
            "gameKey": gameKeyInputted
        })
    })
        .then((response) => response.json())
        .then((responseFile) => loginSucceeded = responseFile.responseValue)
        .then(() => console.log(loginSucceeded))
        .then(() => {
        if (loginSucceeded) {
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