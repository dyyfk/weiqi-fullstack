export default class Chess {
    constructor(x, y, radius, color, row, col, displayColor = color) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.displayColor = displayColor;
        this.radius = radius;
        this.x = x; // X position on the screen
        this.y = y; // Y position on the screen
    }
}
