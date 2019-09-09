import { updateUsersList, updatePlayersList, addMessage, errorMessage, displayStatus, displaywaitingMsg, sendMessage } from './helper/FrontendHelper.js';
import { initSocketEvent, initChessEvent, initGameEvent } from './chessroom.js'

let socket = io({ transports: ['websocket'], upgrade: false });
let curUser; // This will be displayed if the database takes longer to respond
let room_id;
socket.on('connect', () => {
    const url = new URL(window.location.href);
    const path = url.pathname;
    room_id = path.replace('/rooms/', '');

    socket.emit('join', room_id, function (color) {
        initSocketEvent(socket);
        if (color) { // if color is present, the game has begun
            // if (newlyCreated) {
            //     $('#rule').modal(); // This comes from roleModal.ejs file 
            //     document.getElementById('ruleAccepted').addEventListener('click', function () {
            //         socket.emit('gameRuleAccepted');
            //         displaywaitingMsg();
            //     });
            //     document.getElementById('ruleDeclined').addEventListener('click', function () {
            //         socket.emit('gameAbort');
            //     });
            // }

            let matchsocket = io.connect('/matchroom');
            initChessEvent(color);
            initGameEvent(matchsocket);
        }
    });
    console.log('Connected to server');
});


socket.on('gameResult', result => {
    displayStatus(`${result}`, '#status', 'alert-primary', '<h4 class="alert-heading">Game result</h4>');
});

socket.on('blackWin', (blackspaces, whitespaces) => {
    displayStatus(`<p>blackspaces:<strong>${blackspaces}</strong>, whitespaces:<strong>${whitespaces}</strong><p>`,
        "#status", "alert-light", `<h4 class="alert-heading">black wins the game</h4>`);
});


socket.on('whiteWin', (blackspaces, whitespaces) => {
    displayStatus(`<p>blackspaces:<strong>${blackspaces}</strong>, whitespaces:<strong>${whitespaces}</strong><p>`,
        "#status", "alert-light", `<h4 class="alert-heading">white wins the game</h4>`);
})



socket.on('updateUsersList', (users, latestJoined) => {
    if (!curUser) { curUser = latestJoined; } // the latestJoined is self
    if (users) {
        updateUsersList(users, latestJoined);
    }
});


socket.on('updatePlayersList', playersInfo => {
    if (playersInfo.length > 0) {
        updatePlayersList(playersInfo);
    }
});


//Todo: this route is for the future error handling.
socket.on('errors', error => {
    errorMessage(error);
})

socket.on('addMessage', message => {
    addMessage(message);
});


document.getElementById('send-meg').addEventListener('click', function (e) {
    let message = sendMessage(curUser.name);
    if (message) {
        socket.emit('newMessage', room_id, message);
        addMessage(message);
    }
});

document.getElementById('message-post').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        let message = sendMessage(curUser.name);
        if (message) {
            socket.emit('newMessage', room_id, message);
            addMessage(message);
        }
    }
});

socket.on('disconnect', () => {
    console.log('Connection lost from the server');
});