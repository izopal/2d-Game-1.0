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

        // блок зіткнення з персонажем і першкодами і ворогами 
        let collisionObject = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
        collisionObject.forEach(object => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, object);
            if(collision){
            const unit_x = dx / distance || 0;
            const unit_y = dy / distance || 0;
            this.x       = object.x + (sumOffRadius +1) * unit_x;
            this.y       = object.y + (sumOffRadius +1) * unit_y;
            }
        });

        // Обробка зіткнень з іншими яйцями
        for (let i = 0; i < this.game.eggs.length; ++i){
            if (i !== this.indexs) {
                this.otherEgg = this.game.eggs[i];
                this.dx            = this.otherEgg.x - this.x;
                this.dy            = this.otherEgg.y - this.y;
                this.distance      = Math.hypot(this.dx, this.dy);
                this.sumOffRadius  = this.radius + this.otherEgg.radius
                if (this.distance < this.sumOffRadius ) {
                    // Зміна швидкостей після зіткнення
                    const unit_x = this.dx / this.distance  || 0;
                    const unit_y = this.dy  /this.distance  || 0;
                    this.otherEgg.x = this.x + (this.sumOffRadius + 1) * unit_x;
                    this.otherEgg.y = this.y + (this.sumOffRadius + 1) * unit_y;
                }
            }
        }
    }
}
