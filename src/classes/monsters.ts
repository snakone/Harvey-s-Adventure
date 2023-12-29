import Sprite from "../classes/sprites";
import { MonsterAttack } from "../lib/attacks";
import { ATTACK_SPRITES } from "../lib/sprites";
import { ATTACK_QUEUE, BATTLE_MOVABLES } from "../utils/battle_field";
import { ATTACK_ENUMS } from "../utils/enums";
import { MonsterProps } from "../utils/interfaces";
import { canvas } from "./canvas";
import gsap from "gsap";

class Monster extends Sprite {
  props: MonsterProps;

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
    enemy = false,
    ally = false,
    stats = {
      health: 100,
      level: 1,
      gender: Math.random() <= 0.5 ? 'male' : 'female',
      name: ''
    },
    attacks = []
  }: MonsterProps) {
    super({
      pos, 
      src, 
      frames, 
      scale, 
      velocity, 
      moveable, 
      moving, 
      sprites, 
      animated, 
      hold,
      opacity,
    });
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
      enemy,
      ally,
      stats,
      attacks
    };
  }
  
  public attack({
    data,
    recipent
  }: {data: MonsterAttack, recipent: Monster}) {
    if (
      this.attacking || 
      recipent.attacking || 
      recipent.props.stats!.health <= 0 ||
      this.props.stats!.health <= 0
    ) { return; }

    this.attacking = true;
    recipent.attacking = true;
    this.showBattleDialog(data, recipent);
    recipent.props.stats!.health -= data.power;

    if (recipent.props.stats!.health < 0) {
      recipent.props.stats!.health = 0;
    }

    const healthBarClass = recipent.props.enemy ? '.health-bar-enemy.green' : '.health-bar-ally.green';
    const xBounce = recipent.props.enemy ? 95 : -75;
    const yBounce = recipent.props.enemy ? 55 : -35;
    const returnBounce = recipent.props.enemy ? 25 : -25;
    const tl = gsap.timeline();

    switch(data.name) {
      case ATTACK_ENUMS.TACKLE: {
        tl.to(this.props.pos, {
          x: this.props.pos.x + xBounce,
          y: this.props.pos.y - yBounce,
          duration: 0.2,
          onComplete() {
            gsap.to(recipent.props.pos, {
              x: recipent.props.pos.x + returnBounce,
              yoyo: true,
              repeat: 3,
              duration: 0.15,
            });

            gsap.to(healthBarClass, { width: (recipent.props.stats!.health) + '%'});
    
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
          duration: 0.6,
          onComplete: () => { (this.attacking = false, recipent.attacking = false); }
        });
        break;
      }

      case ATTACK_ENUMS.FIREBALL: {
        const attack = this.props.ally ? ATTACK_SPRITES[0] : ATTACK_SPRITES[1];
        const posX = this.props.ally ? 55 : -28;
        const posY = this.props.ally ? 24 : -40;
        const rotation = this.props.ally ? (32 * Math.PI / 180) : (-65 * Math.PI / 180);

        const tookX = this.props.ally ? 12 : 20;
        const tookY = this.props.ally ? 12 : 20; 

        attack.props.pos.x = this.props.pos.x + posX;
        attack.props.pos.y = this.props.pos.y - posY;
        attack.props.rotation = rotation;

        BATTLE_MOVABLES.splice(1, 0, attack);
        
        gsap.to(attack.props.pos, {
          x: recipent.props.pos.x + tookX,
          y: recipent.props.pos.y + tookY,
          duration: 1,
          onComplete: () => {
            gsap.to(recipent.props.pos, {
              x: recipent.props.pos.x + returnBounce,
              yoyo: true,
              repeat: 3,
              duration: 0.15,
            });

            BATTLE_MOVABLES.splice(1, 1);
            gsap.to(healthBarClass, { width: (recipent.props.stats!.health) + '%'});
    
            gsap.to(recipent.props, {
              yoyo: true,
              repeat: 3,
              duration: 0.1,
              opacity: 0,
              onComplete: () => { 
                this.attacking = false;
                recipent.attacking = false;
              }
            });
          }, 
        });
        break;
      }
    }
  }

  private showBattleDialog(data: MonsterAttack, recipent: Monster): void {
    const dialogRef = document.getElementById('info-battle-dialog');

    if (dialogRef) {
      dialogRef.style.display = 'block';
      dialogRef.innerHTML = `<strong>${this.props.stats?.name}</strong> used ${data.name}
      <img class="animated bounce" src="src/assets/images/chevron-down.svg" alt="Click Here"/>`;
    }

    dialogRef?.addEventListener('click', () => {
      if (ATTACK_QUEUE.length > 0 && !recipent.attacking) {
          ATTACK_QUEUE[0]();
          ATTACK_QUEUE.shift();
      } else if (!this.attacking && !recipent.attacking) {
        dialogRef.style.display = 'none';
      }
    });
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
}

export default Monster;