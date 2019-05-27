import { updateUsersList, addMessage } from "./helper/FrontendHelper.js";

const socket = io();

socket.on('connect', function () {
    let url = new URL(window.location.href);
    let path = url.pathname;
    let room_id = path.replace('/rooms/', '');
    let curUser;
    socket.emit('join', room_id);

    socket.on('updateUsersList', function (users, clear) {
        // TODO: users here contain password field, which is not good

        // $('.container p.message').remove();
        if (users.error != null) {
            $('.container').html(`<p class="message error">${users.error}</p>`);
        } else {
            updateUsersList(users);
        }



        curUser = users[users.length - 1];
        // I think this is buggy but I do know how to return the current user from the backend
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
// socket.on('waitingPlayer', (message) => {
//     alert(message);
// });


socket.on('disconnect', function () {
    console.log('Connection lost');
});