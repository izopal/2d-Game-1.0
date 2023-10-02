import GameObject from './GameObject.js';

export default class Egg extends GameObject {
    constructor(game, key) {
        super(game, key);
    }
    reset(){
        super.reset()
    }
    draw(ctx){
        super.draw(ctx)
    }
    update(){
        // блок зіткнення з персонажем і першкодами
        let collisionObject = [this.game.player, ...this.game.obstacles];
        collisionObject.forEach(object => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, object);
            if(collision){
            const unit_x = dx / distance || 0;
            const unit_y = dy / distance || 0;
            this.x       = object.x + (sumOffRadius +1) * unit_x;
            this.y       = object.y + (sumOffRadius +1) * unit_y;
            }
        });
        // блок зіткнення з границями екрану
        if     (this.x < 0 + this.width * .5)                this.x = this.width * .5;
        else if(this.x > this.game.width - this.width * .5)  this.x = this.game.width - this.width * .5
        if     (this.y < this.game.topMargin)                this.y = this.game.topMargin;
        else if(this.y > this.game.height - this.height *.2) this.y = this.game.height - this.height *.2;
    }
}
