//------- begin of the chessBoard -------
var canvas = document.querySelector('.chessBoard');
var context = canvas.getContext('2d');
var length = window.innerHeight < window.innerWidth ? window.innerWidth : window.innerHeight;
var width = canvas.width = canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

var originX = document.querySelector('.chessBoard').getBoundingClientRect().left;

const CHESS_RADIUS = 20;
const INTERVAL = (canvas.width - 2 * 20) / 18;

var chessBoard;

function createChessBoard(color) {
	chessBoard = new Chessboard(INTERVAL, CHESS_RADIUS, context, canvas.width, canvas.height, color, originX, 0);
	//there should be no margin in y axis
	chessBoard.renderNewChessboard();
	$('.chessBoard').css('cursor', 'none');
	$('.chessBoard').mouseleave(function () {
		chessBoard.renderNewChessboard(); // this prevents a chess being drawn when the cursor leaves the chessBoard
	});

	canvas.addEventListener('mousemove', function (event) {
		chessBoard.hover(event);
	});

}

createChessBoard();

//-----end of the chessBoard ----

