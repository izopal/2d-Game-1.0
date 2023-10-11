const fullscreenButton         = document.getElementById('fullscreenButton');

export default class InputHandler {
    constructor(game){
        this.game   = game;
        this.mouse  = { pressed: false,
                        x:       this.width * .5,
                        y:       this.height * .5 };

        fullscreenButton.addEventListener('click',     this.game.toggleFullscreen);
        fullscreenButton.addEventListener('touchstart', () => {this.game.toggleFullscreen}, {passive: true});

        // ==================== Блок зміни розмірів екрану =======================>
        window.addEventListener('resize', ( ) => {
            this.game.resize(window.innerWidth, window.innerHeight);
        });
        window.addEventListener('orientationchange', () => {
            this.game.resize(window.innerWidth, window.innerHeight);
        });

        // ==================== Блок керування клавіатурою =======================>
        // вкл./викл конструктора
        window.addEventListener('keydown', (e) => {
            if(['D', 'd', 'В', 'в'].includes(e.key)) this.game.debug = !this.game.debug;
        });

        // ==================== Блок керування мишкою =======================>
        // натиснули ліву кнопку миші
        canvasMS.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            this.mouse.x       = e.offsetX;
            this.mouse.y       = e.offsetY;
        });
        // рух з натиснутою лівою кнопкою миші
        canvasMS.addEventListener('mousemove', (e) => {
            if(this.mouse.pressed){
                this.mouse.x   = e.offsetX;
                this.mouse.y   = e.offsetY;
            }
        });
        // відпустили ліву кнопку миші
        canvasMS.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
            
        // ==================== Блок керування touchPad=======================>
        // натиснули 
        canvasMS.addEventListener('touchstart', e => { 
            this.mouse.pressed = true;
            this.mouse.x = e.changedTouches[0].pageX;
            this.mouse.y = e.changedTouches[0].pageY;
        }, { passive: true });
        
        // рух 
        canvasMS.addEventListener('touchmove', e =>{
            if(this.mouse.pressed){
                this.mouse.x = e.changedTouches[0].pageX;
                this.mouse.y = e.changedTouches[0].pageY;
                }
        });
        // відпустили 
        canvasMS.addEventListener('touchend', () =>{
            this.mouse.pressed = false;
        });
    }
}
