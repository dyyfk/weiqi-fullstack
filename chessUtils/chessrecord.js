const LINES = 19;
const BLACK = 1, WHITE = -1;

class ChessRecord {
    constructor() {
        this.nextRound = BLACK; // black first
        this.colorArr = [...Array(LINES)].map(e => Array(LINES));
        this.joinedChess = []; // this is a temp variable that should only be used when calculating the joined chess
        this.ko = null; // "da jie" in Chinese
    }
    switchPlayer() {
        this.nextRound = this.nextRound * -1;
    }
    addChess(x, y, color) {
        return new Promise((resolve, reject) => {
            if (x < 0 || x >= this.colorArr.length || y < 0 || y >= this.colorArr.length) {
                return reject('Cannot place chess outside the chessboard');
            }
            if (this.colorArr[x][y]) {
                return reject('Cannot place chess on an existed one');
            }
            if (this.nextRound !== color) {
                return reject('It is another players round');
            }

            this.colorArr[x][y] = color; // assign color first so it is easier to count escape
            let capturedChess = this.determineCapture(x, y, color); // capture case
            if (capturedChess.length === 1) {
                let capturedX = capturedChess[0].x;
                let capturedY = capturedChess[0].y;
                if (this.ko && this.ko.x === capturedX && this.ko.y === capturedY) {
                    this.colorArr[x][y] = null;
                    return reject('ko(da jie), cannot place a chess in this position');
                }
            }
            capturedChess.forEach((chess) => {
                let x = chess.x;
                let y = chess.y;
                this.colorArr[x][y] = null; // mark the captured chess as undefined
            });
            let escape = this.calculateEscape(x, y, color);
            if (capturedChess.length === 1 && escape === 1 && this.joinedChess.length === 1) {
                // ko (da jie) situation
                this.ko = this.joinedChess[0];
            } else {
                this.ko = null;
            }
            let valid = this.determineValid(x, y, color);
            if (!valid) {
                this.colorArr[x][y] = null;
                return reject('No escape, Cannot place chess here');
            }
            this.switchPlayer();

            return resolve(this.colorArr);
        })
    }

    judge() {
        let blackArr = [];
        let whiteArr = [];
        let blanks = [];
        for (let i = 0; i < this.colorArr.length; i++) {
            for (let j = 0; j < this.colorArr[i].length; j++) {
                if (this.colorArr[i][j] === BLACK) {
                    blackArr.push({ x: i, y: j });
                } else if (this.colorArr[i][j] === WHITE) {
                    whiteArr.push({ x: i, y: j });
                } else {
                    // blank.push(this.chessArr[i][j]);
                    // blank.forEach((chess) => {
                    blanks = this.judgeHelper(i, j, []);

                    // blanks = blanks.map(blank => blank.color);
                    console.log(blanks);
                    // });
                }
            }
        }
    }

    judgeHelper(x, y, blanks) {
        if (x < 0 || x >= this.colorArr.length || y < 0 || y >= this.colorArr[x].length) {
            return blanks;
        } else if (blanks.some((blank) => blank.x === x && blank.y === y)) {
            return blanks;
        }
        if (!this.colorArr[x][y]) {
            blanks.push({ x: x, y: y, color: null }); // null means the space being captured
        } else {
            blanks.push({ x: x, y: y, color: this.colorArr[x][y] }); // pushing colors to the array
        }

        let d = [-1, 1];
        for (let i = 0; i < d.length; i++) {
            for (let j = 0; j < d.length; j++) {
                this.judgeHelper(x + d[i], y + d[j], blanks);
            }
        }

    }

    determineValid(x, y, color) {
        this.joinedChess = [];
        let escape = this.escapeHelper(x, y, color, 0);
        return escape !== 0;
        // if a chess is surrounded

    }
    determineCapture(x, y, color) {
        color = color * -1;

        let joinedChess = [];
        if (x - 1 >= 0 && this.colorArr[x - 1][y] === color) {
            let escape = this.calculateEscape(x - 1, y, color);

            if (escape === 0) {
                joinedChess.push(...this.joinedChess);
            }
        }
        if (x + 1 < LINES && this.colorArr[x + 1][y] === color) {
            let escape = this.calculateEscape(x + 1, y, color);

            if (escape === 0) {
                joinedChess.push(...this.joinedChess);
            }
        }
        if (y - 1 >= 0 && this.colorArr[x][y - 1] === color) {
            let escape = this.calculateEscape(x, y - 1, color);

            if (escape === 0) {
                joinedChess.push(...this.joinedChess);
            }
        }
        if (y + 1 < LINES && this.colorArr[x][y + 1] === color) {
            let escape = this.calculateEscape(x, y + 1, color);

            if (escape === 0) {
                joinedChess.push(...this.joinedChess);
            }
        }
        return joinedChess;

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

    // initChessRecord(colorArr, nextRound) {
    //     if (colorArr) {
    //         if (colorArr.length != LINES) {
    //             return 'Chessrecord lines mismatched';
    //         }
    //         for (let i = 0; i < colorArr.length; i++) {
    //             for (let j = 0; j < colorArr[i].length; j++) {
    //                 if (colorArr[i].length != LINES) {
    //                     return 'Chessrecord lines mismatched';
    //                 }
    //                 addChess(i, j, colorArr[i][j]);
    //             }
    //         }
    //         nextRound();
    //     }
    // }

}

module.exports = ChessRecord;
