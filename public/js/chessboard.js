const LINES = 19;

class Chessboard{
	constructor(interval,chessRadius,canvas,width,height,color,originX,originY,margin) {
		this.canvas = canvas;
		this.radius = 15;
		this.interval = interval; // interval between chess to chess
		this.pointArr = new Array(LINES);
		this.chessArr = new Array(LINES);
		this.chessRadius = chessRadius;
		this.width = width;
		this.height = height;
		this.color = color;
		this.originX = originX || 0;
		this.originY = originY || 0;
		this.margin = margin || 20;
		this.init();
	}
	init(){
		for(var i = 0;i<this.pointArr.length;i++){
			this.pointArr[i] = new Array(LINES);
		}
		for(var i=0;i<this.chessArr.length;i++){
			
			this.chessArr[i] = new Array(LINES);
    		for(var j=0;j<this.chessArr[i].length;j++){
        		var chess = new Chess(this.margin+this.interval*i,this.margin+this.interval*j, this.chessRadius, undefined);
        		this.chessArr[i][j] = chess;
			}
		}
	}
	addChess(x,y,color){
		if(x<0||x>=LINES||y<0||y>=LINES){
			return 'cannot place chess outside the chessBoard';
		}
		if(!this.pointArr[x][y]){
			this.pointArr[x][y] = true;
			this.chessArr[x][y].color = color;
		}
		this.renderNewChessboard();
	}
	update(mouse){
		var x = mouse.x - this.originX;
		var y = mouse.y - this.originY;
		//TODO: this method has some performace issues
		for(var i =0;i<this.chessArr.length;i++){
			for(var j = 0; j<this.chessArr[i].length;j++){
				if(y - this.chessArr[i][j].y < this.interval/2 && y - this.chessArr[i][j].y > -this.interval/2
					&& x - this.chessArr[i][j].x < this.interval/2 && x - this.chessArr[i][j].x > -this.interval/2){
					var chessObj = {
						x:i,
						y:j,
						chess:new Chess(this.chessArr[i][j].x,this.chessArr[i][j].y, this.chessRadius, this.color)
					}

					return chessObj;
				}
			}
		}
	}

	drawChessBoard(){
    	//draw the outter line
		
		this.canvas.save();
		this.canvas.fillStyle = '#000000';
		this.canvas.lineWidth = 2;
		
        this.canvas.beginPath();
		this.canvas.moveTo(this.margin,this.margin);
        this.canvas.lineTo(this.margin,canvas.height - this.margin);

        this.canvas.lineTo(canvas.width - this.margin, canvas.height - this.margin);
        this.canvas.lineTo(canvas.width - this.margin, this.margin);
        this.canvas.lineTo(this.margin,this.margin);
		
    	//draw the inner line
		for(var i = 1; i<18; i++){
			this.canvas.moveTo(this.margin+this.interval*i,this.margin);
			this.canvas.lineTo(this.margin+this.interval*i,canvas.height - this.margin);
		}   
		for(var i = 1; i<18; i++){
			this.canvas.moveTo(this.margin,this.margin+this.interval*i);
			this.canvas.lineTo(canvas.width-this.margin,this.margin+this.interval*i);
		}
		this.canvas.stroke();
		this.canvas.restore();
	}
	renderNewChessboard(chessRecord){
		this.canvas.clearRect(0,0,this.width,this.height);
		this.drawChessBoard();
        this.drawStar();
		if(chessRecord){
			this.init();
			for(var i = 0; i<chessRecord.colorArr.length; i++){
				for(var j = 0; j<chessRecord.colorArr[i].length; j++){
					if(chessRecord.colorArr[i][j]){
						this.pointArr[i][j] = true;
						this.chessArr[i][j].color = chessRecord.colorArr[i][j];
					}
				}
			}
		}
		this.drawAllChess();
	}
	
	drawStar(){
	    //draw the dot 
        var dotRadius = 5;
        for(var i = 3; i<=15;i+=6){
            for(var j = 3; j<=15;j+=6){
                this.canvas.beginPath();
                this.canvas.arc(this.margin+this.interval*i,this.margin+this.interval*j,dotRadius,Math.PI*2,false); 
                this.canvas.fill();
                this.canvas.closePath();
            }
        }
	    
	    this.canvas.stroke();
	}
	drawAllChess(){
		for(var i = 0; i<this.pointArr.length;i++){
			for(var j =0;j<this.pointArr[i].length;j++){
				if(this.pointArr[i][j]){		
					this.drawChess(this.chessArr[i][j]);
				}
			}
		}

	}
	drawChess(chess){
		this.canvas.save();

		this.canvas.fillStyle = chess.color;
		this.canvas.beginPath();
		this.canvas.arc(chess.x,chess.y,chess.radius,Math.PI*2,false);
		this.canvas.stroke();
        this.canvas.fill();
        this.canvas.closePath();

//        this.canvas.beginPath();
//        
//        var grd = this.canvas.createRadialGradient(75, 50, 5, 90, 60, 100);
//        grd.addColorStop(0, "red");
//grd.addColorStop(1, "white");
//        this.canvas.strokeStyle = grd;
//		this.canvas.arc(chess.x-2,chess.y-2,chess.radius,3*Math.PI/2,false);

//        this.canvas.fillRect(10, 10, 150, 100);

		this.canvas.stroke();
        
        
		this.canvas.restore();
	}
	hoverChess(chess){
		this.canvas.save();
		this.canvas.shadowBlur = 10;
		this.canvas.shadowColor = '#88B7B5'; // the shadow around the hovering chess
		this.canvas.globalAlpha = 0.6;
		this.canvas.strokeStyle= '#45B7B5';
//		this.canvas.lineWidth = 4;
		this.drawChess(chess);
		this.canvas.restore();
	}
	click(mouse){
		var chessObj = this.update(mouse);
		return chessObj;
	}
	hover(mouse){
		var chessObj = this.update(mouse);
		if(chessObj){
			this.renderNewChessboard();
			this.hoverChess(chessObj.chess);
		}
	}
	
}