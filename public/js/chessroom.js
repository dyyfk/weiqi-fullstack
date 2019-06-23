//------- begin of the chessBoard -------
import Chessboard from "./chessboard.js";

let canvas = document.querySelector(".chessBoard");

let context = canvas.getContext("2d");
let length =
  window.innerHeight < window.innerWidth
    ? window.innerWidth
    : window.innerHeight;
let width = (canvas.width = canvas.height =
  window.innerHeight > window.innerWidth
    ? window.innerWidth
    : window.innerHeight);

let originX = document.querySelector(".chessBoard").getBoundingClientRect()
  .left;
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
    "black",
    originX,
    originY
  );
  //there should be no margin in y axis
  chessBoard.renderNewChessboard();
}
createChessBoard(); // init the chessboard but the game does not begin yet.

function initSocketEvent() {
  canvas.addEventListener("click", function (event) {
    let chessObj = chessBoard.click(event);
    console.log(chessObj);
    // if (chessObj) {
    // 	socket.of('chessroom').emit('click', chessObj, color, function (err, chessRecord) {
    // 		if (!err) {
    // 			chessBoard.renderNewChessboard(chessRecord);
    // 			chessSound();
    // 		}
    // 	});
    // }
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

  // socket.on('updateChess', function (chessRecord) {
  // 	chessBoard.renderNewChessboard(chessRecord);
  // });
}

function initChessEvent(color) {
  // chessBoard = new Chessboard(INTERVAL, CHESS_RADIUS, context, canvas.width, canvas.height, originX, 0);
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
