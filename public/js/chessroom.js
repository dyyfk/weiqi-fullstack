//------- begin of the chessBoard -------
import Chessboard from "./chessUtils/chessboard.js";
import { displayStatus } from "./helper/FrontendHelper.js";

let canvas = document.querySelector(".chessBoard");
let context = canvas.getContext("2d");
let margin = 20;

canvas.width = canvas.height = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

let originX = document.querySelector(".chessBoard").getBoundingClientRect().left;
let originY = 0;

const INTERVAL = (canvas.width - 2 * 20) / 18;
const CHESS_RADIUS = 0.4 * INTERVAL;

let chessBoard;
let chessArrCopy;

function createChessBoard() {
    chessBoard = new Chessboard(
        INTERVAL, CHESS_RADIUS, context,
        canvas.width, canvas.height, null,// color is null when creating the chessboard
        originX, originY
    );
    //there should be no margin in y axis
    chessBoard.renderNewChessboard();
}


var blackTimer = new easytimer.Timer();
var whiteTimer = new easytimer.Timer();

function initSocketEvent(socket) {
    socket.on('updateChess', function (chessArr, latestChess) {
        let color = latestChess.color;

        // console.log(chessBoard.latestChess);

        chessBoard.renderNewChessboard(chessArr);
        chessBoard.setLatestChess(latestChess.row, latestChess.col);

        if (color === "black") {
            whiteTimer.start();
            blackTimer.pause();
        } else {
            blackTimer.start();
            whiteTimer.pause();
        }

    });




    // socket.on("blackTimer", function (blackTimer) {
    //     let seconds = blackTimer.hours * 60 * 60 + blackTimer.minutes * 60 + blackTimer.seconds
    //     console.log(seconds);
    //     blackTimer.reset();

    //     $('#timer-b #time-1').html(blackTimer);
    //     blackTimer.start({ countdown: true, startValues: seconds });
    //     blackTimer.addEventListener('secondsUpdated', function (e) {
    //         $('#timer-b #time-1').html(blackTimer.getTimeValues().toString());
    //     });
    //     blackTimer.addEventListener('targetAchieved', function (e) {
    //         $('#timer-b #time-1').html('KABOOM!!');
    //     });
    // })
    // socket.on("whiteTimer", function (whiteTimer) {
    //     $('#timer-w #time-2').html(whiteTimer);
    //     // blackTimer.reset();
    //     // blackTimer.start({ countdown: true, startValues: blackTimer });
    //     whiteTimer.addEventListener('secondsUpdated', function (e) {
    //         $('#timer-w #time-2').html(whiteTimer.getTimeValues().toString());
    //     });
    //     whiteTimer.addEventListener('targetAchieved', function (e) {
    //         $('#timer-w #time-2').html('KABOOM!!');
    //     });
    // })
}

