const ShowConnectFailed = (): void => {
    const connectMessageFailed: HTMLElement = document.getElementById("connect-failed-message") as HTMLElement

    connectMessageFailed.innerHTML = `
        Unable to connect to the Server?<br>
        Make sure that the port and Game Key 
        details are correct for the server you 
        are attempting to spectate. Also, make sure 
        that the server that you are attempting 
        to spectate is currently running. You can
        contact Jeremiah <a href="https://discord.gg/fKnTSgqDSF">Here</a>
    `
    connectMessageFailed.style.border = "3px solid red"
    connectMessageFailed.style.borderRadius = "10px"
    connectMessageFailed.style.width = "80%"
    connectMessageFailed.style.marginLeft = "auto"
    connectMessageFailed.style.marginRight = "auto"
    connectMessageFailed.style.marginTop = "10px"
    connectMessageFailed.style.padding = "5px"
    connectMessageFailed.style.backgroundColor = "rgb(255, 161, 161)"
}

const AttemptSpectate = (): void => {

    //gets the local storage to store login information
    const playerStorage: Storage = window.sessionStorage
    
    //target server
    const server: string = "http://localhost:"

    //gets the inputted values
    //gameKey
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string
    //port
    const portInputField: HTMLInputElement = document.getElementById('portinput') as HTMLInputElement
    const portInputted: string = portInputField.value as string

    //get the response to the login check
    let loginSucceeded: boolean = false
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
                playerStorage.setItem("Port", portInputted)
                playerStorage.setItem("Username", "spectator")
                window.open('game.html', '_self')
            } else {
                ShowLoginFailed()
                return
            }
        })
        .catch(() => {
            ShowConnectFailed()
        })
}