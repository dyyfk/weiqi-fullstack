const LINES = 19;
import Chess from "./chess.js";
export default class Chessboard {
    constructor(
        interval,
        chessRadius,
        canvas,
        width,
        height,
        color,
        originX,
        originY,
        margin
    ) {
        this.canvas = canvas;
        this.interval = interval; // interval between chess to chess
        this.chessArr = [...Array(LINES)].map(e => Array(LINES));
        this.chessRadius = chessRadius; // Todo: this should be dynamically caculated
        this.width = width;
        this.height = height;
        this.color = color || null;
        this.originX = originX || 0;
        this.originY = originY || 0;
        this.margin = margin || 20;
    }
    setColor(color) {
        this.color = color;
    }
    addChess(i, j, color) {
        if (i < 0 || i >= LINES || j < 0 || j >= LINES) {
            throw "cannot place chess outside the chessBoard";
        }
        // Todo: here should have a more complex algorithm for determing the validity of the chess
        if (!this.chessArr[i][j]) {
            this.chessArr[i][j] = new Chess(
                this.originX + this.margin + this.interval * i,
                this.originY + this.margin + this.interval * j,
                this.chessRadius, color, i, j
            );
        }
        this.renderNewChessboard();
    }

    update(mouse) {
        let x = mouse.x - this.originX;
        let y = mouse.y - this.originY;
        //TODO: this method has some performace issues
        for (let i = 0; i < this.chessArr.length; i++) {
            for (let j = 0; j < this.chessArr[i].length; j++) {
                let chessX = this.margin + this.interval * i;
                let chessY = this.margin + this.interval * j;
                if (
                    y - chessY < this.interval / 2 &&
                    y - chessY > -this.interval / 2 &&
                    x - chessX < this.interval / 2 &&
                    x - chessX > -this.interval / 2
                ) {
                    let chess = new Chess(chessX, chessY, this.chessRadius, this.color, i, j);
                    return chess;
                }
            }
        }
    }

    drawChessBoard() {
        this.canvas.save();

        //draw the outter line
        this.canvas.fillStyle = "#000000";
        this.canvas.lineWidth = 2;

        this.canvas.beginPath();
        this.canvas.moveTo(this.margin, this.margin);
        this.canvas.lineTo(this.margin, this.height - this.margin);
        this.canvas.lineTo(this.width - this.margin, this.height - this.margin);
        this.canvas.lineTo(this.width - this.margin, this.margin);
        this.canvas.lineTo(this.margin, this.margin);

        //draw the inner line
        for (let i = 1; i < 18; i++) {
            this.canvas.moveTo(this.margin + this.interval * i, this.margin);
            this.canvas.lineTo(
                this.margin + this.interval * i,
                this.height - this.margin
            );
        }
        for (let i = 1; i < 18; i++) {
            this.canvas.moveTo(this.margin, this.margin + this.interval * i);
            this.canvas.lineTo(
                this.width - this.margin,
                this.margin + this.interval * i
            );
        }
        this.canvas.stroke();

        this.canvas.restore();
    }
    renderNewChessboard(chessArr) {
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.drawChessBoard();
        this.drawStar();
        if (chessArr) {
            this.chessArr = [...Array(LINES)].map(e => Array(LINES)); // wipe out the old chessArr to display the new chess
            for (let i = 0; i < chessArr.length; i++) {
                for (let j = 0; j < chessArr[i].length; j++) {
                    if (chessArr[i][j]) {
                        let chessX = this.margin + this.interval * i;
                        let chessY = this.margin + this.interval * j;
                        let color = chessArr[i][j] === 1 ? 'black' : 'white';
                        this.chessArr[i][j] = new Chess(chessX, chessY, this.chessRadius, color, i, j);
                    }
                }
            }
        }


        this.drawAllChess();
    }

