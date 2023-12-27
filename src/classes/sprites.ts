import { context } from "./canvas.js";
import { SpriteProps } from "../utils/interfaces.js";
import { keys } from "../listerners/keyboard.js";

class Sprite {
  props: SpriteProps;
  current = 0; // Current FRAME
  elapsed = 0; // Elapsed FRAMES

  constructor({ pos, src, frames = 1, offset = {x: 0, y: 0}, scale = 1 }: SpriteProps, moveable = false) { 
    this.props = { pos, src, frames, offset, scale, img: this.createImage(src), moveable };
  }

  public updateSprite(): void {
    this.draw();
    this.animate();
  }

  public draw(): void {
    if (this.props.img && this.props.frames) {
      context?.drawImage(
        this.props.img, // Source
        (this.current || 0) * (this.props.img.width / this.props.frames),  // X
        0,  // Y
        this.props.img.width / this.props.frames,  // Width
        this.props.img.height,  // Height
        this.props.pos.x - (this.props.offset ? this.props.offset.x : 0), // Offset
        this.props.pos.y - (this.props.offset ? this.props.offset.y : 0), 
        (this.props.img.width / this.props.frames) * (this.props.scale || 1),  // Scale
        this.props.img.height * (this.props.scale || 1)
      );
    }

    // Sprite can Move
    if (this.props.moveable) {
      if (keys.w && keys.lastKey === 'w') this.props.pos.y += 3;
      else if (keys.a && keys.lastKey === 'a') this.props.pos.x += 3;
      else if (keys.d && keys.lastKey === 'd') this.props.pos.x -= 3;
      else if (keys.s && keys.lastKey === 's') this.props.pos.y -= 3;
    }
  }

  private createImage(src: string | undefined): HTMLImageElement {
    const image = new Image();
    if (src) image.src = src;
    return image;
  }

  public animate(): void {
    this.elapsed++;
    this.current < (this.props.frames || 1) - 1 ? 
    this.current++ : this.current = 0;
  }
}

export default Sprite;