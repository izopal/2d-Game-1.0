
import GameObject from './GameObject.js';

export default class Obstacle extends GameObject {
    constructor(game, key) {
        super(game, key);
        console.log(key)
    }
    reset(){
        super.reset()
    }
    draw(ctx){
        super.draw(ctx)
    }
    update(){
        
    }
}