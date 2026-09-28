"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/style.css");
class MouseEvent {
    constructor() {
        this.x = document.querySelector('.x');
        this.y = document.querySelector('.y');
    }
    run() {
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.x.textContent = `X => ${e.touches[0].clientX.toFixed()}`;
            this.y.textContent = `E => ${e.touches[0].clientY.toFixed()}`;
        });
    }
}
const mouse = new MouseEvent();
mouse.run();
