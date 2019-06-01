import { searchingPlayer } from './helper/FrontendHelper.js'

let socket = io();

$("#automatch").click(function () {

    searchingPlayer();

    socket.close();
    socket = io.connect('/auto-match-level-1');
    socket.emit('join');
    socket.emit('matchmaking');

    socket.on('matchReady', room_id => {
        window.location.href = `rooms/${room_id}`;
        socket.emit('gameBegin', room_id);

    });



    // change the url without reloading
    // this url cannot be bookmarked




    // setTimeout(function () {
    //     $('.progress').remove();
    //     $('strong').text('Player found');
    //     $('.alert-dismissible').addClass('alert-success').removeClass('alert-primary');
    // }, 1000);

});