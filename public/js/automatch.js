// import { getTheRoomId } from './helper/FrontendHelper.js'


let socket = io('http://localhost:3000/automatch/level-1');

$("#automatch").click(function () {
    socket.emit('matchmaking');

    $("#automatch").prop('disabled', true);

    let html = `
    <div class="alert alert-primary alert-dismissible">
            <button class="close" type="button" data-dismiss="alert">
                <i class="fas fa-times"></i>
            </button>
            <strong>Finding player...</strong>
            <div class="progress">
                <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" style="width:100%;">
            </div>
        </div>
    </div> 
    `;
    $('.list-group').prepend(html);





    setTimeout(function () {
        $('.progress').remove();
        $('strong').text('Player found');
        $('.alert-dismissible').addClass('alert-success').removeClass('alert-primary');
    }, 1000);

});