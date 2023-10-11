import { findGameObject }   from "./constants.js";
import GameObject           from './gameObject.js';

export default class Egg extends GameObject {
    constructor(game, key) {
        super(game, key);
        this.egg             = findGameObject(game.data, key);
        this.collisionObject = [...this.game.players, ...this.game.obstacles, ...this.game.enemies];
        this.hatchTimer      = 0;
        this.hatchInterval   = this.egg.hatchInterval;
    };

    reset(){
        super.reset();
        this.hatchInterval   = this.egg.hatchInterval;
    };

    draw(ctx){
        super.draw(ctx)
            const interval      = (this.hatchInterval  * .1 + 100).toFixed(0) ;
            const displayTimer  = (this.hatchTimer * .1).toFixed(0)
            const maxValue      = this.width * .5;
            const scaleWidth    = ((interval - displayTimer) / interval) * maxValue; 
            const alpha         = (interval - displayTimer) / interval
        
            let scaleColor = 'red';
           
          
            // Малюємо саму шкалу з врахуванням коліру
            ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle   = scaleColor;
                ctx.fillRect(this.colisionX + maxValue - .1, this.colisionY - 10 * this.scaleY,   scaleWidth, 3 * this.scaleY);  // Малюємо шкалу від права до центра
                ctx.fillRect(this.colisionX + maxValue + .1, this.colisionY - 10 * this.scaleY, 1-scaleWidth, 3 * this.scaleY);  // Малюємо шкалу від ліва до центра
            ctx.restore();
    };
    
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
            this.hatchTimer = 0
        } else this.hatchTimer += deltaTime;
    };
}
