const ShowLoginFailed = (): void => {
    const loginFailedMessage: HTMLElement = document.getElementById("login-failed-message") as HTMLElement

    loginFailedMessage.innerHTML = `
        Unable to login?<br>
        Make sure that your login details and 
        the port and Game Key details are correct 
        for the server you are attempting to join. 
        Also, make sure that the server that you are 
        attempting to join is currently running. 
        Last, contact the Jeremiah to make that you 
        registered for the game. You can contact
        Jeremiah <a href="https://discord.gg/fKnTSgqDSF">Here</a>
    `
    loginFailedMessage.style.border = "3px solid red"
    loginFailedMessage.style.borderRadius = "10px"
    loginFailedMessage.style.width = "80%"
    loginFailedMessage.style.marginLeft = "auto"
    loginFailedMessage.style.marginRight = "auto"
    loginFailedMessage.style.marginTop = "10px"
    loginFailedMessage.style.padding = "5px"
    loginFailedMessage.style.backgroundColor = "rgb(255, 161, 161)"
}

//checks the player's login credentials before letting them enter the game
const AttemptLogin = (): void => {

    //gets the local storage to store login information
    const playerStorage: Storage = window.sessionStorage

    //gets the inputted values
    //username
    const usernameInputField: HTMLInputElement = document.getElementById('usernameinput') as HTMLInputElement
    const usernameInputted: string = usernameInputField.value as string
    //password
    const passwordInputField: HTMLInputElement = document.getElementById('passwordinput') as HTMLInputElement
    const passwordInputted: string = passwordInputField.value as string
    //server
    const serverInputField: HTMLInputElement = document.getElementById('serverinput') as HTMLInputElement
    const serverInputted: string = serverInputField.value as string
    //port
    const portInputField: HTMLInputElement = document.getElementById('portinput') as HTMLInputElement
    const portInputted: string = portInputField.value as string
    //gameKey
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string

    //get the response to the login check
    let loginSucceeded: boolean = false
    fetch(`${serverInputted}:${portInputted}/login`, {
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
                playerStorage.setItem("Username", usernameInputted)
                playerStorage.setItem("Server", serverInputted)
                playerStorage.setItem("Port", portInputted)
                window.open('game.html', '_self')
            } else {
                ShowLoginFailed()
                return
            }
        })
        .catch(() => ShowLoginFailed())
}