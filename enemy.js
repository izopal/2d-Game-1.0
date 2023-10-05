import GameObject from './GameObject.js';

export default class Enemy extends GameObject {
    constructor(game, key) {
        super(game, key);
        this.x    = this.game.width + this.width + Math.random() * this.game.width * .5;
    }
    reset(){
        super.reset()
        
    }
    draw(ctx){
        super.draw(ctx)
        
    }
    update(){
        this.isFacingLeft = true; 
        this.x -= this.speedX;

        // блок повернення ворогів на початкову позицію
        if(this.x + this.width  < 0){
            this.isFacingLeft = true;
            this.x  = this.game.width + this.width + Math.random() * this.game.width * .5;
            this.y  = Math.random() * (this.game.height - this.radius * 2 - this.game.topMargin) + this.game.topMargin;
        };
        
        // блок зіткнення з границями екрану
        if     (this.y < this.game.topMargin)                            this.y = this.game.topMargin;
        else if(this.y > this.game.height - this.height * this.borderY ) this.y = this.game.height -  this.height * this.borderY  ; 

        // блок зіткнення з ворогів і першкодами
        let collisionObject = [...this.game.players, ...this.game.obstacles];
        collisionObject.forEach(object => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, object);

            if(collision){
                const unit_x = dx / distance || 0;
                const unit_y = dy / distance || 0;
                this.x       = object.x + (sumOffRadius +1) * unit_x;
                this.y       = object.y + (sumOffRadius +1) * unit_y;
                this.isFacingLeft = object === this.game.players[0] && [1, 2, 3].includes(this.game.players[0].frameY) ? false : true; 
            };
        });
         
        // Обробка зіткнень з іншими ворогами
        for (let i = 0; i < this.game.enemies.length; ++i){
            if (i !== this.indexs) {
                this.otherEnemy    = this.game.enemies[i];
                this.dx            = this.otherEnemy.x - this.x;
                this.dy            = this.otherEnemy.y - this.y;
                this.distance      = Math.hypot(this.dx, this.dy);
                this.sumOffRadius  = this.radius + this.otherEnemy.radius
                if (this.distance < this.sumOffRadius ) {
                    // Зміна швидкостей після зіткнення
                    const unit_x = this.dx / this.distance  || 0;
                    const unit_y = this.dy  /this.distance  || 0;
                    this.otherEnemy.x = this.x + (this.sumOffRadius + 1) * unit_x;
                    this.otherEnemy.y = this.y + (this.sumOffRadius + 1) * unit_y;
                }
            }
        }
    }
}

