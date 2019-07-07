import { updateUsersList, addMessage, errorMessage } from './helper/FrontendHelper.js';
import { initSocketEvent, initChessEvent } from './chessroom.js'

$(document).ready(() => {
    let socket = io();
    socket.on('connect', () => {
        let url = new URL(window.location.href);
        let path = url.pathname;
        let room_id = path.replace('/rooms/', '');
        let curUser = 'Loading ...'; // This will be displayed if the database takes longer to respond
        socket.emit('join', room_id);

        socket.on('updateUsersList', (users, currentUser) => {
            curUser = currentUser;
            if (users) {
                updateUsersList(users, currentUser);
            }
        });



        let testcolor; // TDOO: this is for testing the chessboard purpose, the socket io implementation is still buggy
        socket.on('gameBegin', (color) => {
            let matchsocket = io.connect('/matchroom');
            testcolor = color;
            initChessEvent(testcolor);
            initSocketEvent(matchsocket);
        })

        //Todo: this route is for the future error handling.
        socket.on('errors', error => {
            errorMessage(error);
        })

        socket.on('playerDisconnect', () => {
            $(".chessBoard").effect("shake", "slow");
            //Todo: add message to inform the user has left.
        });
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

        console.log('Connected to server');
    });



    socket.on('disconnect', () => {
        console.log('Connection lost');
    });


})

