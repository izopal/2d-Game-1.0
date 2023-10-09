import GameObject from './GameObject.js';

export default class Enemy extends GameObject {
    constructor(game, key) {
        super(game, key);
        this.collisionObject = [...this.game.players, ...this.game.obstacles, ...this.game.enemies];
        this.x               = this.game.width + this.width + Math.random() * this.game.width * .5;

        this.vx       = (Math.random() * 4 - 1) * this.scale;
        this.vy       = (Math.random() * 4 - 1) * this.scale;
        // параметри розгону частинок
        this.pushX    = 0;
        this.pushY    = 0;
        this.friction = .78;
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
        this.collisionObject.forEach(object => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, object);

            if(collision){
                const unit_x = dx / distance || 0;
                const unit_y = dy / distance || 0;
                this.x       = object.x + (sumOffRadius +1) * unit_x;
                this.y       = object.y + (sumOffRadius +1) * unit_y;
                this.isFacingLeft = object === this.game.players[0] && [1, 2, 3].includes(this.game.players[0].frameY) ? false : true; 
            };
        });
         
        this.game.larvas.forEach(larva => {
            let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, larva);
            this.force    = larva.arealRadius / distance;
            if(distance < larva.arealRadius){
                this.angle  = Math.atan2(dy, dx);
                this.pushX -= Math.cos(this.angle) * this.force;
                this.pushY -= Math.sin(this.angle) * this.force;
                this.isFacingLeft = this.pushX > 0 ? false : true;
                if(collision) {
                    larva.markedForDelition = true;
                    this.game.removeGameObject(); 
                };
            }
        });    
        this.x    += (this.pushX *= this.friction) + this.vx;
        this.y    += (this.pushY *= this.friction) + this.vy;


    }
}

