import '../css/style.css'
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const video = document.getElementsByTagName('video')![0] as HTMLVideoElement;
const camira = document.getElementsByClassName('camira')[0] as HTMLDivElement;
const start = document.getElementsByClassName('start')[0] as HTMLButtonElement;
const stop = document.getElementsByClassName('end')[0] as HTMLButtonElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
let mediaRecorder: any, chunks: Blob[] = [];
canvas.width = camira.clientWidth;
canvas.height = camira.clientHeight;
async function playVideo(cb: () => void): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: 'user'}, audio: true });
    video.srcObject = stream;
    video.play();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })

    cb();
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}
function draw(): void {
  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}
playVideo(draw)
start.addEventListener('click', () => {
  mediaRecorder.start();
})
stop.addEventListener('click', () => {
  mediaRecorder.stop();
  mediaRecorder.ondataavailable = (e: BlobEvent) => {
    chunks.push(e.data);
    const videoRecorded = new Blob(chunks, { type: 'video/webm' });
    chunks = [];
    const url = URL.createObjectURL(videoRecorded);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video.webm';
    a.click();
    URL.revokeObjectURL(url);
  }
})
addEventListener('dblclick',takePhotos)
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
  const url = canvas.toDataURL('image/jpeg')
  const a = document.createElement('a');
  a.href = url;
  a.download = 'images.jpeg';
  a.click();
  
}