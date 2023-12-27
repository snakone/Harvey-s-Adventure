import { canvas, context } from "../classes/canvas";
import BOUNDARIES from "../lib/boundaries";
import SPRITES from "../lib/sprites";
import { listenKeyboard } from "../listerners/keyboard";

export function start(): void {
  animate();
  listenKeyboard();
}

function animate(): void {
  window.requestAnimationFrame(animate);
  checkSprites();
  drawBoundaries();
  fill(context);
}

export function fill(
  ctx: CanvasRenderingContext2D | null
): void {
  if (ctx) {
    ctx.fillStyle = 'rgba(255,255,255, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
}

function checkSprites(): void {
  SPRITES.forEach(s => s.updateSprite());
}

function drawBoundaries(): void {
  BOUNDARIES.forEach(boundary => boundary.draw());
}

