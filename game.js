import data                         from "./constants.js";
import DisplayStatusText            from './displayStatusText.js';
import { findGameObject }           from "./constants.js";
import { Background }               from './layer.js';


export default class Game {
    constructor(canvasMS, ctx){
        this.data              = data;
        this.ctx               = ctx;
        // ключі для гри 
        this.playerKey         = 'bull';
        this.enemyKey          = 'toad';
        this.eggKey            = 'egg';
        this.larvaKey          = 'larva';
        this.obstacleKey       = 'obstacle';
        this.gameKey           = 'game'
        this.layerKey          = 'layer1';
        
        this.game              = findGameObject(this.data, this.gameKey);
        this.layer             = findGameObject(this.data, this.layerKey)
        // параметри полотна
        this.width             = canvasMS.width  = this.game.canvasWidth;;
        this.height            = canvasMS.height = this.game.canvasHeight;;
        // параметри масштабування
        this.scaleX            = canvasMS.width / this.layer.width;
        this.scaleY            = canvasMS.height / this.layer.height;
        this.scale             = Math.min(this.scaleX, this.scaleY);
        this.topMargin         = this.game.topMargin * this.scaleY;
        // параметри швидкості відображення кадрів
        this.fps               = this.game.fps;
        this.frameInterval     = this.game.timeInterval / this.fps;
        this.frameTimer        = 0;
        // параметри всіх обєктів
        this.players           = [];
        this.larvas            = [];
        this.enemies           = [];
        this.enemy             = findGameObject(this.data, this.enemyKey)
        this.eggs              = [];
        this.egg               = findGameObject(this.data, this.eggKey)
        this.obstacles         = [];
        this.obstacl           = findGameObject(this.data, this.obstacleKey)
        
        this.allGameObjects    = [...this.players, ...this.obstacles, ...this.eggs, ...this.enemies, ...this.larvas];  // створюємо обєкт з усіма елементами які потрібно сортувати
        
        // параметри конструктора
        this.score                = this.game.score;  
        this.scoreLoss            = this.game.scoreLoss;  
        this.scoreWin             = this.game.scoreWin;  
        this.isPaused             = this.game.isPaused;
        this.gameOver             = this.game.gameOver;
        this.debug                = this.game.debug;
        this.levelDifficulty      = this.game.levelDifficulty

        // підключаємо задні фони
        this.background        = new Background(this);
        // підключаємо текст
        this.statusText        = new DisplayStatusText(this)
    }

    resize(width, height){
        // обновлюємо значення полотна
        canvasMS.width   =  width;
        canvasMS.height  =  height;
        // параметри масштабування
        this.scaleX      = canvasMS.width / this.layer.width;
        this.scaleY      = canvasMS.height / this.layer.height;
        this.scale       = Math.min(this.scaleX, this.scaleY);
        // обновлюємо значення парметрів
        this.width       = canvasMS.width; 
        this.height      = canvasMS.height;
        this.topMargin   = this.game.topMargin * this.scaleY;
        // обновлюємо значення модулів
        this.background.reset();
        this.allGameObjects.forEach(gameObject => gameObject.reset());
    };
     
    // =========================== Алгоритм вкл./викл. повноекранного режиму =================================>
    toggleFullscreen() {
        if (!document.fullscreenButton) {
            canvasMS.requestFullscreen().catch(err => {
                alert("Помилка. Не вдається увімкнути повноекранний режим: " + err.message);
            });
        } else { 
            document.exitFullscreen();
        }
    };

    checkCollision(a, b){
        const dx           = a.x - b.x; 
        const dy           = a.y - b.y;
        const distance     = Math.hypot(dy, dx);
        const sumOffRadius = a.radius + b.radius;
        return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
    };
   
    addGameObject(array, key, x, y) {
        const Class          = findGameObject(this.data, key).class;
        const gameObject     = new  Class (this, key, x, y);
        if (gameObject.level.includes(this.game.level) && array.length < gameObject.number){
            array.push(gameObject);
        }; 
    };

    removeGameObject(){
        this.eggs   = this.eggs.filter(obj => !obj.markedForDelition);
        this.larvas = this.larvas.filter(obj => !obj.markedForDelition);
    };

    addObstacle(){
        const Class          = this.obstacl.class;
        let attempts = 0;
        // умова щоб при генерації перешкод вони не перекривалися одна з одною
        while ( this.obstacl.level.includes(this.game.level) &&
                this.obstacles.length < this.obstacl.number  && 
                attempts < 500){
                    let firstObstacle   = new Class (this, this.obstacleKey);
                    let overlap         = false;
                    this.obstacles.forEach(obstacle => {
                        this.dx             = firstObstacle.x - obstacle.x
                        this.dy             = firstObstacle.y - obstacle.y;
                        this.distance       = Math.hypot(this.dy, this.dx);
                        this.sumOffRadius   = firstObstacle.radius + obstacle.radius + this.obstacl.distanceBuffer;
                        if(this.distance < this.sumOffRadius) overlap = true;
                    });
                    if(!overlap)
                    this.obstacles.push(firstObstacle);
                ++attempts;
        }
    };

    draw(ctx){
        this.background.backgroundLayers[0].draw(ctx);
        
        this.allGameObjects = [...this.players, ...this.enemies, ...this.eggs, ...this.larvas, ...this.obstacles] || 0;  // створюємо обєкт з усіма елементами які потрібно сортувати
        this.allGameObjects.sort((a, b) => a.y - b.y);                               // Сортуємо за координатою y (від меншого до більшого)
        this.allGameObjects.forEach(object => object.draw(ctx));
        
        this.background.backgroundLayers[1].draw(ctx);
    };
    
    update(deltaTime) {
        this.allGameObjects.forEach(object => object.update(deltaTime));
    };

    render(ctx, deltaTime){
        if (this.frameTimer > this.frameInterval) {
            ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
            this.draw(ctx);
            this.update(deltaTime);
            this.frameTimer = 0;
         };
         this.frameTimer += deltaTime;
         
        // Викликаємо функцію для додавання обєктів
        this.addGameObject(this.players, this.playerKey);
        this.addObstacle()
        // інтервал появи яїчок
        if(this.egg.timer > this.egg.interval){
            this.addGameObject(this.eggs, this.eggKey);
            this.egg.timer = 0;
        }else{
            this.egg.timer += deltaTime;
        };
        // інтервал появи ворогів
        if(this.enemy.timer > this.enemy.interval){
            this.addGameObject(this.enemies, this.enemyKey);
            this.enemy.timerr = 0;
        }else{
            this.enemy.timer += deltaTime;
        };
    }

    restart(){
        this.score             = this.game.score;  
        this.isPaused          = false;
        this.gameOver          = false;
        this.players           = [];
        this.eggs              = [];
        this.larvas            = [];
        this.enemies           = [];
    }
}