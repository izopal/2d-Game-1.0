export default class InputHandler {
    constructor(canvasMS){
        this.canvas = canvasMS;
        this.mouse  = { pressed: false,
                        x:       this.width * .5,
                        y:       this.height * .5 };


        // параметри керування персонажем
        // блок керування персонажем мишкою
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            this.mouse.x       = e.offsetX;
            this.mouse.y       = e.offsetY;
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if(this.mouse.pressed){
                this.mouse.x       = e.offsetX;
                this.mouse.y       = e.offsetY;
            }
        }) 
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
        })
    }
}