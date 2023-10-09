import GameObject from './GameObject.js';

export default class larva extends GameObject {
    constructor(game, key) {
        super(game, key);
        // this.x    = x;
        // this.y    = y; 
     
    }
    reset(){
        super.reset()
    }
    draw(ctx){
        super.draw(ctx)
    }
    update(){
      this.y -= this.speedY;
    }
}