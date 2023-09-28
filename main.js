import Player       from './player.js';
import InputHandler from './input.js';
import Obstacle     from './obstacle.js';
import constants    from './constants.js';
    



window.addEventListener('load',  function() { 
    const canvasMS         = document.getElementById('canvasMS');
          canvasMS.width   = constants.canvas.canvasWidth;
          canvasMS.height  = constants.canvas.canvasHeight;
    const ctx              = canvasMS.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle    = 'red';
          ctx.lineStroke   = 3;
          ctx.strokeStyle  = 'red';

    class Game {
        constructor(canvasMS, constants){
            this.canvas            = canvasMS;
            this.canvasSize        = this.canvas.getBoundingClientRect();
            console.log(this.canvasSize)
            // параметри полотна
            this.width             = canvasMS.width;
            this.height            = canvasMS.height;
            this.topMargin         = constants.canvas.topMargin;
            // підключаємо модулі
            this.player            = new Player(this);
            this.input             = new InputHandler(canvasMS);
            

            // 
            this.numberOffObstacles = constants.obstacle.numberOffObstacles;
            this.obstacles          = [];
        }
    
        render(ctx){
            this.player.draw(ctx);
            this.player.update(this.input.mouse);

            this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        }
        checkCollision(a, b){
            const dx           = a.x - b.x; 
            const dy           = a.y - b.y;
            const distance     = Math.hypot(dy, dx);
            const sumOffRadius = a.radius + b.radius;
            return [(distance < sumOffRadius), distance, sumOffRadius, dx, dy]
        }
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
                    this.distanceBuffer = constants.obstacle.distanceBuffer;                                   //параметр буферної зони(мінімальна відстань між перешкодами) між перешкодами
                    this.sumOffRadius   = firstObstacle.radius + obstacle.radius + this.distanceBuffer;
                    if(this.distance < this.sumOffRadius) overlap = true;
                });
                // if(!overlap                                                &&
                //    firstObstacle.x > firstObstacle.radius                  &&
                //    firstObstacle.x < this.width - firstObstacle.radius * 2 &&
                //    firstObstacle.y > this.topMargin                        &&
                //    firstObstacle.y < this.height - firstObstacle.radius * 2) 
                if(!overlap)
                   this.obstacles.push(firstObstacle);
                attempts++;
            }
            // for(let i = 0; i < this.numberOffObstacles; ++i){
            //     this.obstacles.push(new Obstacle(this))
            // }
        }
    }

    const game = new Game(canvasMS, constants);
    game.init();
    console.log(game);
        
    function animate (){
        ctx.clearRect(0, 0, canvasMS.width, canvasMS.height);
        game.render(ctx);
        requestAnimationFrame(animate)
    }
    animate();

});