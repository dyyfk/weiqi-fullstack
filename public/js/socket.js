import { updateUsersList, addMessage, errorMessage } from "./helper/FrontendHelper.js";
import { initSocketEvent, initChessEvent } from './chessroom.js'

$(document).ready(() => {
    const socket = io();
    socket.on('connect', () => {
        let url = new URL(window.location.href);
        let path = url.pathname;
        let room_id = path.replace('/rooms/', '');
        let curUser = 'Loading ...'; // 
        socket.emit('join', room_id);

        socket.on('updateUsersList', (users, currentUser) => {
            curUser = currentUser;
            if (users) {
                updateUsersList(users, currentUser);
            }
        });

        socket.on('gameBegin', (color) => {
            initChessEvent(color);
            initSocketEvent(color);
        })


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

        console.log('Connected to server');
    });



    socket.on('disconnect', () => {
        console.log('Connection lost');
    });
})

