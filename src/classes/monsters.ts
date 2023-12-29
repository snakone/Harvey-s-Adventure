import Sprite from "../classes/sprites";
import { MonsterAttack } from "../lib/attacks";
import { ATTACK_SPRITES } from "../lib/sprites";
import { ATTACK_QUEQUE } from "../utils/battle_field";
import { BATTLE_MOVABLES } from "../utils/functions";
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
      recipent.props.stats!.health <= 0 ||
      this.props.stats!.health <= 0
    ) { return; }

    this.attacking = true;
    this.showBattleDialog(data);

    recipent.props.stats!.health -= data.power;

    if (recipent.props.stats!.health < 0) {
      recipent.props.stats!.health = 0;
    }

    const healthBarClass = recipent.props.enemy ? '.health-bar-enemy.green' : '.health-bar-ally.green';
    const xBounce = recipent.props.enemy ? 95 : -75;
    const yBounce = recipent.props.enemy ? 55 : -35;
    const returnBounce = recipent.props.enemy ? 25 : -25;

    switch(data.name) {
      case 'Tackle': {
        const tl = gsap.timeline();
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
          duration: 0.6
        }).then(_ => {this.attacking = false});
        break;
      }

      case 'Fireball': {
        const attack = ATTACK_SPRITES[0];
        attack.props.pos.x = this.props.pos.x;
        attack.props.pos.y = this.props.pos.y;
        BATTLE_MOVABLES.splice(3, 0, attack);

        gsap.to(attack.props.pos, {
          x: recipent.props.pos.x,
          y: recipent.props.pos.y,
          duration: .666,
          onComplete: () => {
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
            });

            BATTLE_MOVABLES.splice(3, 1);
          }, 
        }).then(_ => this.attacking = false);
        break;
      }
    }
  }

  private showBattleDialog(data: MonsterAttack): void {
    const dialog = document.getElementById('info-battle-dialog');

    if (dialog) {
      dialog.style.display = 'block';
      dialog.innerHTML = `<strong>${this.props.stats?.name}</strong> used ${data.name}
      <img class="animated bounce" src="src/assets/images/chevron-down.svg" alt="Click Here"/>`;
    }
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

const dialogInfoRef = document.getElementById('info-battle-dialog');

dialogInfoRef?.addEventListener('click', () => {
  dialogInfoRef.style.display = 'none';
});

export default Monster;