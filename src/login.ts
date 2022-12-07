let gameKey: string = "00000"
let playerListImport: any
let playerList: any[] = []

//get the settings from the server
fetch("http://localhost:3000/settings", {method: "GET"})
   .then(res => res.json())
   .then((settings) => gameKey = settings.GameKey)
   .then(() => console.log(gameKey))
   .catch(() => console.log("Server not responding"))

   //get the list of players from the server
fetch("http://localhost:3000/players", {method: "GET"})
   .then(res => res.json())
   //.then((players) => playerListImport = JSON.parse(players))
   .then((players) => playerListImport = players)
   .then(() => console.log(playerListImport))
   .then(() => {
        let i = 1
        while (playerListImport[i] != undefined) {
            playerList.push(playerListImport[i])
            i++
        }
        console.log(playerList)
   })
   .catch(() => console.log("Server not responding"))

//checks the player's login credentials before letting them enter the game
const AttemptLogin = () => {

    //checks if the player's Username is the name of an existing player
    const usernameInputField: HTMLInputElement = document.getElementById('usernameinput') as HTMLInputElement
    const usernameInputted: string = usernameInputField.value as string
    if (playerList.filter((p) => p.PlayerName == usernameInputted).length != 1) {
        console.log("Login Failed: Username not registered\nContact admin to register as a player")
        return
    }

    //checks if the gameKey that the player enters matches the gameKey stored on the server
    const gameKeyInputField: HTMLInputElement = document.getElementById('gamekeyinput') as HTMLInputElement
    const gameKeyInputted: string = gameKeyInputField.value as string
    if (gameKeyInputted == gameKey) {
        window.open('game.html', '_self')
    } else {
        console.log("Login Failed: Incorrect Game Key")
        return
    }
}