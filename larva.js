import { findGameObject }           from "./constants.js";
import GameObject from './GameObject.js';

export default class larva extends GameObject {
    constructor(game, key, x, y) {
        super(game, key);
        this.larva   = findGameObject(game.data, key);
        this.x       = x;
        this.y       = y; 
        this.collisionObject = [...this.game.players, ...this.game.obstacles, ...this.game.eggs];
        this.distanceBuffer  = this.larva.distanceBuffer;
    };

    reset(){
        super.reset()
    };

    draw(ctx){
        super.draw(ctx)
    };

    update(){
        this.x += Math.random() * (this.larva.speedXmax - this.larva.speedXmin) + this.larva.speedXmin;
        this.y -= Math.random() * (this.larva.speedYmax - this.larva.speedYmin) + this.larva.speedYmin;
        
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
    };
} 