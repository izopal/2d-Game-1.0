import GameObject from './GameObject.js';

export default class larva extends GameObject {
    constructor(game, key, x, y) {
        super(game, key);
        this.x    = x;
        this.y    = y; 
        this.collisionObject = [...this.game.players, ...this.game.obstacles, ...this.game.eggs];
        
        this.arealRadius            = 250;
       
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
        };

    // блок зіткнення персонажа з першкодами
        this.collisionObject.forEach(obstacl => {
        let [collision, distance, sumOffRadius, dx, dy] = this.game.checkCollision(this, obstacl);
            if(collision){
                const unit_x = dx / distance || 0;
                const unit_y = dy / distance || 0;
                this.x       = obstacl.x + (sumOffRadius +1) * unit_x;
                this.y       = obstacl.y + (sumOffRadius +1) * unit_y;
            }
        });
    }
} 