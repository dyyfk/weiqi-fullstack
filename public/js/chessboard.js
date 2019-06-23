const LINES = 19;
import Chess from './chess.js'
export default class Chessboard {
	constructor(interval, chessRadius, canvas, width, height, originX, originY, margin) {
		this.canvas = canvas;
		this.interval = interval; // interval between chess to chess
		this.chessArr = [...Array(LINES)].map(e => Array(LINES));
		this.chessRadius = chessRadius; // Todo: this should be dynamically caculated
		this.width = width;
		this.height = height;
		this.color = color;
		this.originX = originX || 0;
		this.originY = originY || 0;
		this.margin = margin || 20;
		this.init();
	}
	init() {
		// for (let i = 0; i < this.pointArr.length; i++) {
		// 	this.pointArr[i] = new Array(LINES);
		// }
		// for (let i = 0; i < this.chessArr.length; i++) {

		// 	this.chessArr[i] = new Array(LINES);
		// 	for (let j = 0; j < this.chessArr[i].length; j++) {
		// 		let chess = new Chess(this.margin + this.interval * i, this.margin + this.interval * j, this.chessRadius, null);
		// 		this.chessArr[i][j] = chess;
		// 	}
		// }

	}
	addChess(x, y, color) {
		if (x < 0 || x >= LINES || y < 0 || y >= LINES) {
			throw 'cannot place chess outside the chessBoard';
		}
		// Todo: here should have a more complex algorithm for determing the validity of the chess
		if (!this.chessArr[x][y]) {
			this.chessArr[x][y] = new Chess(this.margin + this.interval * x, this.margin + this.interval * y, this.chessRadius, color);
		}
		this.renderNewChessboard();
	}
	update(mouse) {
		let x = mouse.x - this.originX;
		let y = mouse.y - this.originY;
		//TODO: this method has some performace issues
		for (let i = 0; i < this.chessArr.length; i++) {
			for (let j = 0; j < this.chessArr[i].length; j++) {
				if (y - this.chessArr[i][j].y < this.interval / 2 && y - this.chessArr[i][j].y > -this.interval / 2
					&& x - this.chessArr[i][j].x < this.interval / 2 && x - this.chessArr[i][j].x > -this.interval / 2) {
					let chessObj = {
						x: i,
						y: j,
						chess: new Chess(this.chessArr[i][j].x, this.chessArr[i][j].y, this.chessRadius, this.color)
					}

					return chessObj;
				}
			}
		}
	}

	drawChessBoard() {
		this.canvas.save();

		//draw the outter line
		this.canvas.fillStyle = '#000000';
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
			this.canvas.lineTo(this.margin + this.interval * i, this.height - this.margin);
		}
		for (let i = 1; i < 18; i++) {
			this.canvas.moveTo(this.margin, this.margin + this.interval * i);
			this.canvas.lineTo(this.width - this.margin, this.margin + this.interval * i);
		}
		this.canvas.stroke();

		this.canvas.restore();
	}
	renderNewChessboard(chessRecord) {
		this.canvas.clearRect(0, 0, this.width, this.height);
		this.drawChessBoard();
		this.drawStar();
		// if (chessRecord) {
		// 	this.init();
		// 	for (let i = 0; i < chessRecord.colorArr.length; i++) {
		// 		for (let j = 0; j < chessRecord.colorArr[i].length; j++) {
		// 			if (chessRecord.colorArr[i][j]) {
		// 				this.chessArr[i][j].color = chessRecord.colorArr[i][j];
		// 			}
		// 		}
		// 	}
		// }
		this.drawAllChess();
	}

	drawStar() {
		let starRadius = 5;
		for (let i = 3; i <= 15; i += 6) {
			for (let j = 3; j <= 15; j += 6) {
				this.canvas.beginPath();
				this.canvas.arc(this.margin + this.interval * i, this.margin + this.interval * j, starRadius, Math.PI * 2, false);
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
		this.canvas.beginPath();
		this.canvas.arc(chess.x, chess.y, chess.radius, Math.PI * 2, false);
		this.canvas.stroke();
		this.canvas.fill();
		this.canvas.closePath();
		this.canvas.stroke();

		this.canvas.restore();
	}
	hoverChess(chess) {
		this.canvas.save();

		this.canvas.shadowBlur = 10;
		this.canvas.shadowColor = '#88B7B5'; // the shadow around the hovering chess
		this.canvas.globalAlpha = 0.6;
		this.canvas.strokeStyle = '#45B7B5';
		this.drawChess(chess);

		this.canvas.restore();
	}
	click(mouse) {
		let chessObj = this.update(mouse);
		return chessObj;
	}
	hover(mouse) {
		let chessObj = this.update(mouse);
		if (chessObj) {
			this.renderNewChessboard();
			this.hoverChess(chessObj.chess);
		}
	}
}