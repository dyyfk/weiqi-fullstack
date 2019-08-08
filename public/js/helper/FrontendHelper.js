const updateUsersList = (users) => {
    let dom = $('#user-list');
    dom.html("");

    users.forEach(user => {
        let html = `
        <style>
            #chevron-${user._id} {
                transition: transform .3s
            }

            #chevron-${user._id}.flip{
                transform: rotateZ(-180deg);
            }
        </style>
        <div class="card-block">
            <div class="card border-secondary mb-3">
               
            <div class="d-flex">
                <img class="img-circle rounded"
                src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"
                alt="User Pic">
                <div class="col-md-10 col-lg-10 py-1">
                ${user.color ? `<span id="user-type" class="text-muted">${user.color}</span>` : ``}
                <br>
                    <strong>${user.name}</strong>
                        
                        <span href="#collapse-${user._id}" data-toggle="collapse" data-parent="#user-list">
                        <i class="fa fa-chevron-down text-muted" id="chevron-${user._id}"></i>
                        </span>
                </div>
            </div>
            
            <div class="collapse" id="collapse-${user._id}">
                <div class="card-body text-secondary">
                    <h5 class="card-title">Secondary card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                        card's content.</p>
                </div>
            </div>
            </div>
        </div>
        <script>
            $(document).ready(function () {
                $('#chevron-${user._id}').on('click', function () {
                    $('#chevron-${user._id}').toggleClass('flip');
                });
            });
        </script>
        `;
        // 看到以上代码后我才开始认真考虑要不要使用框架
        dom.append(html);
    });
};

const updatePlayersList = playersInfo => {
    let dom = $('#player-list');
    dom.html("PlayerInfo");

    playersInfo.forEach(player => {
        let html = `
            ${player.name}
            ${player.color}
        `;
        dom.append(html);
    });
}

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
    $(html).hide().prependTo('#chat-history').slideDown(200);
    // $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight }, 1000);

};

const displayMessage = (message, endPoint, className = "", title = "", footer = "", ) => {
    const html = `
    <div class="alert ${className}">
        ${title}
        ${message}
        ${footer}
    </div>`;

    $(endPoint).append(html);
}




const errorMessage = error => {
    let html = `
    <div class="alert alert-warning alert-dismissible fixed-top">
        <strong>Warning</strong> ${error}
    </div>`;
    $('.container').append(html);
};

export {
    updateUsersList,
    updatePlayersList,
    addMessage,
    errorMessage,
    displayMessage
};
