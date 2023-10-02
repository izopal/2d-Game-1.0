import GameObject from './GameObject.js';

export default class Enemy extends GameObject {
    constructor(game, key) {
        super(game, key);
        this.game = game;
        this.x    = this.game.width + this.width;
    }
    reset(){
        super.reset()
        this.x  = this.game.width + this.width;
    }
    draw(ctx){
        super.draw(ctx)
    }
    update(){
        this.x -= this.speedX;
    }
}