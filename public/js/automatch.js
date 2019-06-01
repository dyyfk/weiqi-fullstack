import { searchingPlayer, foundPlayer } from './helper/FrontendHelper.js'

let socket = io();

if (!$('#automatch').prop('disabled')) { // when the button is disabled, it is searching for player
    socket.close();
    socket = io.connect('/');
}
$("#automatch").click(function () {
    socket.close();
    socket = io.connect('/auto-match-level-1');
    socket.on('matchReady', room_id => {
        foundPlayer();
        setTimeout(function () {
            window.location.href = `rooms/${room_id}`;
        }, 2000);
    });

    socket.emit('join');
    socket.emit('matchmaking');

    searchingPlayer();
});