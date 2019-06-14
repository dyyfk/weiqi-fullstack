//------- begin of the chessBoard -------
import Chessboard from './chessboard.js';

var canvas = document.querySelector('.chessBoard');

var context = canvas.getContext('2d');
var length = window.innerHeight < window.innerWidth ? window.innerWidth : window.innerHeight;
var width = canvas.width = canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

var originX = document.querySelector('.chessBoard').getBoundingClientRect().left;

const CHESS_RADIUS = 20;
const INTERVAL = (canvas.width - 2 * 20) / 18;

var chessBoard;

function createChessBoard() {
	chessBoard = new Chessboard(INTERVAL, CHESS_RADIUS, context, canvas.width, canvas.height, originX, 0);
	//there should be no margin in y axis
	chessBoard.renderNewChessboard();
}
createChessBoard() // init the chessboard but the game does not begin yet.


function initSocketEvent() {


	// canvas.addEventListener('click', function (event) {
	// 	var chessObj = chessBoard.click(event);
	// 	if (chessObj) {
	// 		socket.of('chessroom').emit('click', chessObj, color, function (err, chessRecord) {
	// 			if (!err) {
	// 				chessBoard.renderNewChessboard(chessRecord);
	// 				chessSound();
	// 			}
	// 		});
	// 	}
	// });

	// socket.on('initChess', function (chessRecord) {
	// 	for (var i = 0; i < chessRecord.colorArr.length; i++) {
	// 		for (var j = 0; j < chessRecord.colorArr[i].length; j++) {
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
	chessBoard.gameBegin(color);
	chessBoard.renderNewChessboard();
	$('.chessBoard').css('cursor', 'none');
	$('.chessBoard').mouseleave(function () {
		chessBoard.renderNewChessboard(); // this prevents a chess being drawn when the cursor leaves the chessBoard
	});

	canvas.addEventListener('mousemove', function (event) {
		console.log(chessBoard.color);
		chessBoard.hover(event);
	});
}


//-----end of the chessBoard ----

export {
	initChessEvent,
	initSocketEvent,
	// createChessBoard
}
