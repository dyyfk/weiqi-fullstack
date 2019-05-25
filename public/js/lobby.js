
let data = [];

Array.from(rooms.children).forEach(room => {
    data.push({ text: room.innerText, html: room.innerHTML });
});

$(':text').on('input', function (e) {
    // 我他妈真的服了这个傻逼JQuery
    e.preventDefault();

    let room_text = $('#room-title').val();
    let matches = data.filter(datum => {
        const regex = new RegExp(`${room_text}`, 'gi');
        return datum.text.match(regex);
    });

    if (room_text.length === 0) {
        outputhtml(data);  //display all data
    } else {
        outputhtml(matches);
    }
});

outputhtml = matches => {
    let rooms = $('#rooms');
    if (matches.length > 0) {
        rooms.html('');
        rooms.append('<ul>');
        matches.map((match) => {
            let html = `<li class="list-group-item">${match.html}</li>`;
            rooms.append(html);
        });
        rooms.append('</ul>');
    } else {
        rooms.html('<h3 class="my-3">No rooms were found </h3>');
    }
};