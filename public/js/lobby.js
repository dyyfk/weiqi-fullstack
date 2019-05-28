import { updateRoomsList } from "./helper/FrontendHelper.js";

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
        updateRoomsList(data);  //display all data
    } else {
        updateRoomsList(matches);
    }
});

