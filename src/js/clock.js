"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/style.css");
class Clock {
    constructor() {
        this.hours = document.querySelector('.houre');
        this.minutes = document.querySelector('.minute');
        this.seconds = document.querySelector('.second');
        this.dHours = document.querySelector('.hours');
        this.dMinutes = document.querySelector('.minutes');
        this.dSeconds = document.querySelector('.seconds');
        this.runTime();
    }
    runTime() {
        setInterval(() => {
            const currentTime = new Date();
            this.hours.style.transform = `rotate(${currentTime.getHours() * 30}deg)`;
            this.minutes.style.transform = `rotate(${currentTime.getMinutes() * 6}deg)`;
            this.seconds.style.transform = `rotate(${currentTime.getSeconds() * 6}deg)`;
            this.dHours.innerHTML = `${currentTime.getHours() < 10 ? '0' + currentTime.getHours() : currentTime.getHours()}  :`;
            this.dMinutes.innerHTML = `${currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}  :`;
            this.dSeconds.innerHTML = `${currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds()}`;
        }, 1000);
    }
}
const clock = new Clock();
clock.runTime();
