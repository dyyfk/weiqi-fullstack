import { searchingPlayer } from './helper/FrontendHelper.js'


let socket = io('http://localhost:3000/automatch/level-1');

$("#automatch").click(function () {
    socket.emit('matchmaking');

    searchingPlayer();





    // setTimeout(function () {
    //     $('.progress').remove();
    //     $('strong').text('Player found');
    //     $('.alert-dismissible').addClass('alert-success').removeClass('alert-primary');
    // }, 1000);

});