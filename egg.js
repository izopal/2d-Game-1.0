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
        // блок зіткнення з границями екрану
        super.update();

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
    }
}
