const updateUsersList = (users, domElement) => {
    const dom = $(domElement);

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
    message.date = (new Date(message.date)).toLocaleString();
    message.username = this.encodeHTML(message.username);
    message.content = this.encodeHTML(message.content);
    let html = `<li>
    <div class="message-data">
      <span class="message-data-name">${message.username}</span>
      <span class="message-data-time">${message.date}</span>
    </div>
    <div class="message my-message" dir="auto">${message.content}</div>
  </li>`;

    // console.log(html);
    $(html).hide().appendTo('.chat-history ul').slideDown(200);
};

const updateRoomsList = matches => {
    const rooms = $('#rooms');
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


export {
    updateUsersList,
    updateRoomsList,
    addMessage,
};

