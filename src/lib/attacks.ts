import Monster from "../classes/monsters.class";
import gsap from "gsap";
import { ATTACK_SPRITES } from "./sprites.lib";
import { ATTACK_ENUMS, ELEMENTALS_ENUM } from "../utils/enums";
import { BATTLE_MOVABLES } from "../utils/battle_field";
import { MonsterAttack } from "../utils/interfaces";

export const MONSTER_ATTACKS: {[key in ATTACK_ENUMS]: MonsterAttack} = {
  Tackle: {
    name: ATTACK_ENUMS.TACKLE,
    power: 100,
    type: ELEMENTALS_ENUM.NORMAL
  },
  Fireball: {
    name: ATTACK_ENUMS.FIREBALL,
    power: 15,
    type: ELEMENTALS_ENUM.FIRE
  }
}

export const SWITCH_ATTACK_NAME = {
  Tackle: MONSTER_ATTACKS.Tackle,
  Fireball: MONSTER_ATTACKS.Fireball
}

export const ATTACK_ANIMATIONS = (
  attacker: Monster,
  recipent: Monster,
  tl: gsap.core.Timeline,
  xBounce: number,
  yBounce: number,
  recoil: number,
  cssClass: string
): {[key in ATTACK_ENUMS]: (() => void)} => ({
  Tackle: () => {
    tl.to(attacker.props.pos!, {
      x: attacker.props.pos!.x + xBounce,
      y: attacker.props.pos!.y - yBounce,
      duration: 0.2,
      onComplete() {
        gsap.to(recipent.props.pos!, {
          x: recipent.props.pos!.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        gsap.to(cssClass, { width: (recipent.props.stats!.health) + '%', duration: 2});

        gsap.to(recipent.props, {
          yoyo: true,
          repeat: 3,
          duration: 0.1,
          opacity: 0
        })
      }, 
    }).to(attacker.props.pos!, {
      x: attacker.props.pos!.x,
      y: attacker.props.pos!.y,
      duration: 0.6,
      onComplete: () => {
        attacker.attacking = false;
        recipent.attacking = false;
      }
    });
  },
  Fireball: () => {
    const attack = !attacker.enemy ? ATTACK_SPRITES[0] : ATTACK_SPRITES[1];
    const posX = !attacker.enemy ? 55 : -28;
    const posY = !attacker.enemy ? 24 : -40;
    const rotation = !attacker.enemy ? (32 * Math.PI / 180) : (-65 * Math.PI / 180);

    const tookX = !attacker.enemy ? 12 : 20;
    const tookY = !attacker.enemy ? 12 : 20; 

    attack.props.pos!.x = attacker.props.pos!.x + posX;
    attack.props.pos!.y = attacker.props.pos!.y - posY;
    attack.props.rotation = rotation;

    BATTLE_MOVABLES.splice(1, 0, attack);
    
    gsap.to(attack.props.pos!, {
      x: recipent.props.pos!.x + tookX,
      y: recipent.props.pos!.y + tookY,
      duration: 1,
      onComplete: () => {
        gsap.to(recipent.props.pos!, {
          x: recipent.props.pos!.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        BATTLE_MOVABLES.splice(1, 1);
        gsap.to(cssClass, { width: (recipent.props.stats!.health) + '%', duration: 2});

        gsap.to(recipent.props, {
          yoyo: true,
          repeat: 3,
          duration: 0.1,
          opacity: 0,
          onComplete: () => { 
            attacker.attacking = false;
            recipent.attacking = false;
          }
        });
      }, 
    });
  }
})

