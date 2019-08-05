//------- begin of the chessBoard -------
import Chessboard from "./chessUtils/chessboard.js";
import { displayMessage } from "./helper/FrontendHelper.js";

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
        INTERVAL, CHESS_RADIUS, context,
        canvas.width, canvas.height, null,// color is null when creating the chessboard
        originX, originY
    );
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();
}

function initSocketEvent(socket) {

    const chessBoardClickHandler = function (event) {
        let chess = chessBoard.click(event);
        if (chess) socket.emit('click', chess);
    }

    const chessBoardSelectDeathStoneHandler = function (event) {
        let chess = chessBoard.click(event);
        
        if (chess) {
            let joinedChess = chessBoard.getJointChess(chess);
            console.log(joinedChess);
        }
    }


    canvas.addEventListener("click", chessBoardClickHandler);

    socket.on('initChessboard', function (chessRecord) {
        for (let i = 0; i < chessRecord.colorArr.length; i++) {
            for (let j = 0; j < chessRecord.colorArr[i].length; j++) {
                if (chessRecord.colorArr[i][j]) {
                    let color = chessRecord.colorArr[i][j] === 1 ? "black" : "white"; // Todo: need to change the data structure
                    chessBoard.addChess(i, j, color);
                }
            }
        }
    });


    socket.on("opponentResign", function () {
        displayMessage("<p>You won the game, your opponnent has admitted failure<p>",
            ".message", "alert-success", `<h4 class="alert-heading">Congrats!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
    })

    socket.on('updateChess', function (chessArr) {
        chessBoard.renderNewChessboard(chessArr);
    });

    document.getElementById('judgeEvent').addEventListener('click', function () {
        socket.emit('judge');
        displayMessage("Please select the death stone", ".message", "alert-warning",
            `<button class="close" type="button" data-dismiss="alert">
                <span>×</span>
            </button>` );


        canvas.removeEventListener("click", chessBoardClickHandler);
        canvas.addEventListener("click", chessBoardSelectDeathStoneHandler);
    });


    document.getElementById('resignEvent').addEventListener('click', function () {
        socket.emit("resignReq", function () {
            displayMessage("<p>Better luck next time<p>", ".message", "alert-danger", `<h4 class="alert-heading">Sorry</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
        });
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

    window.addEventListener('beforeunload', function (e) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = 'Are you sure you want to leave?';
    });
}
//-----end of the chessBoard ----


function gameWon() {
    // alert('You won');
}

function gameLost() {
    // alert('You lost');
}

(function init() {
    createChessBoard(); // init the chessboard but the game does not begin yet.
    // $(".chessBoard").show("fold", 1000);

    window.addEventListener("resize", function () {
        chessBoard.originX = document.querySelector(".chessBoard").getBoundingClientRect().left;
        canvas.width = canvas.height = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        chessBoard.height = chessBoard.width = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        chessBoard.interval = (canvas.width - 2 * 20) / 18;
        chessBoard.renderNewChessboard();
    });


})();



export {
    initChessEvent,
    initSocketEvent
    // createChessBoard
};
