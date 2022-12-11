import { Vector2 } from "three"

export default class Controls {
    constructor(w, h) {
        this.mousePosition = new Vector2(0,0);
        this.viewChange = false;
        this.windowSize = new Vector2(w, h);
        // window.addEventListener('mousemove', (e) => {
        //     this.mousePosition.set(e.clientX, e.clientY);
        // });

        // window.addEventListener('keydown', e => {
        //     console.log(e.key);
        //     if(e.key == " ") {
        //         this.viewChange = true;
        //     }
        // });

        // window.addEventListener('keyup', e => {
        //     if(e.key == " ") {
        //         this.viewChange = false;
        //     }
        // });
        // console.log(" here " + this.windowSize.x)
    }

    current() {
        // console.log(this.mousePosition)
        // console.log(this.windowSize)
        return {
            mousePosition: this.mousePosition.divide(this.windowSize),//.multiplyScalar(2),
            viewChange: this.viewChange
        }
    }

    setWH(w, h) {
        this.windowSize.set(w, h)
    }
}