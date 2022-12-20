const AttemptSpectate = () => {

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
                console.log("Login Failed: Incorrect Login")
                return
            }
        })
        .catch(() => console.log("Server not responding"))
}