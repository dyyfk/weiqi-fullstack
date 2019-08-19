import { updateUsersList, updatePlayersList, addMessage, errorMessage, displayStatus } from './helper/FrontendHelper.js';
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
            let matchsocket = io.connect('/matchroom');
            initChessEvent(color);
            initGameEvent(matchsocket);
        }
    });
    console.log('Connected to server');
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
    updatePlayersList(playersInfo);
});


//Todo: this route is for the future error handling.
socket.on('errors', error => {
    errorMessage(error);
})

socket.on('addMessage', message => {
    addMessage(message);
});

$(document).on("keydown", "#sendMsgArea", e => {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
        const textareaEle = $("textarea[name='sendMsgArea']");
        const messageContent = textareaEle.val().trim();

        if (messageContent !== '') {
            let message = {
                content: messageContent,
                username: curUser.name,
                date: Date.now()
            };

            socket.emit('newMessage', room_id, message);
            textareaEle.val('');
            addMessage(message);
        }
    }
});


socket.on('disconnect', () => {
    console.log('Connection lost from the server');
});




