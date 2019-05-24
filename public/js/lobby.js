
let data = [];
Array.from(rooms.children).forEach(room => {
    data.push(room.innerText);
});

$(':text').on('input', function (e) {
    // 我他妈真的服了这个傻逼JQuery
    e.preventDefault();

    let room_text = $('#room-title').val();
    let matches = data.filter(datum => {
        const regex = new RegExp(`${room_text}`, 'gi');
        return datum.match(regex);
    });

    if (room_text.length === 0) {
        outputhtml(data);  //display all data
    } else {
        outputhtml(matches);
    }


    // let info = { room, player };
    // socket.emit('join', info, function (err) {
    //    // if (err) {
    //    //     window.location.href = '/';
    //    //     alert(err);
    //    // }

    // }
    // );
});

outputhtml = matches => {
    let player = $('#rooms');
    if (matches.length > 0) {
        player.html('');
        player.append('<ul>');
        matches.map((match) => {
            let html = `<li class="list-group-item"><a href="/room">
            ${match}</a></li>`;
            player.append(html);
        });
        player.append('</ul>');
    } else {
        player.html('<h3 class="my-3">No rooms were found </h3>');
    }
};