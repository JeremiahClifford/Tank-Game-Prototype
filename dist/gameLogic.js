"use strict";
const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');
const drawBoard = () => {
    //draws a black test square
    context.fillStyle = "black";
    context.fillRect(120, 180, 100, 100);
    console.log("Board Drawn");
};
drawBoard();
//# sourceMappingURL=gameLogic.js.map