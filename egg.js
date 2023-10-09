import GameObject from './GameObject.js';
import larva from './larva.js';

export default class Egg extends GameObject {
    constructor(game, key) {
        super(game, key);
        // this.collisionObject = this.game.all.filter(item => item !== Egg)
        this.collisionObject = [...this.game.players, ...this.game.obstacles, ...this.game.enemies];
        this.hatchTimer = 0;
        this.hatchInterval = 10000;
    }
    reset(){
        super.reset()
    }
    draw(ctx){
        super.draw(ctx)
        
            const displayTimer = (this.hatchTimer * .001).toFixed(0)
            ctx.font       = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(displayTimer, this.x, this.y)
       
    }
    update(deltaTime){
        // блок зіткнення з границями екрану
        super.update();

        // блок зіткнення з персонажем і першкодами і ворогами 
        this.collisionObject.forEach(object => {
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
        // Поява події при дотику
        if(this.hatchTimer > this.hatchInterval){
            this.markedForDelition = true;
            this.game.addGameObject(this.game.larvas, this.game.larvaKey, this.x, this.y);
            this.game.removeGameObject();
        } else this.hatchTimer += deltaTime;
    }
}