function initGameEvent(socket) {
    const chessBoardClickHandler = function (event) {
        let chess = chessBoard.click(event);
        if (chess) {
            socket.emit('click', chess, function (err) {
                if (err) {
                    console.log(err); // Todo: here should display this message to the frond end.

                    $("body").append(`<h3 class="fixed-top ">${err}</h3>`);


                } else {
                    whiteTimer.start();
                    blackTimer.pause();
                }

            });
        }
    }

    const chessBoardSelectDeathStoneHandler = function (event) {
        chessBoard.click(event, true); // This should not return anything since we are only changing the display color of chess
        // if (joinedChess) socket.emit('deathStoneSelected', joinedChess);
        socket.emit("deathStoneSelected", chessBoard.chessArr);
    }

    const resignHandler = function () {
        socket.emit("resignReq", function () {
            displayStatus("<p>Better luck next time<p>", "#status", "alert-danger", `<h4 class="alert-heading">Sorry</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
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
        displayStatus(`Waiting for your opponent to respond... 
        <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");
    }

    document.getElementById('resignEvent').addEventListener('click', resignHandler);
    document.getElementById('judgeEvent').addEventListener('click', judgeHanlder);
    canvas.addEventListener("click", chessBoardClickHandler);
    canvas.addEventListener("mousemove", hoverHandler);

    socket.on('initChessboard', function (chessRecord) {
        for (let i = 0; i < chessRecord.colorArr.length; i++) {
            for (let j = 0; j < chessRecord.colorArr[i].length; j++) {
                if (chessRecord.colorArr[i][j]) {
                    let color = chessRecord.colorArr[i][j] === 1 ? "black" : "white"; // Todo: need to change the data structure
                    chessBoard.addChess(i, j, color);
                }
            }
        }
        blackTimer.start({ countdown: true, startValues: { seconds: 60 * 60 * 2 } });
        whiteTimer.start({ countdown: true, startValues: { seconds: 60 * 60 * 2 } });
        if (chessBoard.color === "black") {
            whiteTimer.pause();
        } else {
            blackTimer.pause();
        }

    });

    socket.on("opponentDeathStone", function (chessArr) {
        chessBoard.chessArr.forEach((row, i) => {
            row.forEach((chess, j) => {
                chess.displayColor = chessArr[i][j].displayColor;
            })
        });

        chessBoard.renderNewChessboard();
    });

    socket.on('deathStoneConsensusReq', function () {
        displayStatus("Your opponent wants to reach consensus about the dead stone", "#status", "alert-light",
            "<h4>Consensus?</h4>",
            `<button class="btn btn-outline-success btn-sm" data-dismiss="alert" id="deathStoneConsensusAccepted" type="button">Accept</button>
                <button class="btn btn-outline-danger btn-sm" data-dismiss="alert" id="deathStoneConsensusDeclined" type="button">Decline</button>`
        );

        document.getElementById("deathStoneConsensusAccepted").addEventListener("click", function (e) {
            let cleanedChessboard = chessBoard.getCleanChessboard();
            socket.emit('deathStoneFinished', cleanedChessboard);
        });
        document.getElementById("deathStoneConsensusDeclined").addEventListener("click", function (e) {
            displayStatus("Please select the death stone", "#status", "alert-light",
                `<h4 class="alert-heading">Judge phase</h4>`,
                `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">That's all dead stones for both players</button>
            
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger">I want to keep playing</button>
            `);
            socket.emit('deathStoneConsensusDeclined');
            document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
                displayStatus(`Waiting for your opponent to respond... 
                             <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");

                socket.emit('deathStoneConsensusReq');
            });

        });

    });

    socket.on('deathStoneConsensusDeclined', function () {
        displayStatus("<p class='text-danger'>Your opponent declined your request, please select the death stone</p>", "#status", "alert-light",
            `<h4 class="alert-heading">Judge phase</h4>`,
            `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">That's all dead stones for both players</button>
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger">I want to keep playing</button>
            `);
        document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
            displayStatus(`Waiting for your opponent to respond... 
                         <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");

            socket.emit('deathStoneConsensusReq');
        });
    })




    socket.on("judgePhase", function () {
        chessArrCopy = chessBoard.chessArr;
        displayStatus("Please select the death stone", "#status", "alert-light",
            `<h4 class="alert-heading">Judge phase</h4>`,
            `<hr><button id="deathStoneFinished" class="btn btn-sm btn-outline-warning">That's all dead stones for both players</button>
            
                <button id="exitDeathStoneMode" class="btn btn-sm btn-outline-danger">I want to keep playing</button>
            `);
        canvas.removeEventListener("click", chessBoardClickHandler);
        canvas.addEventListener("click", chessBoardSelectDeathStoneHandler);
        canvas.removeEventListener("mousemove", hoverHandler);
        canvas.addEventListener("mousemove", deathStoneHandler);
        document.getElementById("deathStoneFinished").addEventListener("click", function (e) {
            displayStatus(`Waiting for your opponent to respond... 
                     <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");

            socket.emit('deathStoneConsensusReq');
        });
    })

    socket.on('judgeReqDeclined', function () {
        displayStatus(`Your opponent declined your request
         <button class="close" type="button" data-dismiss="alert">
            <span>×</span>
        </button>`, "#status", "alert-danger alert-dismissible",
        );
    })


    socket.on("opponentDrawReq", function () {

    })

    socket.on("opponentLeft", function () {
        displayStatus("Your opponent just left, please wait for <time id='opponentLeftTimer'>5</time>", "#status", "alert-danger");

        const opponentLeftTimer = new easytimer.Timer();
        opponentLeftTimer.start({ countdown: true, startValues: { seconds: 300 } });
        $('#opponentLeftTimer').html(opponentLeftTimer.getTimeValues().toString());
        opponentLeftTimer.addEventListener('secondsUpdated', function (e) {
            $('#opponentLeftTimer').html(opponentLeftTimer.getTimeValues().toString());
        });
        opponentLeftTimer.addEventListener('targetAchieved', function (e) {
            displayStatus("<p>You won the game, your opponent has timed out<p>",
                "#status", "alert-success", `<h4 class="alert-heading">Congratulations!</h4>`);
        })
    })

    socket.on('opponentJudgeReq', function () {
        displayStatus(`<p>Your opponent asked for judging</p>`,
            "#status", "alert-light", '<h4 class="alert-heading">Judge Request</h4>',
            `<button class="btn btn-outline-success btn-sm" data-dismiss="alert" id="judgeReqAccept" type="button">Accept</button>
                <button class="btn btn-outline-danger btn-sm" data-dismiss="alert" id="judgeReqDecline" type="button">Decline</button>`);

        document.getElementById("judgeReqAccept").addEventListener('click', function () {
            socket.emit('judgeReqAnswer', true);
        });

        document.getElementById("judgeReqDecline").addEventListener('click', function () {
            socket.emit('judgeReqAnswer', false);
        });
    })

    // socket.on("blackWin", function (blackspaces, whitespaces) {
    //     if (chessBoard.color === "black") {
    //         displayMessage(`< p > You won the game, blackspaces: <strong>${blackspaces}</strong>, whitespaces: <strong>${whitespaces}</strong> <p>`,
    //             ".message", "alert-success", `<h4 class="alert-heading">Congratulations!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
    //     } else {
    //         displayMessage(`<p>You lost the game, blackspaces:<strong>${blackspaces}</strong>, whitespaces:<strong>${whitespaces}</strong><p>`,
    //             ".message", "alert-danger", `<h4 class="alert-heading">Sorry!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
    //     }

    // })
    // socket.on("whiteWin", function (blackspaces, whitespaces) {
    //     if (chessBoard.color === "white") {
    //         displayMessage(`<p>You lost the game, blackspaces:<strong>${blackspaces}</strong>, whitespaces:<strong>${whitespaces}</strong><p>`,
    //             ".message", "alert-danger", `<h4 class="alert-heading">Sorry!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
    //     } else {
    //         displayMessage(`<p>You lost the game, blackspaces:<strong>${blackspaces}</strong>, whitespaces:<strong>${whitespaces}</strong><p>`,
    //             ".message", "alert-danger", `<h4 class="alert-heading">Sorry!</h4>`, '<hr><button class="btn btn-primary">Play again?</button>');
    //     }
    // })

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
        chessBoard.renderNewChessboard(); // this prevents a chess being drawn when the cursor leaves the chessBoard
    });


    function initTimer() { // The timer is loaded in timer.ejs file
        $('#timer-b #time-1').html(blackTimer.getTimeValues().toString());
        blackTimer.addEventListener('secondsUpdated', function (e) {
            $('#timer-b #time-1').html(blackTimer.getTimeValues().toString());
        });
        blackTimer.addEventListener('targetAchieved', function (e) {
            $('#timer-b #time-1').html('KABOOM!!');
        });
        $('#timer-w #time-2').html(whiteTimer.getTimeValues().toString());
        whiteTimer.addEventListener('secondsUpdated', function (e) {
            $('#timer-w #time-2').html(whiteTimer.getTimeValues().toString());
        });
        whiteTimer.addEventListener('targetAchieved', function (e) {
            $('#timer-w #time-2').html('KABOOM!!');
        });
    }

    initTimer();


    // canvas.addEventListener("mousemove", function (event) {
    //     chessBoard.hover(event);
    // });

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
