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
const canvas = document.getElementById('canvas');
const video = document.getElementsByTagName('video')[0];
const camira = document.getElementsByClassName('camira')[0];
const start = document.getElementsByClassName('start')[0];
const stop = document.getElementsByClassName('end')[0];
const ctx = canvas.getContext('2d');
let mediaRecorder, chunks = [];
canvas.width = camira.clientWidth;
canvas.height = camira.clientHeight;
function playVideo(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stream = yield navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
            video.srcObject = stream;
            video.play();
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            cb();
        }
        catch (error) {
            console.error('Error accessing webcam:', error);
        }
    });
}
function draw() {
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
}
playVideo(draw);
start.addEventListener('click', () => {
    mediaRecorder.start();
});
stop.addEventListener('click', () => {
    mediaRecorder.stop();
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
        const videoRecorded = new Blob(chunks, { type: 'video/webm' });
        chunks = [];
        const url = URL.createObjectURL(videoRecorded);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.webm';
        a.click();
        URL.revokeObjectURL(url);
    };
});
addEventListener('dblclick', takePhotos);
//@ts-ignore
function takePhoto() {
    canvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.jpeg';
            a.click();
            URL.revokeObjectURL(url);
        }
    }, 'image/jpeg');
}
function takePhotos() {
    const url = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images.jpeg';
    a.click();
}
