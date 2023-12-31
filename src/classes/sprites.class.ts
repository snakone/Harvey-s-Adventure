import { context } from "./canvas.js";
import { SpriteProps } from "../utils/interfaces.js";
import { checkMove } from "../utils/collisions.js";

class Sprite {
  props: SpriteProps;
  current = 0; // Current FRAME
  elapsed = 0; // Elapsed FRAMES
  attacking = false;

  constructor({ 
    pos, 
    src, 
    frames = 0, 
    scale = 1, 
    velocity = 3, 
    moveable = false, 
    moving = false, 
    sprites, 
    animated = false, 
    hold = 15,
    opacity = 1,
    rotation = 0
  }: SpriteProps) { 
    this.props = { 
      pos, 
      src, 
      frames, 
      scale, 
      img: Sprite.createImage(src),
      moveable,
      velocity,
      moving,
      sprites,
      animated,
      hold,
      opacity,
      rotation
    };
  }

  public updateSprite(): void {
    this.draw();
    this.animate();
  }

  public draw(): void {
    context?.save();
    context?.translate(this.props.pos!.x + 24, this.props.pos!.y + 24);
    context?.rotate(this.props.rotation || 0);
    context?.translate(-this.props.pos!.x - 24, -this.props.pos!.y - 24);
    context!.globalAlpha = this.props.opacity !== undefined ? this.props.opacity : 1; 
    if (this.props.img && this.props.frames) {
      context?.drawImage(
        this.props.img, // Source
        0,  // X
        (this.current || 0) * (this.props.img.height / this.props.frames),  // Y
        this.props.img.width,  // Width
        this.props.img.height / this.props.frames,  // Height
        this.props.pos!.x, // Offset
        this.props.pos!.y, 
        (this.props.img.width) * (this.props.scale || 1),  // Scale
        (this.props.img.height / this.props.frames) * (this.props.scale || 1)
      );

      context?.restore();
    }

    checkMove(this);
  }

  static createImage(src: string | undefined): HTMLImageElement {
    const image = new Image();
    if (src) image.src = src;
    return image;
  }

  public animate(): void {
    if (this.props.frames) {
      this.elapsed++;
    }

    if (!this.props.moving) { return; }

    if (
      this.elapsed % (this.props.hold || 15) === 0 || 
      (this.current === 0 && !this.props.animated)
    ) {
      this.current < (this.props.frames || 1) - 1 ? 
      this.current++ : this.current = 0;
    }
  }
}

export default Sprite;