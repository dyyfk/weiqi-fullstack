import { updateUsersList, addMessage, errorMessage } from "./helper/FrontendHelper.js";

const socket = io();

socket.on('connect', function () {
    let url = new URL(window.location.href);
    let path = url.pathname;
    let room_id = path.replace('/rooms/', '');
    let curUser;
    socket.emit('join', room_id, function (username) {
        if (username.error) { errorMessage(username.error); }
        curUser = username;
    });

    socket.on('updateUsersList', function (users, clear) {
        // TODO: users here contain password field, which is not good

        // $('.container p.message').remove();
        if (users.error != null) {
            errorMessage(users.error);
        } else {
            updateUsersList(users);
        }
    });


    socket.on('addMessage', function (message) {
        addMessage(message);
    });

    $(document).on("keydown", "#sendMsgArea", function (e) {
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

// let info = {room, player };
// socket.emit('join', info, function (err) {

//     // if (err) {
//     //     window.location.href = '/';
//     //     alert(err);
//     // }

// }
// );


socket.on('disconnect', function () {
    console.log('Connection lost');
});