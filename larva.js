import GameObject from './GameObject.js';

export default class larva extends GameObject {
    constructor(game, key, x, y) {
        super(game, key);
        this.x    = x;
        this.y    = y; 
     
    }
    reset(){
        super.reset()
    }
    draw(ctx){
        super.draw(ctx)
    }
    update(){
      this.y -= this.speedY;
      if  (this.y < this.game.topMargin){   
        this.markedForDelition = true;
        this.game.removeGameObject(); 
      }
    }
} 