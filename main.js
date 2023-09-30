import constants    from './constants.js';
import { Background }   from './layer.js';
import Obstacle     from './obstacle.js';
import Player       from './player.js';
import Egg          from './egg.js';
    



window.addEventListener('load',  function() { 
    const canvasMS         = document.getElementById('canvasMS');
          canvasMS.width   = constants.game.canvasWidth;
          canvasMS.height  = constants.game.canvasHeight;
    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'none';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';

    class Game {
        constructor(canvasMS, constants){
            this.canvas            = canvasMS;
            this.canvasSize        = this.canvas.getBoundingClientRect();
            console.log(this.canvasSize)
            this.dw                = this.canvasSize.width / window.screen.width;
            this.dh                = this.canvasSize.height / window.screen.height;
            this.scale             = Math.min(this.dw, this.dh);
            // параметри полотна
            this.width             = canvasMS.width;
            this.height            = canvasMS.height;
            this.topMargin         = constants.game.topMargin *  this.dh;
            // параметри швидкості відображення кадрів
            this.fps               = constants.game.fps;
            this.frameInterval     = constants.game.timeInterval/this.fps;
            this.frameTimer        = 0;
            // підключаємо задні фони
            this.background        = new Background(this);
            // підключаємо модуль персонажа
            this.player            = new Player(this);

            // параметри першкод
            this.numberOffObstacles = constants.obstacle.number;
            this.distanceBuffer     = constants.obstacle.distanceBuffer;     //параметр буферної зони(мінімальна відстань між перешкодами) між перешкодами
            this.obstacles          = [];
            // 
            this.eggInterval        = constants.egg.timeInterval/this.fps;
            this.eggTimer           = 0;
            this.numberOffEggs      = constants.egg.number;
            this.eggs               = [];
            // параметри конструктора
            this.debug              = false;

        }
        resize(width, height){
            // обновлюємо значення полотна
            // if(width < height) canvasMS.width = canvasMS.height  = width; 
            canvasMS.width   = width;
            canvasMS.height  = height;
            // 
            this.dw          = canvasMS.width / window.screen.width;
            this.dh          = canvasMS.height / window.screen.height;
            this.scale       = Math.min(this.dw, this.dh);
            // обновлюємо значення парметрів
            this.width       = canvasMS.width;
            this.height      = canvasMS.height;
            this.topMargin   = constants.game.topMargin * this.dh;
            // обновлюємо значення модулів
            this.background.reset();
            this.player.reset();
            this.obstacles.forEach(obstacl => obstacl.reset());
            this.eggs.forEach(egg => egg.reset());
        };
        
        checkCollision(a, b){
            const dx           = a.x - b.x; 
            const dy           = a.y - b.y;
            const distance     = Math.hypot(dy, dx);
            const sumOffRadius = a.radius + b.radius;
            return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
        };

        addEgg(){
            this.eggs.push(new Egg(this))
        };
        init(){
            // умова щоб при генерації перешкод вони не перекривалися одна з одною
            let attempts = 0;
            while (this.obstacles.length < this.numberOffObstacles && attempts < 500){
                let firstObstacle   = new Obstacle(this);
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
            // 
            
        }

        draw(ctx){
            this.background.backgroundLayers[0].draw(ctx);
            const allGameObjects = [this.player, ...this.obstacles, ...this.eggs];  // створюємо обєкт з усіма елементами які потрібно сортувати
            allGameObjects.sort((a, b) => a.y - b.y);                               // Сортуємо за координатою y (від меншого до більшого)
            allGameObjects.forEach(object => object.draw(ctx));
            this.background.backgroundLayers[1].draw(ctx);
        }

        render(ctx, deltaTime){
            if (this.frameTimer > this.frameInterval) {
                ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
                this.draw(ctx);
                this.player.update();
                this.frameTimer = 0;
            };

            this.frameTimer += deltaTime;

            if(this.eggTimer > this.eggInterval && this.eggs.length < this.numberOffEggs){
                this.addEgg();
                this.eggTimer = 0;
            }else{
                this.eggTimer += deltaTime;
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