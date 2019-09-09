const updatePlayersList = playersInfo => {
    let p1 = playersInfo[0];
    let p2 = playersInfo[1];

    $('#alert-l').removeClass('alert-primary');
    $('#alert-r').removeClass('alert-light')
    if (p1.color === 'black') {
        $('#alert-l').addClass('alert-primary');
        $('#alert-r').addClass('alert-light');
    } else {
        $('#alert-r').addClass('alert-primary');
        $('#alert-l').addClass('alert-light');
    }
    $('#label-l').html(`<span>${p1.name}</span>`);
    $('#label-r').html(`<span>${p2.name}</span>`);
};

const updateUsersList = (users) => {
    let dom = $('#user-list');
    let ul = $('<ul class="list-group overflow-auto" style="max-height:20vh;"></ul>');

    users.forEach(user => {
        let html = `   
            <li class="list-group-item">${user.name}</li>
        `;
        ul.append(html);
    });

    dom.html(ul);
};

const addMessage = message => {
    const date = (new Date(message.date)).toLocaleString();
    const html = `
    <li class="list-group-item" style="word-break: break-word">
        <div class="header">
          <strong class="primary-font">${message.username}</strong>
          <small class="pull-right text-muted"><i class="far fa-clock"></i>${date}</small>
        </div>
        <p class="mb-0 w-100" id="text-area">${message.content}</p>
    </li> `;
    $(html).hide().appendTo('#chat-history').slideDown(200);
    // $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight }, 1000);

};

const displayStatus = (message, endPoint, className = "", title = "", footer = "", ) => {
    const html = `
    <div class="alert ${className}">
        ${title}
        ${message}
        ${footer}
    </div>`;

    $(endPoint).html(html);
}

const errorMessage = error => {
    let html = `
    <div class="alert alert-warning alert-dismissible fixed-top">
        <strong>Warning</strong>${error}
        <span>In most cases, refreshing the page could resolve the issues</span>
    </div>`;
    $('.container').append(html);
};

let func;
const invalidMoveMessage = err => {
    $(".fixed-top").html('');
    $("body").append(`<span class="fixed-top errormsg ml-2">${err}</span>`);
    clearTimeout(func);
    func = setTimeout(() => {
        $('.errormsg').hide();
    }, 2000);
}
const displaywaitingMsg = function () {
    displayStatus(`waiting for your opponent... 
        <i class="fa fa-spinner fa-pulse fa-fw"></i>`, "#status", "alert-info");
}

const sendMessage = function (name) {
    let messageContent = $('#text-meg').val().trim();
    if (messageContent !== '') {
        let message = {
            content: messageContent,
            username: name,
            date: Date.now()
        };
        $('#text-meg').val('');
        return message;
    }
}

export {
    updateUsersList,
    updatePlayersList,
    addMessage,
    errorMessage,
    displayStatus,
    invalidMoveMessage,
    displaywaitingMsg,
    sendMessage
};
