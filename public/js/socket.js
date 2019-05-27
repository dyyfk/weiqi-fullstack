const socket = io();

socket.on('connect', function () {
    let url = new URL(window.location.href);
    let path = url.pathname;
    let room_id = path.replace('/rooms/', '');

    socket.emit('join', room_id);

    socket.on('updateUsersList', function (users, clear) {
        // TODO: users here contain password field, which is not good

        let dom = $('#user-list');

        users.forEach((user, i) => {
            let html = `
            <div class="d-flex">
                <img class="img-circle"
                    src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"
                    alt="User Pic">
                    <div class="col-md-10 col-lg-10">
                        <strong>${user.name}</strong><br>
                            <span class="text-muted">User level: Administrator</span>
                            <span href="#collapse-${user._id}" data-toggle="collapse" data-parent="#user-list"><i
                                class="fa fa-chevron-down text-muted"></i>
                            </span>
                </div>
            </div>

            <div class="card-block collapse mt-1" id="collapse-${user._id}">
                <div class="card border-secondary mb-3" style="max-width: 18rem;">
                    <div class="card-header">User information</div>
                        <div class="card-body text-secondary">
                            <h5 class="card-title">Secondary card title</h5>

                            <img class="img-circle"
                                src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100"
                                alt="User Pic">
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                                card's content.</p>
                        </div>
                </div>
            </div>`;
            // 看到以上代码后我才开始认真考虑要不要使用框架
            dom.append(html);
        });


        // $('.container p.message').remove();
        // if (users.error != null) {
        //     $('.container').html(`<p class="message error">${users.error}</p>`);
        // } else {
        //     app.helpers.updateUsersList(users, clear);
        // }
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