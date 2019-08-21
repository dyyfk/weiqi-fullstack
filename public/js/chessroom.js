//------- begin of the chessBoard -------
import Chessboard from "./chessUtils/chessboard.js";
import { displayStatus, invalidMoveMessage } from "./helper/FrontendHelper.js";

let canvas = document.querySelector(".chessBoard");
let context = canvas.getContext("2d");
let margin = 20;

canvas.width = canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

let originX = document.querySelector(".chessBoard").getBoundingClientRect().left;
let originY = 0;

const INTERVAL = (canvas.width - 2 * 20) / 18;
const CHESS_RADIUS = 0.4 * INTERVAL;

let chessBoard;
let opponentLeftTimer;

function createChessBoard() {
    chessBoard = new Chessboard(
        INTERVAL, CHESS_RADIUS, context,
        canvas.width, canvas.height, null,// color is null when creating the chessboard
        originX, originY
    );
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();
}

function initJudgeEvent() {

}


// var blackTimer = new easytimer.Timer();
// var whiteTimer = new easytimer.Timer();

function initSocketEvent(socket) {
    socket.on('updateChess', function (colorArr, latestChess) {
        chessBoard.renderNewChessboard(colorArr);
        chessBoard.setLatestChess(latestChess.row, latestChess.col);
    });

    socket.on('initChessboard', function (chessRecord) {
        chessBoard.renderNewChessboard(chessRecord.colorArr);
    });

}

