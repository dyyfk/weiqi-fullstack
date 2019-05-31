import { updateUsersList, addMessage, errorMessage } from "./helper/FrontendHelper.js";

const socket = io();
socket.on('connect', function () {
    let url = new URL(window.location.href);
    let path = url.pathname;
    let room_id = path.replace('/rooms/', '');
    let curUser = 'Loading ...'; // 
    socket.emit('join', room_id);

    socket.on('updateUsersList', (users, currentUser) => {
        curUser = currentUser;

        console.log(users, currentUser)


        if (users) {
            updateUsersList(users, currentUser);
        }
    });


    //Todo: this route is for the future error handling.
    socket.on('errors', (error) => {
        alert(error)
    })


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

socket.on('disconnect', function () {
    console.log('Connection lost');
});