"use strict";
const ShowConnectFailed = () => {
    const connectMessageFailed = document.getElementById("connect-failed-message");
    connectMessageFailed.innerHTML = `
        Unable to connect to the Server?<br>
        Make sure that the port and Game Key 
        details are correct for the server you 
        are attempting to spectate. Also, make sure 
        that the server that you are attempting 
        to spectate is currently running. You can
        contact Jeremiah <a href="https://discord.gg/fKnTSgqDSF">Here</a>
    `;
    connectMessageFailed.style.border = "3px solid red";
    connectMessageFailed.style.borderRadius = "10px";
    connectMessageFailed.style.width = "80%";
    connectMessageFailed.style.marginLeft = "auto";
    connectMessageFailed.style.marginRight = "auto";
    connectMessageFailed.style.marginTop = "10px";
    connectMessageFailed.style.padding = "5px";
    connectMessageFailed.style.backgroundColor = "rgb(255, 161, 161)";
};
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
            ShowLoginFailed();
            return;
        }
    })
        .catch(() => {
        ShowConnectFailed();
    });
};
//# sourceMappingURL=spectate.js.map