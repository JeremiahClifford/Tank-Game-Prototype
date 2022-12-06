"use strict";
const gameKey = "00001";
const AttemptLogin = () => {
    const gameKeyInputField = document.getElementById('gamekeyinput');
    const gameKeyInputted = gameKeyInputField.value;
    if (gameKeyInputted == gameKey) {
        window.open('game.html', '_self');
    }
    else {
        console.log("Login Failed: Incorrect Game Key");
    }
};
//# sourceMappingURL=login.js.map