//------- begin of the chessBoard -------
import Chessboard from "./chessUtils/chessboard.js";

let canvas = document.querySelector(".chessBoard");
let context = canvas.getContext("2d");

canvas.width = canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

let originX = document.querySelector(".chessBoard").getBoundingClientRect().left;
let originY = 0;

const CHESS_RADIUS = 20;
const INTERVAL = (canvas.width - 2 * 20) / 18;

let chessBoard;

function createChessBoard() {
    chessBoard = new Chessboard(
        INTERVAL,
        CHESS_RADIUS,
        context,
        canvas.width,
        canvas.height,
        null,// color is null when creating the chessboard
        originX,
        originY
    );
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();

    $(window).resize(function () {
        chessBoard.originX = document.querySelector(".chessBoard").getBoundingClientRect().left;


        chessBoard.canvas.width = chessBoard.canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
        chessBoard.interval = (chessBoard.canvas.width - 2 * 20) / 18;
        console.log(chessBoard.interval);
        console.log(chessBoard);
    });

}
createChessBoard(); // init the chessboard but the game does not begin yet.

function initSocketEvent(socket) {

    canvas.addEventListener("click", function (event) {
        let chess = chessBoard.click(event);
        if (chess) {
            socket.emit('click', chess, function (chessRecord) {
                chessBoard.renderNewChessboard(chessRecord);
                //     chessSound();
            });
        }
    });

    // socket.on('initChess', function (chessRecord) {
    // 	for (let i = 0; i < chessRecord.colorArr.length; i++) {
    // 		for (let j = 0; j < chessRecord.colorArr[i].length; j++) {
    // 			if (chessRecord.colorArr[i][j]) {
    // 				chessBoard.addChess(i, j, chessRecord.colorArr[i][j]);
    // 			}
    // 		}
    // 	}
    // });

    socket.on('updateChess', function (chessRecord) {
        chessBoard.renderNewChessboard(chessRecord);
    });
}

function initChessEvent(color) {
    chessBoard.setColor(color);
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();
    $(".chessBoard").css("cursor", "none");
    $(".chessBoard").mouseleave(function () {
        chessBoard.renderNewChessboard(); // this prevents a chess being drawn when the cursor leaves the chessBoard
    });

    canvas.addEventListener("mousemove", function (event) {
        chessBoard.hover(event);
    });
}
//-----end of the chessBoard ----

export {
    initChessEvent,
    initSocketEvent
    // createChessBoard
};
