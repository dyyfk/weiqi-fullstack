const socket = io();

socket.on('connect', function () {
    // socket.emit('join', roomId);
    let url = new URL(window.location.href);
    let path = url.pathname;
    let room_id = path.replace('/rooms/', '');

    socket.emit('join', room_id);

    // socket.on('updateUsersList', function (users, clear) {

    //     $('.container p.message').remove();
    //     if (users.error != null) {
    //         $('.container').html(`<p class="message error">${users.error}</p>`);
    //     } else {
    //         app.helpers.updateUsersList(users, clear);
    //     }
    // });



    // console.log('Connected to server');
});

// let info = { room, player };
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