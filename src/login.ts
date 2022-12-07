let gameKey: string = "00000"

fetch("http://localhost:3000/settings", {method: "GET"})
   .then(res => res.json())
   .then((settings) => gameKey = settings.GameKey)
   .then(() => console.log(gameKey))

const AttemptLogin = () => {
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string
    if (gameKeyInputted == gameKey) {
        window.open('game.html', '_self')
    } else {
        console.log("Login Failed: Incorrect Game Key")
    }
}