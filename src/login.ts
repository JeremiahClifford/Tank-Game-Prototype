const gameKey: string = "00001"

const AttemptLogin = () => {
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string
    if (gameKeyInputted == gameKey) {
        window.open('game.html', '_self')
    } else {
        console.log("Login Failed: Incorrect Game Key")
    }
}