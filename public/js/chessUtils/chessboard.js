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
        this.chessRadius = chessRadius;
        this.width = width;
        this.height = height;
        this.color = color || null;
        this.originX = originX || 0;
        this.originY = originY || 0;
        this.margin = margin || 20;
        this.latestChess = null;
    }
    setColor(color) {
        this.color = color;
    }
    setLatestChess(i, j) {
        this.latestChess = this.chessArr[i][j]; // BLUE Indicates the latest chess
    }

    addChess(i, j, color) {
        if (i < 0 || i >= LINES || j < 0 || j >= LINES) {
            throw "cannot place chess outside the chessBoard";
        }
        // Todo: here should have a more complex algorithm for determing the validity of the chess
        if (!this.chessArr[i][j]) {
            this.chessArr[i][j] = new Chess(
                this.margin + this.interval * i,
                this.margin + this.interval * j,
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
                    let display = null;
                    if (typeof this.chessArr[i][j] != 'undefined')
                        display = this.chessArr[i][j].displayColor;
                    let chess = new Chess(chessX, chessY, this.chessRadius, this.color, i, j, display);
                    return chess;
                }
            }
        }
    }

    resize() {
        this.chessRadius = 0.45 * this.interval;
        for (let i = 0; i < this.chessArr.length; i++) {
            for (let j = 0; j < this.chessArr[i].length; j++) {
                if (this.chessArr[i][j]) {
                    let chessX = this.margin + this.interval * i;
                    let chessY = this.margin + this.interval * j;
                    this.chessArr[i][j].x = chessX;
                    this.chessArr[i][j].y = chessY;
                    this.chessArr[i][j].radius = this.chessRadius;
                }
            }
        }
        this.renderNewChessboard();
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

        this.canvas.fillStyle = chess.displayColor;
        this.canvas.strokeStyle = chess.color;
        this.canvas.lineWidth = 3;
        this.canvas.beginPath();
        this.canvas.arc(chess.x, chess.y, chess.radius, Math.PI * 2, false);
        this.canvas.stroke();
        this.canvas.fill();
        this.canvas.closePath();
        this.canvas.stroke();

        this.canvas.restore();
    }

    drawChessBoard() {
        this.canvas.save();
        //draw borders
        this.canvas.fillStyle = "#000000";
        this.canvas.lineWidth = 2;
        this.canvas.beginPath();
        this.canvas.moveTo(this.margin, this.margin);
        this.canvas.lineTo(this.margin, this.height - this.margin);
        this.canvas.lineTo(this.width - this.margin, this.height - this.margin);
        this.canvas.lineTo(this.width - this.margin, this.margin);
        this.canvas.lineTo(this.margin, this.margin);
        //draw the inner grids
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
                    if (this.latestChess && this.latestChess == this.chessArr[i][j]) {
                        this.drawCursor(this.latestChess);
                    }
                }
            }
        }
    }
    resize() {
        this.chessRadius = 0.45 * this.interval;
        for (let i = 0; i < this.chessArr.length; i++) {
            for (let j = 0; j < this.chessArr[i].length; j++) {
                if (this.chessArr[i][j]) {
                    let chessX = this.margin + this.interval * i;
                    let chessY = this.margin + this.interval * j;
                    this.chessArr[i][j].x = chessX;
                    this.chessArr[i][j].y = chessY;
                    this.chessArr[i][j].radius = this.chessRadius;
                }
            }
        }
        this.renderNewChessboard();
    }
    drawChess(chess) {
        this.canvas.save();

        this.canvas.fillStyle = chess.displayColor;
        this.canvas.strokeStyle = chess.color;
        this.canvas.lineWidth = 3;
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
        this.canvas.fillStyle = this.color;
        // this.canvas.lineWidth = 1;
        this.canvas.beginPath();
        this.canvas.arc(chess.x, chess.y, chess.radius, Math.PI * 2, false);
        this.canvas.stroke();
        this.canvas.fill();
        this.canvas.closePath();
        this.canvas.stroke();

        this.canvas.restore();
    }

    drawCursor(stone, xCursor = false) {
        this.canvas.save();
        // Set cursor color
        this.canvas.strokeStyle = this.color === 'black' ? '#ddd' : '#333';
        if (stone.displayColor === 'black')
            this.canvas.strokeStyle = '#ddd';
        else if (stone.displayColor === 'white')
            this.canvas.strokeStyle = '#333';
        // Set stroke width
        this.canvas.lineWidth = 3;
        // Draw path
        let shifter = xCursor ? stone.radius / 2 : 0;
        this.canvas.beginPath();
        this.canvas.moveTo(stone.x + stone.radius / 2, stone.y + shifter);
        this.canvas.lineTo(stone.x - stone.radius / 2, stone.y - shifter);
        this.canvas.moveTo(stone.x + shifter, stone.y - stone.radius / 2);
        this.canvas.lineTo(stone.x - shifter, stone.y + stone.radius / 2);
        this.canvas.closePath();
        this.canvas.stroke();

        this.canvas.restore();
    }

    getJointChess(chess) {
        const joinedChess = [];
        this.getJointChessHelper(chess.row, chess.col, chess.color, joinedChess);
        return joinedChess;
    }
    getJointChessHelper(x, y, color, joinedChess) {
        // if (this.chessArr[x][y] === undefined || this.chessArr[x][y] === null) return;
        if (!this.chessArr[x][y]) return; // no stones here
        else if (this.chessArr[x][y].color !== color) return; // not the same color 
        else if (joinedChess.includes(this.chessArr[x][y])) return; // stop when visited

        if (this.chessArr[x][y].color === color) {
            joinedChess.push(this.chessArr[x][y]);

            // same stone, recursive case
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

    getCleanChessboard() {
        return this.chessArr.map(row => {
            return row.map(chess => {
                if (chess.displayColor !== chess.color) {
                    return null;
                } else {
                    return chess.color === "black" ? 1 : -1;
                }
            })
        });
    }

    click(mouse, deathStoneMode = false) {
        let chess = this.update(mouse);
        // console.log(chess);
        // console.log(this.chessArr);
        if (chess) {
            if (deathStoneMode) {
                let block = this.getJointChess(chess);
                // let blockCoordinate = [];
                block.forEach(chess => {
                    if (chess.displayColor === chess.color) {
                        chess.displayColor = "#fff3c800" // Dead stone color
                        // blockCoordinate.push([chess.row, chess.col]);
                    } else {
                        chess.displayColor = chess.color // Users deselect the stone, change back to original color
                    }
                });
                this.renderNewChessboard(); // Render the new board so that chess color changes are immediately applied
                // return blockCoordinate;
            } else {
                return chess;
            }
        }
    }

    hover(mouse, deathStoneMode = false) {
        let selected = this.update(mouse);
        if (selected) {
            if (deathStoneMode) {
                this.renderNewChessboard();
                // Highlight joint stone block
                const block = this.getJointChess(selected);
                block.forEach(stone => {
                    this.drawHoverChess(stone);
                });
                // Draw cursor as X
                this.drawCursor(selected, true);
            } else {
                this.renderNewChessboard();
                // Draw cursor as cross
                if (selected.displayColor == null)
                    this.drawHoverChess(selected);
                this.drawCursor(selected);
            }
        }
    }
}

/* TODO
    1. disable hover on opponent's stones ✅
    2. color display issue when hovering on own stones ✅
    3. Board styling
*/