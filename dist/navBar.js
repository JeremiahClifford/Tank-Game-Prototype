"use strict";
const loginPage = document.getElementById("login-page");
const spectatePage = document.getElementById("spectate-page");
const rulesPage = document.getElementById("rules-page");
const aboutPage = document.getElementById("about-page");
const showLoginPage = () => {
    loginPage.style.visibility = "visible";
    loginPage.style.display = "inline";
    spectatePage.style.visibility = "hidden";
    spectatePage.style.display = "none";
    rulesPage.style.visibility = "hidden";
    rulesPage.style.display = "none";
    aboutPage.style.visibility = "hidden";
    aboutPage.style.display = "none";
};
const showSpectatePage = () => {
    loginPage.style.visibility = "hidden";
    loginPage.style.display = "none";
    spectatePage.style.visibility = "visible";
    spectatePage.style.display = "inline";
    rulesPage.style.visibility = "hidden";
    rulesPage.style.display = "none";
    aboutPage.style.visibility = "hidden";
    aboutPage.style.display = "none";
};
const showRulesPage = () => {
    loginPage.style.visibility = "hidden";
    loginPage.style.display = "none";
    spectatePage.style.visibility = "hidden";
    spectatePage.style.display = "none";
    rulesPage.style.visibility = "visible";
    rulesPage.style.display = "inline";
    aboutPage.style.visibility = "hidden";
    aboutPage.style.display = "none";
};
const showAboutPage = () => {
    loginPage.style.visibility = "hidden";
    loginPage.style.display = "none";
    spectatePage.style.visibility = "hidden";
    spectatePage.style.display = "none";
    rulesPage.style.visibility = "hidden";
    rulesPage.style.display = "none";
    aboutPage.style.visibility = "visible";
    aboutPage.style.display = "inline";
};
//# sourceMappingURL=navBar.js.map