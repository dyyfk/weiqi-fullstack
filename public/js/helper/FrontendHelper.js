const updateUsersList = (users) => {
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
};

const addMessage = message => {
    const date = (new Date(message.date)).toLocaleString();
    const html = `
    <li class="list-group-item">
      <div class="header">
        <strong class="primary-font">${message.username}</strong>
        <small class="text-muted"><i class="far fa-clock"></i>${" " + date}</small>
      </div>
      <p class="mb-0 w-100" id="text-area">${message.content}</p>
    </li> `;
    $(html).hide().appendTo('#chat-history ul').slideDown(200);
    // $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight }, 1000);

};

const updateRoomsList = matches => {
    let rooms = $('#rooms');
    if (matches.length > 0) {
        rooms.html('');
        rooms.append('<ul>');
        matches.forEach((match) => {
            let html = `<li class="list-group-item">${match.html}</li>`;
            rooms.append(html);
        });
        rooms.append('</ul>');
    } else {
        rooms.html('<h3 class="my-3">No rooms were found </h3>');
    }
};

const errorMessage = error => {
    let html = `
    <div class="alert alert-warning alert-dismissible fixed-top">
        <strong>Warning</strong> ${error}
    </div>`;
    $('.container').append(html);
};

const searchingPlayer = () => {
    $("#automatch").prop('disabled', true);
    let html = `
    <div class="alert alert-primary alert-dismissible">
            <button class="close" type="button" data-dismiss="alert">
                <i class="fas fa-times"></i>
            </button>
            <strong>Finding player...</strong>
            <div class="progress">
                <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" style="width:100%;">
            </div>
        </div>
    </div> 
    `;
    $('.list-group').prepend(html);
    $('.close').click(function () {
        $("#automatch").prop('disabled', false);
    });
};

const foundPlayer = () => {
    $('.progress').remove();
    $('strong').text('Player found');
    $('.alert-dismissible').addClass('alert-success').removeClass('alert-primary');
};

export {
    updateUsersList,
    updateRoomsList,
    addMessage,
    errorMessage,
    searchingPlayer,
    foundPlayer
};
