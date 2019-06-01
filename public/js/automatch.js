import { searchingPlayer } from './helper/FrontendHelper.js'

let socket = io();

$("#automatch").click(function () {

    searchingPlayer();

    socket.close();
    socket = io.connect('/auto-match-level-1');
    socket.emit('join');
    socket.emit('matchmaking');

    socket.on('matchReady', room_id => {
        $('.progress').remove();
        $('strong').text('Player found');
        $('.alert-dismissible').addClass('alert-success').removeClass('alert-primary');
        setTimeout(function () {
            window.location.href = `rooms/${room_id}`;
            socket.emit('gameBegin', room_id);
        }, 1000);
    });



    // change the url without reloading
    // this url cannot be bookmarked






});