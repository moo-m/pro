import '../css/style.css';
//const canvasContainer = document.querySelector(".bools")! as HTMLDivElement;

type XandYType = {
  x: number | undefined,
  y: number | undefined
}
type Arguments = { x: number, y: number, dx: number, dy: number, color: string, radius: number }
interface ArtInterface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D
  canvasContainer: HTMLDivElement
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  radius: number;
  arrCircle: Arguments[];
  draw(): void;
  update(): void;
  genirate(): void;
}
const XandY: XandYType = {
  x: undefined,
  y: undefined
}

class Art implements ArtInterface {
  ctx: CanvasRenderingContext2D
  canvasContainer: HTMLDivElement
  arrCircle: Arguments[]
  canvas: HTMLCanvasElement;
  constructor( public x: number, public y: number, public dx: number = 1, public dy: number = 1, public color: string, public radius: number) {
    this.arrCircle = []
    this.canvas = document.getElementById('canvas-bool')! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')! as CanvasRenderingContext2D;
    this.canvasContainer = document.querySelector(".bools")! as HTMLDivElement;
  }
  
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    //this.ctx.closePath();

  }
  update() {
    this.draw()
    this.x += this.dx;
    this.y += this.dy;
    
    if (Math.abs(XandY.x as number - this.x) < 50 && Math.abs(XandY.y as number - this.y) < 50 ) {
      if (this.radius > 30) {
        this.radius = 30
      };
  this.radius++
} else if(this.radius>10){
  this.radius--
}

    if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    requestAnimationFrame(this.update.bind(this))
  }
  genirate(): void {
    this.canvas.width =  this.   
    canvasContainer.clientWidth;
    this.canvas.height = this.   
    canvasContainer.clientHeight;
    setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, 0)
    const colors: string[] = [
      "#FF0000", // Red
      "#00FF00", // Green
      "#0000FF", // Blue
      "#FFFF00", // Yellow
      "#00FFFF", // Cyan
      "#FF00FF", // Magenta
      "#000000", // Black
      "#FFFFFF", // White
      "#FFA500", // Orange
      "#800080",  // Purple
      "#A52A2A", // Brown
      "#808080", // Gray
      "#008000", // Dark Green
      "#800000", // Maroon
      "#808000", // Olive
      "#000080", // Navy
      "#008080", // Teal
      "#800000", // Maroon
      "#800080", // Purple
      
    ];

    for (let j = 0; j < 20; j++) {
      for (let i = j; i < 50; i++) {
        this.arrCircle.push(
          {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            dx: Math.sin(i*3),
            dy: Math.cos(j * 10),
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.floor(Math.random() * 10)
          })
      }
    }
     
    this.arrCircle.forEach((art) => {
      new Art( art.x, art.y, art.dx, art.dy, art.color, art.radius).update()
    

    })
  }

   

}
const art = new Art(0,0,0,0,'',0);
art.genirate()
art.canvas.addEventListener('touchmove', (e: TouchEvent): void => {
  XandY.x = e.touches[0].clientX;
  XandY.y = e.touches[0].clientY;
})