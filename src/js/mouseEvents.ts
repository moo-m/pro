import '../css/style.css'
interface Touch {
  x: HTMLDivElement;
  y: HTMLDivElement;
  run(): void;
}
class MouseEvent implements Touch {
  x: HTMLDivElement;
  y: HTMLDivElement;

  constructor() {
    this.x = document.querySelector('.x')!;
    this.y = document.querySelector('.y')!;

  }
  run(): void {
    document.addEventListener('touchmove', (e: TouchEvent): void => {
      e.preventDefault()
      this.x.textContent = `X => ${e.touches[0].clientX.toFixed()}`
      this.y.textContent = `E => ${e.touches[0].clientY.toFixed()}`
    })
  }
}
const mouse = new MouseEvent()
mouse.run()