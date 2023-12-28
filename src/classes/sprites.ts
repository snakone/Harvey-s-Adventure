import { canvas, context } from "./canvas.js";
import { SpriteProps } from "../utils/interfaces.js";
import { checkMove } from "../utils/collisions.js";
import gsap from "gsap";

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
    enemy = false,
    ally = false,
    opacity = 1,
    stats = {
      health: 100,
      level: 1,
      gender: Math.random() <= 0.5 ? 'male' : 'female',
      name: ''
    }
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
      enemy,
      ally,
      opacity,
       stats
    };
  }

  public updateSprite(): void {
    this.draw();
    this.animate();
  }

  public attack({
    data,
    recipent
  }: any) {
    if (this.attacking || recipent.props.stats.health <= 0) { return; }

    this.attacking = true;
    recipent.props.stats.health -= data.power;
    
    const tl = gsap.timeline();
    tl.to(this.props.pos, {
      x: this.props.pos.x + 95,
      y: this.props.pos.y - 55,
      duration: 0.2,
      onComplete() {
        gsap.to(recipent.props.pos, {
          x: recipent.props.pos.x + 15,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        gsap.to('.health-bar.green', {
          width: (recipent.props.stats.health) + '%'
        })

        gsap.to(recipent.props, {
          yoyo: true,
          repeat: 3,
          duration: 0.1,
          opacity: 0
        })
      }, 
    }).to(this.props.pos, {
      x: this.props.pos.x,
      y: this.props.pos.y,
      duration: 0.6
    }).then(_ => this.attacking = false);
  }

  public checkStartBattleAnimation(): void {
    if (this.props.enemy) {
      if (this.props.pos.x > canvas.width - (this.props.img ? (this.props.img.width / 2) + 48 : 0)) {
        this.props.pos.x -= 12;
      }
    } else if (this.props.ally) {
      if (this.props.pos.x < (this.props.img ? (this.props.img.width - 48) : 0)) {
        this.props.pos.x += 15;
      }
    }
  }

  public draw(): void {
    context?.save();
    context!.globalAlpha = this.props.opacity || 1; 
    if (this.props.img && this.props.frames) {
      context?.drawImage(
        this.props.img, // Source
        (this.current || 0) * (this.props.img.width / this.props.frames),  // X
        0,  // Y
        this.props.img.width / this.props.frames,  // Width
        this.props.img.height,  // Height
        this.props.pos.x, // Offset
        this.props.pos.y, 
        (this.props.img.width / this.props.frames) * (this.props.scale || 1),  // Scale
        this.props.img.height * (this.props.scale || 1)
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

    if (this.elapsed % (this.props.hold || 15) === 0 || (this.current === 0 && !this.props.animated)) {
      this.current < (this.props.frames || 1) - 1 ? 
      this.current++ : this.current = 0;
    }
  }
}

export default Sprite;