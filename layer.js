import { findGameObject }           from "./constants.js";

class Layer {
    constructor(game, key){
        // початкові параметри 
        this.game          = game;
        this.layerObject   = findGameObject(this.game.data, key);
        this.layerName     = this.layerObject.name;
        this.level         = this.layerObject.level;
        // підключаємо зображення
        this.image         = new Image;
        this.image.src     = `images/${this.layerName}.png`;
        // параметри початквого розміру зображення заднього фону 
        this.width         = this.game.width;
        this.height        = this.game.height;
        // параметри початкового розміщення на полотні
        this.x             = 0;
        this.y             = 0;
    };

    reset(){
        this.width         = this.game.width;
        this.height        = this.game.height;
    };

    draw(ctx){
        ctx.drawImage(this.image, 
                      this.x,
                      this.y,
                      this.width,
                      this.height);
    };
}

export class Background { 
    constructor(game){
        this.game               = game;
        // підключаємо задній фон вигляд - ЛІС 
        this.keys               = ['forest', 'overlay']
        this.backgroundLayers   = [];
        for (const key of this.keys) {
          this.layer = new Layer(this.game, key);
          this.backgroundLayers.push(this.layer);
        }
    };  
    
    reset(){
        this.backgroundLayers.forEach(layer => layer.reset()); 
    };
}

 