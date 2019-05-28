// import { getTheRoomId } from './helper/FrontendHelper.js'


let socket = io('http://localhost:3000/automatch/level-1');



$("#automatch").click(function () {



    socket.emit('matchmaking');
});