function initGameEvent(socket) {
    const chessBoardClickHandler = function (event) {
        let chess = chessBoard.click(event);
        if (chess) {
            socket.emit('click', chess, function (err) {
                if (err) {
                    invalidMoveMessage(err);
                } else {
                    // whiteTimer.start();
                    // blackTimer.pause();
                }

            });
        }
    }

    const chessBoardSelectDeathStoneHandler = function (event) {
        chessBoard.click(event, true); // This should not return anything since we are only changing the display color of chess
        socket.emit("deathStoneSelected", chessBoard.chessArr);
    }

    const resignHandler = function () {
        socket.emit("resignReq", chessBoard.color, function () {
            displayStatus("<p>better stretagy next time <br>luck only goes so far in the fame of go<p>", "#status", "alert-danger", `<h4 class="alert-heading">Sorry</h4>`, '<hr><button class="btn btn-primary">play another game?</button>');
            socket.close(); // Disable the match socket
            document.getElementById('resignEvent').removeEventListener('click', resignHandler);
            document.getElementById('judgeEvent').removeEventListener('click', judgeHanlder);
            canvas.removeEventListener("click", chessBoardClickHandler);

            $('.btn-toolbar *').prop('disabled', true); // Disable all buttons

        });
    }
    const hoverHandler = function (event) {
        chessBoard.hover(event);
    }
    const deathStoneHandler = function (event) {
        chessBoard.hover(event, true);
    }

    const judgeHanlder = function () {
        socket.emit('judgeReq');
        displayStatus(`waiting for opponent... 
            <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");
    }

    const switchToPlayMode = function () {
        canvas.removeEventListener("click", chessBoardSelectDeathStoneHandler);
        canvas.removeEventListener("mousemove", deathStoneHandler);
        canvas.addEventListener("click", chessBoardClickHandler);
        canvas.addEventListener("mousemove", hoverHandler);
    }

    const switchToJudgeMode = function () {
        canvas.removeEventListener("click", chessBoardClickHandler);
        canvas.removeEventListener("mousemove", hoverHandler);
        canvas.addEventListener("click", chessBoardSelectDeathStoneHandler);
        canvas.addEventListener("mousemove", deathStoneHandler);
    }

    document.getElementById('resignEvent').addEventListener('click', resignHandler);
    document.getElementById('judgeEvent').addEventListener('click', judgeHanlder);

    socket.on('playerConnected', function () {
        displayStatus(`
        game on
        <button class="close" type="button" data-dismiss="alert">
            <span>×</span>
        </button>`, "#status", "alert-info alert-dismissable",
        );
        switchToPlayMode();
    });

    socket.on("opponentDeathStone", function (chessArr) {
        chessBoard.selectDeadStone(chessArr);
    });

    socket.on('deathStoneConsensusReq', function () {
        displayStatus("your opponent wants to finish playing and remove dead stones", "#status", "alert-light",
            "<h4>enter judge phase?</h4>",
            `<button class="btn btn-outline-success btn-sm" data-dismiss="alert" id="deathStoneConsensusAccepted" type="button">approve</button>
                <button class="btn btn-outline-danger btn-sm" data-dismiss="alert" id="deathStoneConsensusDeclined" type="button">decline</button>`
        );

        document.getElementById("deathStoneConsensusAccepted").addEventListener("click", function (e) {
            let cleanedChessboard = chessBoard.getCleanChessboard();
            socket.emit('deathStoneFinished', cleanedChessboard);
        });
        document.getElementById("deathStoneConsensusDeclined").addEventListener("click", function (e) {
            displayStatus("please remove all dead stones", "#status", "alert-light",
                `<h4 class="alert-heading">judge</h4>`,
                `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">that's all the dead stones for both players</button>
            
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger mt-2">I wish to keep playing</button>
            `);
            socket.emit('deathStoneConsensusDeclined');
            document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
                displayStatus(`waiting for your opponent... 
                             <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");

                socket.emit('deathStoneConsensusReq');
            });

            document.getElementById("exitDeathStoneMode").addEventListener("click", function (e) {
                socket.emit("exitDeathStoneMode");
            });


        });

    });

    socket.on('exitJudgePhase', function () {
        displayStatus(`
        one of the players decided to exit judge phase.
        <br> game proceeds
        <button class="close" type="button" data-dismiss="alert">
            <span>×</span>
        </button>`, "#status", "alert-light alert-dismissable",
        );

        switchToPlayMode();
        chessBoard.exitJudgeMode();
    })


    socket.on('deathStoneConsensusDeclined', function () {
        displayStatus("<p class='text-danger'>your opponent does not accept current settlement</p> (you may discuss using the messagebox)", "#status", "alert-light",
            `<h4 class="alert-heading">judge</h4>`,
            `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">that's all the dead stones for both players</button>
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger mt-2">I wish to keep playing</button>
            `);
        document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
            displayStatus(`waiting for your opponent... 
                         <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");

            socket.emit('deathStoneConsensusReq');
        });

        document.getElementById("exitDeathStoneMode").addEventListener("click", function (e) {
            socket.emit("exitDeathStoneMode");
        });
    })




    socket.on("judgePhase", function () {
        displayStatus("please remove all dead stones", "#status", "alert-light",
            `<h4 class="alert-heading">judge phase</h4>`,
            `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">that's all the dead stones for both players</button>
            
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger mt-2">I wish to keep playing</button>
            `);
        switchToJudgeMode();
        document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
            displayStatus(`waiting for your opponent... 
                     <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");
            socket.emit('deathStoneConsensusReq');
        });

        document.getElementById("exitDeathStoneMode").addEventListener("click", function (e) {
            socket.emit("exitDeathStoneMode");
        });
    })

    socket.on('judgeReqDeclined', function () {
        displayStatus(`your opponent decided to keep playing
         <button class="close" type="button" data-dismiss="alert">
            <span>×</span>
        </button>`, "#status", "alert-danger alert-dismissible",
        );
    })


    socket.on("opponentDrawReq", function () {

    })

    socket.on("opponentLeft", function () {
        displayStatus("your opponent left the room, please wait for <time id='opponentLeftTimer'>5</time>", "#status", "alert-danger");

        opponentLeftTimer = new easytimer.Timer();
        opponentLeftTimer.start({ countdown: true, startValues: { seconds: 300 } });
        $('#opponentLeftTimer').html(opponentLeftTimer.getTimeValues().toString());
        opponentLeftTimer.addEventListener('secondsUpdated', function (e) {
            $('#opponentLeftTimer').html(opponentLeftTimer.getTimeValues().toString());
        });
        opponentLeftTimer.addEventListener('targetAchieved', function (e) {
            socket.emit("opponentTimeout", chessBoard.color);

            displayStatus("<p>You won the game, your opponent has timed out<p>",
                "#status", "alert-success", `<h4 class="alert-heading">Congratulations!</h4>`);
        });

    });

    socket.on('opponentConnected', function () {
        displayStatus(`
        game on
        <button class="close" type="button" data-dismiss="alert">
            <span>×</span>
        </button>`, "#status", "alert-info alert-dismissable",
        );
        opponentLeftTimer.stop();

    });

    socket.on('opponentJudgeReq', function () {
        displayStatus(`<p>Your opponent wants to judge</p>`,
            "#status", "alert-light", '<h4 class="alert-heading">start judge phase?</h4>',
            `<button class="btn btn-outline-success btn-sm" data-dismiss="alert" id="judgeReqAccept" type="button">Accept</button>
                <button class="btn btn-outline-danger btn-sm" data-dismiss="alert" id="judgeReqDecline" type="button">Decline</button>`);

        document.getElementById("judgeReqAccept").addEventListener('click', function () {
            socket.emit('judgeReqAnswer', true);
        });

        document.getElementById("judgeReqDecline").addEventListener('click', function () {
            socket.emit('judgeReqAnswer', false);
        });
    });

    socket.on("opponentResign", function () {
        displayStatus("<p>You won the game, your opponnent resigned<p>",
            "#status", "alert-success", `<h4 class="alert-heading">Congratulations!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
        socket.close(); // Disable the match socket
        document.getElementById('resignEvent').removeEventListener('click', resignHandler);
        document.getElementById('judgeEvent').removeEventListener('click', judgeHanlder);
        canvas.removeEventListener("click", chessBoardClickHandler);

        $('.btn-toolbar *').prop('disabled', true); // Disable all buttons

    })
}

function initChessEvent(color) {
    chessBoard.setColor(color);
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();
    $(".chessBoard").css("cursor", "none");
    $(".chessBoard").mouseleave(function () {
        chessBoard.renderNewChessboard();
        // this prevents a chess being drawn when the cursor leaves the chessBoard
    });

    $('#rule').modal(); // This comes from roleModal.ejs file 


    // function initTimer() { // The timer is loaded in timer.ejs file
    //     $('#timer-b #time-1').html(blackTimer.getTimeValues().toString());
    //     blackTimer.addEventListener('secondsUpdated', function (e) {
    //         $('#timer-b #time-1').html(blackTimer.getTimeValues().toString());
    //     });
    //     blackTimer.addEventListener('targetAchieved', function (e) {
    //         $('#timer-b #time-1').html('KABOOM!!');
    //     });
    //     $('#timer-w #time-2').html(whiteTimer.getTimeValues().toString());
    //     whiteTimer.addEventListener('secondsUpdated', function (e) {
    //         $('#timer-w #time-2').html(whiteTimer.getTimeValues().toString());
    //     });
    //     whiteTimer.addEventListener('targetAchieved', function (e) {
    //         $('#timer-w #time-2').html('KABOOM!!');
    //     });
    // }

    // initTimer();

    // window.addEventListener('beforeunload', function (e) {
    //     // Cancel the event
    //     e.preventDefault();
    //     // Chrome requires returnValue to be set
    //     e.returnValue = 'Are you sure you want to leave?';
    // });
}
//-----end of the chessBoard ----


window.onload = function () {
    createChessBoard(); // init the chessboard but the game does not begin yet.

    window.addEventListener("resize", function () {
        chessBoard.originX = document.querySelector(".chessBoard").getBoundingClientRect().left;
        canvas.width = canvas.height = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        chessBoard.height = chessBoard.width = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        chessBoard.interval = (chessBoard.width - 2 * 20) / 18;
        chessBoard.resize();
    });
};

export {
    initChessEvent,
    initSocketEvent,
    initGameEvent
    // createChessBoard
};
