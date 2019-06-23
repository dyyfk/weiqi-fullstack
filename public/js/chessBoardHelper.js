const BLACK = 1, WHITE = -1;

export default class chessBoardHelper {

    constructor(chessArr) {
        this.colorArr = chessArr; // TODO: this one has problem
        this.joinedChess = []; // this is a temp variable that should only be used when calculating the joined chess
    }
    calculateEscape(x, y, color) {
        this.joinedChess = [];  // initialize so that it could count the joined pieces

        let escape = this.escapeHelper(x, y, color, 0);
        return escape;
    }
    escapeHelper(x, y, color, escape, from) {
        if (!this.colorArr[x][y]) {
            escape++; // no chess here
        } else if (this.colorArr[x][y] !== color) {
            return escape; // no the same chess 
        }

        // CODES below are what I wrote like 1 year ago and I do not want to improve it.
        if (this.colorArr[x][y] === color) {
            this.joinedChess.push({ x, y });
            // same chess, recursive case
            if (x - 1 >= 0 && !this.joinedChess.some((chess) => chess.x === x - 1 && chess.y === y)) {
                escape = this.escapeHelper(x - 1, y, color, escape);
            }
            if (x + 1 < LINES && !this.joinedChess.some((chess) => chess.x === x + 1 && chess.y === y)) {
                escape = this.escapeHelper(x + 1, y, color, escape);
            }
            if (y - 1 >= 0 && !this.joinedChess.some((chess) => chess.x === x && chess.y === y - 1)) {
                escape = this.escapeHelper(x, y - 1, color, escape);
            }
            if (y + 1 < LINES && !this.joinedChess.some((chess) => chess.x === x && chess.y === y + 1)) {
                escape = this.escapeHelper(x, y + 1, color, escape);
            }

        }

        return escape;
    }
}