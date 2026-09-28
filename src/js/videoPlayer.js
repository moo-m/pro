"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/style.css");
class VideoPlayer {
    constructor() {
        this.container = document.getElementsByClassName("video-container")[0];
        this.canvass = document.getElementsByClassName("canvass")[0];
        this.video = document.getElementById("video");
        this.inputFile = document.getElementsByName("file")[0];
        this.inputUrl = document.getElementsByName("url")[0];
        this.inputsContainer = document.getElementsByClassName("input-container")[0];
        this.play = document.getElementsByClassName("play")[0];
        this.speeds = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3];
        this.times = { seconds: 0, minutes: 0, hours: 0 };
        this.canvasSpeed = document.getElementById("speed");
        this.canvasVoice = document.getElementById("voice");
        this.canvasDuration = document.getElementById("duration");
        this.ctxDuration = this.canvasDuration.getContext("2d");
        this.durationLineId = 0;
        this.voiceDeg = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];
        this.ctxVoice = this.canvasVoice.getContext("2d");
        this.canvas = document.getElementById("canvas");
        this.canvasScreen = document.getElementById("screen");
        this.ctxScreen = this.canvasScreen.getContext("2d");
        this.ctx = this.canvas.getContext("2d");
    }
    uploadVideo() {
        this.canvas.width = this.canvasScreen.width =
            this.canvass.clientWidth;
        this.canvas.height = this.canvasScreen.height =
            this.canvass.clientHeight;
        this.inputFile.addEventListener("change", (e) => this.showPlayButtonAndShowVideo(e));
        this.inputUrl.addEventListener("input", (e) => this.showPlayButtonAndShowVideo(e));
        this.canvas.addEventListener("click", this.playPause.bind(this));
        this.canvas.addEventListener("dblclick", () => this.fullScreen());
        this.canvasSpeed.addEventListener("touchmove", (e) => this.videoSpeed(e));
        this.canvasVoice.addEventListener("touchmove", (e) => this.voiceControl(e));
        this.canvasVoice.addEventListener("dblclick", () => this.skipDuration());
    }
    showPlayButtonAndShowVideo(e) {
        e.preventDefault();
        const target = e.target;
        if ((e.target.type === "url") && target.value !== "") {
            this.play.style.visibility = "visible";
            this.video.src = e.target.value;
        }
        else if ((e.target.type === "file") && target.files[0] !== undefined) {
            this.play.style.visibility = "visible";
            const file = e.target.files[0];
            this.video.src = URL.createObjectURL(file);
        }
        else
            this.play.style.visibility = "hidden";
        const clickToWatch = () => {
            this.inputsContainer.style.visibility = "hidden";
            this.play.style.visibility = "hidden";
            this.drawVideoOnCanvas();
            this.play.removeEventListener("click", () => clickToWatch);
        };
        this.play.addEventListener("click", clickToWatch);
    }
    drawVideoOnCanvas() {
        this.ctxScreen.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        requestAnimationFrame(this.drawVideoOnCanvas.bind(this));
    }
    playPause(e) {
        const boundCanvas = this.canvas.getBoundingClientRect();
        if (e.x > boundCanvas.width / 2 + boundCanvas.x - 60 &&
            e.x < boundCanvas.width / 2 + boundCanvas.x + 60 &&
            e.y > boundCanvas.height / 2 + boundCanvas.y - 80 &&
            e.y < boundCanvas.height / 2 + boundCanvas.y + 80) {
            if (!this.video.paused) {
                this.video.pause();
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.beginPath();
                this.ctx.fillStyle = "red";
                this.ctx.strokeStyle = "red";
                this.ctx.fillRect(boundCanvas.width / 2 - 15, boundCanvas.height / 2 - 15, 15, 30);
                this.ctx.fillRect(boundCanvas.width / 2 + 15, boundCanvas.height / 2 - 15, 15, 30);
                this.setInfo({ speed: this.video.playbackRate, voice: this.video.volume });
            }
            else {
                this.video.play();
                this.ctx.clearRect(0, 0, boundCanvas.width, boundCanvas.height);
                this.ctx.beginPath();
                this.ctx.fillStyle = "blue";
                this.ctx.strokeStyle = "blue";
                this.ctx.moveTo(boundCanvas.width / 2 - 15, boundCanvas.height / 2 - 15);
                this.ctx.lineTo(boundCanvas.width / 2 + 30, boundCanvas.height / 2);
                this.ctx.lineTo(boundCanvas.width / 2 - 15, boundCanvas.height / 2 + 15);
                this.ctx.lineTo(boundCanvas.width / 2 - 15, boundCanvas.height / 2 - 15);
                this.ctx.fill();
                this.ctx.stroke();
                setTimeout(() => {
                    if (!this.video.paused) {
                        this.ctx.clearRect(0, 0, boundCanvas.width, boundCanvas.height);
                    }
                }, 700);
            }
        }
        this.duration();
    }
    setInfo({ speed, voice }) {
        //if (!this.video.paused) {
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //}
        this.ctx.fillStyle = "black";
        this.ctx.font = "18px sans-serif";
        this.ctx.beginPath();
        this.ctx.fillText(`SPEED: ${speed}`, this.canvas.width / 2 - 30, this.canvas.height / 2 - 120);
        this.ctx.fillText(`Time: ${this.times.hours.toFixed(0)}:${this.times.minutes.toFixed(0)}:${this.times.seconds.toFixed(0)}`, this.canvas.width / 2 - 30, this.canvas.height / 2 - 80);
        this.ctx.fillText(`VOICE: ${voice * 100}`, this.canvas.width / 2 - 30, this.canvas.height / 2 - 40);
        this.ctx.stroke();
    }
    videoSpeed(e) {
        e.preventDefault();
        if (!this.video.paused) {
            const bound = this.canvasSpeed.getBoundingClientRect();
            const { clientX: x } = e.touches[0];
            this.video.playbackRate =
                this.speeds[Math.floor(((x - bound.x) / bound.width) * 8)];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.fillStyle = "yellow";
            this.ctx.beginPath();
            this.ctx.fillText(`SPEED: ${this.video.playbackRate}`, this.canvas.width / 2 - 20, this.canvas.height / 2 - 120);
            this.ctx.stroke();
            setTimeout(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }, 700);
        }
    }
    voiceControl(e) {
        e.preventDefault();
        if (!this.video.paused) {
            const bound = this.canvasVoice.getBoundingClientRect();
            const { clientY: y } = e.touches[0];
            this.video.volume = +this.voiceDeg[Math.floor(((y - bound.y) / bound.height) * this.voiceDeg.length)];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.fillStyle = "yellow";
            this.ctx.fillText(`VOICE: ${this.video.volume * 100}`, this.canvas.width / 2 - 20, this.canvas.height / 2 - 120);
            this.ctx.stroke();
            this.ctx.stroke();
            setTimeout(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }, 700);
        }
    }
    duration() {
        if (this.video.paused) {
            this.times.hours = Math.floor(this.video.duration / 3600);
            this.times.minutes = Math.floor((this.video.duration % 3600) / 60);
            this.times.seconds = Math.floor(this.video.duration % 60);
            this.durationLine();
        }
        else {
            setTimeout(() => {
                cancelAnimationFrame(this.durationLineId);
                if (!this.video.paused) {
                    this.ctxDuration.clearRect(0, 0, this.canvasDuration.width, this.canvasDuration.height);
                }
            }, 700);
        }
    }
    durationLine() {
        this.ctxDuration.clearRect(0, 0, this.canvasDuration.width, this.canvasDuration.height);
        this.ctxDuration.beginPath();
        this.ctxDuration.font = "16px sans-serif";
        this.ctxDuration.strokeStyle = "gray";
        this.ctxDuration.lineWidth = 16;
        this.ctxDuration.moveTo(35, this.canvasDuration.height - 35);
        this.ctxDuration.lineTo(this.canvasDuration.width - 35, this.canvasDuration.height - 35);
        this.ctxDuration.stroke();
        this.ctxDuration.closePath();
        this.ctxDuration.beginPath();
        this.ctxDuration.strokeStyle = "red";
        this.ctxDuration.lineWidth = 8;
        this.ctxDuration.moveTo(35, this.canvasDuration.height - 35);
        this.ctxDuration.lineTo(35 + (this.canvasDuration.width - 70) * (this.video.currentTime / this.video.duration), this.canvasDuration.height - 35);
        const hours = Math.floor(this.video.currentTime / 3600);
        const minutes = Math.floor((this.video.currentTime % 3600) / 60);
        const seconds = Math.floor(this.video.currentTime % 60);
        this.ctxDuration.fillText(`${hours || ''}:${minutes || ''}:${seconds}`, 2, this.canvasDuration.height - 25, 35);
        this.ctxDuration.fillText(`${this.times.hours || ''}:${this.times.minutes || ''}:${this.times.seconds}`, this.canvasDuration.width - 35, this.canvasDuration.height - 25, 35);
        this.ctxDuration.stroke();
        this.durationLineId = requestAnimationFrame(this.durationLine.bind(this));
    }
    skipDuration() {
        if (!this.video.paused) {
            this.video.currentTime += 10;
            if (this.video.currentTime > this.video.duration)
                this.video.currentTime = 0;
        }
    }
    //need work
    fullScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.video.paused) {
                console.log(1);
                yield window.screen.orientation.unlock();
            }
            else {
                console.log(2);
                yield window.screen.orientation.unlock();
            }
            console.log(3);
        });
    }
}
const videoPlayer = new VideoPlayer();
videoPlayer.uploadVideo();
