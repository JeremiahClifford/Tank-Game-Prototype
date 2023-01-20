const loginPage: HTMLElement = document.getElementById("login-page") as HTMLElement
const spectatePage: HTMLElement = document.getElementById("spectate-page") as HTMLElement
const rulesPage: HTMLElement = document.getElementById("rules-page") as HTMLElement
const aboutPage: HTMLElement = document.getElementById("about-page") as HTMLElement

const showLoginPage = () => {
    loginPage.style.visibility = "visible"
    loginPage.style.display = "inline"

    spectatePage.style.visibility = "hidden"
    spectatePage.style.display = "none"

    rulesPage.style.visibility = "hidden"
    rulesPage.style.display = "none"

    aboutPage.style.visibility = "hidden"
    aboutPage.style.display = "none"
}

const showSpectatePage = () => {
    loginPage.style.visibility = "hidden"
    loginPage.style.display = "none"

    spectatePage.style.visibility = "visible"
    spectatePage.style.display = "inline"

    rulesPage.style.visibility = "hidden"
    rulesPage.style.display = "none"

    aboutPage.style.visibility = "hidden"
    aboutPage.style.display = "none"
}

const showRulesPage = () => {
    loginPage.style.visibility = "hidden"
    loginPage.style.display = "none"

    spectatePage.style.visibility = "hidden"
    spectatePage.style.display = "none"

    rulesPage.style.visibility = "visible"
    rulesPage.style.display = "inline"

    aboutPage.style.visibility = "hidden"
    aboutPage.style.display = "none"
}

const showAboutPage = () => {
    loginPage.style.visibility = "hidden"
    loginPage.style.display = "none"

    spectatePage.style.visibility = "hidden"
    spectatePage.style.display = "none"

    rulesPage.style.visibility = "hidden"
    rulesPage.style.display = "none"

    aboutPage.style.visibility = "visible"
    aboutPage.style.display = "inline"
}