    drawStar() {
        let starRadius = 5;
        for (let i = 3; i <= 15; i += 6) {
            for (let j = 3; j <= 15; j += 6) {
                this.canvas.beginPath();
                this.canvas.arc(
                    this.margin + this.interval * i,
                    this.margin + this.interval * j,
                    starRadius,
                    Math.PI * 2,
                    false
                );
                this.canvas.fill();
                this.canvas.closePath();
            }
        }

        this.canvas.stroke();
    }
    drawAllChess() {
        for (let i = 0; i < this.chessArr.length; i++) {
            for (let j = 0; j < this.chessArr[i].length; j++) {
                if (this.chessArr[i][j]) {
                    this.drawChess(this.chessArr[i][j]);
                }
            }
        }
    }
    drawChess(chess) {
        this.canvas.save();

        this.canvas.fillStyle = chess.color;
        this.canvas.strokeStyle = chess.color;
        this.canvas.beginPath();
        this.canvas.arc(chess.x, chess.y, chess.radius, Math.PI * 2, false);
        this.canvas.stroke();
        this.canvas.fill();
        this.canvas.closePath();
        this.canvas.stroke();

        this.canvas.restore();
    }
    drawHoverChess(chess) {
        this.canvas.save();

        this.canvas.shadowBlur = 10;
        this.canvas.shadowColor = "#88B7B5"; // the shadow around the hovering chess
        this.canvas.globalAlpha = 0.6;
        this.canvas.strokeStyle = "#45B7B5";
        this.drawChess(chess);

        this.canvas.restore();
    }
    drawCursor(stone) {
        this.canvas.save();
        // Set cursor color
        if (this.color === 'black')
            this.canvas.strokeStyle = '#ddd';
        else if (this.color === 'white')
            this.canvas.strokeStyle = '#333';
        // Set stroke width
        this.canvas.lineWidth = 3;
        // Draw path
        this.canvas.beginPath();
        this.canvas.moveTo(stone.x + stone.radius / 2, stone.y);
        this.canvas.lineTo(stone.x - stone.radius / 2, stone.y);
        this.canvas.moveTo(stone.x, stone.y - stone.radius / 2);
        this.canvas.lineTo(stone.x, stone.y + stone.radius / 2);
        this.canvas.closePath();
        this.canvas.stroke();

        this.canvas.restore();
    }

    getJointChess(chess) {
        const joinedChess = [];

        // let color = undefined;
        // if (chess.color === 1)
        //      color = 'black';
        // else if (chess.color === -1)
        //      color = 'white';
        this.getJointChessHelper(chess.row, chess.col, chess.color, joinedChess);
        return joinedChess;
    }
    getJointChessHelper(x, y, color, joinedChess) {
        if (!this.chessArr[x][y]) return; // no chess here
        else if (this.chessArr[x][y].color !== color) return; // not the same color 
        else if (joinedChess.includes(this.chessArr[x][y])) return; // visited

        if (this.chessArr[x][y].color === color) {
            joinedChess.push(this.chessArr[x][y]);

            // same chess, recursive case
            if (x - 1 >= 0 && !joinedChess.some((chess) => chess.x === x - 1 && chess.y === y)) {
                this.getJointChessHelper(x - 1, y, color, joinedChess);
            }
            if (x + 1 < LINES && !joinedChess.some((chess) => chess.x === x + 1 && chess.y === y)) {
                this.getJointChessHelper(x + 1, y, color, joinedChess);
            }
            if (y - 1 >= 0 && !joinedChess.some((chess) => chess.x === x && chess.y === y - 1)) {
                this.getJointChessHelper(x, y - 1, color, joinedChess);
            }
            if (y + 1 < LINES && !joinedChess.some((chess) => chess.x === x && chess.y === y + 1)) {
                this.getJointChessHelper(x, y + 1, color, joinedChess);
            }

        }
    }
    click(mouse) {
        let chess = this.update(mouse);
        return chess;
    }
    // hover(mouse) {
    //     let chess = this.update(mouse);
    //     if (chess) {
    //         this.renderNewChessboard();
    //         this.drawHoverChess(chess);
    //         this.drawCursor(chess);
    //     }
    // }

    hover(mouse) {
        let selected = this.update(mouse);
        if (selected) {

            this.renderNewChessboard();
            this.drawHoverChess(selected);
            this.drawCursor(selected);

            const block = this.getJointChess(selected);
            block.forEach(stone => {
                console.log(stone);
                this.drawHoverChess(stone);
            });
            // console.log('above are connected')
        }
    }
}