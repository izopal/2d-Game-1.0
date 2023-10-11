import GameObject from './gameObject.js';

export default class Obstacle extends GameObject {
    constructor(game, key) {
        super(game, key);
    };

    reset(){
        super.reset()
    };

    draw(ctx){ 
        super.draw(ctx)
    };

    update(){
    };
}
