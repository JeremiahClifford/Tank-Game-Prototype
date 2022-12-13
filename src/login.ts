//checks the player's login credentials before letting them enter the game
const AttemptLogin = () => {

    //gets the inputted values
    //username
    const usernameInputField: HTMLInputElement = document.getElementById('usernameinput') as HTMLInputElement
    const usernameInputted: string = usernameInputField.value as string
    //password
    const passwordInputField: HTMLInputElement = document.getElementById('passwordinput') as HTMLInputElement
    const passwordInputted: string = passwordInputField.value as string
    //gameKey
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string
    //port
    const portInputField: HTMLInputElement = document.getElementById('portinput') as HTMLInputElement
    const portInputted: string = portInputField.value as string

    //get the response to the login check
    let loginSucceeded: boolean = false
    fetch("http://localhost:" + portInputted + "/login", {
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
                window.open('game.html', '_self')
            } else {
                console.log("Login Failed: Incorrect Login")
                return
            }
        })
        .catch(() => console.log("Server not responding"))
} 