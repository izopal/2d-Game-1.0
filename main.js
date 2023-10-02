import constants        from './constants.js';
import { Background }   from './layer.js';
import Obstacle         from './obstacle.js';
import Player           from './player.js';
import Egg              from './egg.js';
import Enemy            from './enemy.js';

window.addEventListener('load',  function() { 
    const canvasMS         = document.getElementById('canvasMS');
    const mobilScreen      = window.innerWidth < window.innerHeight;
    const fullScreen       = constants.game.canvasWidth === window.innerWidth && constants.game.canvasHeight === window.innerHeight;

    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'none';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';

    class Game {
        constructor(canvasMS, constants){
            // параметри кмов різних пристроїв
            this.canvas            = canvasMS;
            canvasMS.width         = constants.game.canvasWidth;
            canvasMS.height        = constants.game.canvasHeight;
            // параметри масштабування
            this.scaleX            = canvasMS.width / constants.layer.width;
            this.scaleY            = canvasMS.height / constants.layer.height;
            this.scale             = Math.min(this.scaleX, this.scaleY);

            // this.dw                = window.innerWidth / window.screen.width;
            // this.dh                = window.innerHeight / window.screen.height;
            // this.ds                = Math.min(this.dw, this.dh);
            // console.log(this.ds)

            // параметри полотна
            this.width             = canvasMS.width;
            this.height            = canvasMS.height;
            this.topMargin         = constants.game.topMargin *  this.scaleY;
            // параметри швидкості відображення кадрів
            this.fps               = constants.game.fps;
            this.frameInterval     = constants.game.timeInterval/this.fps;
            this.frameTimer        = 0;
            // підключаємо задні фони
            this.background        = new Background(this);
            // підключаємо модуль персонажа
            this.player            = new Player(this, 'player');
            // параметри першкод
            this.numberOffObstacles = constants.obstacle.number;
            this.distanceBuffer     = constants.obstacle.distanceBuffer;     //параметр буферної зони(мінімальна відстань між перешкодами) між перешкодами
            this.obstacles          = [];
            // параметри яїчок
            this.eggInterval        = constants.egg.timeInterval/this.fps;
            this.eggTimer           = 0;
            this.numberOffEggs      = constants.egg.number;
            this.eggs               = [];
            // параметри ворогів
            this.enemyInterval      = constants.enemy.timeInterval/this.fps;
            this.enemyTimer         = 0;
            this.numberOffEnemies   = constants.enemy.number;
            this.enemies            = []; 
            // параметри всіх обєктів
            this.allGameObjects     = [];
            // параметри конструктора
            this.debug              = false;
        }
        
        resize(width, height){
            // обновлюємо значення полотна
            canvasMS.width   =  width;
            canvasMS.height  =  height;
            console.log(canvasMS.width, canvasMS.height)
            // параметри масштабування
            this.scaleX      = canvasMS.width / constants.layer.width;
            this.scaleY      = canvasMS.height / constants.layer.height;
            this.scale       = Math.min(this.scaleX, this.scaleY);

            // обновлюємо значення парметрів
            this.width       = canvasMS.width; 
            this.height      = canvasMS.height;
            this.topMargin   = constants.game.topMargin * this.scaleY;
            // обновлюємо значення модулів
            this.background.reset();
            this.player.reset();
            this.obstacles.forEach(obstacl => obstacl.reset());
            this.eggs.forEach(egg => egg.reset());
            this.enemies.forEach(enemy => enemy.reset());
        };
        
        checkCollision(a, b){
            const dx           = a.x - b.x; 
            const dy           = a.y - b.y;
            const distance     = Math.hypot(dy, dx);
            const sumOffRadius = a.radius + b.radius;
            return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
        };

        addEgg(){
            this.eggs.push(new Egg(this, 'egg'))
        };
        addEnemy(){
            this.enemies.push(new Enemy(this, 'enemy'))
        }
        init(){
            // умова щоб при генерації перешкод вони не перекривалися одна з одною
            let attempts = 0;
            while (this.obstacles.length < this.numberOffObstacles && attempts < 500){
                let firstObstacle   = new Obstacle(this, 'obstacle');
                let overlap         = false;
                this.obstacles.forEach(obstacle => {
                    this.dx             = firstObstacle.x - obstacle.x
                    this.dy             = firstObstacle.y - obstacle.y;
                    this.distance       = Math.hypot(this.dy, this.dx);
                    this.sumOffRadius   = firstObstacle.radius + obstacle.radius + this.distanceBuffer;
                    if(this.distance < this.sumOffRadius) overlap = true;
                });
                if(!overlap)
                   this.obstacles.push(firstObstacle);
                ++attempts;
            }
        }

        draw(ctx){
            this.background.backgroundLayers[0].draw(ctx);
            this.allGameObjects = [this.player, ...this.obstacles, ...this.eggs, ...this.enemies];  // створюємо обєкт з усіма елементами які потрібно сортувати
            this.allGameObjects.sort((a, b) => a.y - b.y);                               // Сортуємо за координатою y (від меншого до більшого)
            this.allGameObjects.forEach(object => object.draw(ctx));
            this.background.backgroundLayers[1].draw(ctx);
        }
        update(){
            this.allGameObjects.forEach(object => object.update());
        }
        render(ctx, deltaTime){
            if (this.frameTimer > this.frameInterval) {
                ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
                this.draw(ctx);
                this.update();
                this.frameTimer = 0;
            };

            this.frameTimer += deltaTime;

            if(this.eggTimer > this.eggInterval && this.eggs.length < this.numberOffEggs){
                this.addEgg();
                this.eggTimer = 0;
            }else{
                this.eggTimer += deltaTime;
            };
            if(this.enemyTimer > this.enemyInterval && this.enemies.length < this.numberOffEnemies){
                this.addEnemy();;
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            };
            
        }
    }

    const game = new Game(canvasMS, constants);
    game.init();
    console.log(game);

    let lastTime = 0 
    function animate (timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.render(ctx, deltaTime);
        requestAnimationFrame(animate)
    }
    animate(0);

});