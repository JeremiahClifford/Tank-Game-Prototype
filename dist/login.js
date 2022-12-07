"use strict";
let gameKey = "00000";
fetch("http://localhost:3000/settings", { method: "GET" })
    .then(res => res.json())
    .then((settings) => gameKey = settings.GameKey)
    .then(() => console.log(gameKey));
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