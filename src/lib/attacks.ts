import Monster from "../classes/monsters";
import gsap from "gsap";
import { ATTACK_SPRITES } from "./sprites";
import { ATTACK_ENUMS, ELEMENTALS } from "../utils/enums";
import { BATTLE_MOVABLES } from "../utils/battle_field";

export const MONSTER_ATTACKS: {[key in ATTACK_ENUMS]: MonsterAttack} = {
  Tackle: {
    name: ATTACK_ENUMS.TACKLE,
    power: 10,
    type: ELEMENTALS.NORMAL
  },
  Fireball: {
    name: ATTACK_ENUMS.FIREBALL,
    power: 100,
    type: ELEMENTALS.FIRE
  }
}

export interface MonsterAttack {
  name: ATTACK_ENUMS;
  power: number;
  type: ELEMENTALS;
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
    tl.to(attacker.props.pos, {
      x: attacker.props.pos.x + xBounce,
      y: attacker.props.pos.y - yBounce,
      duration: 0.2,
      onComplete() {
        gsap.to(recipent.props.pos, {
          x: recipent.props.pos.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        gsap.to(cssClass, { width: (recipent.props.stats!.health) + '%'});

        gsap.to(recipent.props, {
          yoyo: true,
          repeat: 3,
          duration: 0.1,
          opacity: 0
        })
      }, 
    }).to(attacker.props.pos, {
      x: attacker.props.pos.x,
      y: attacker.props.pos.y,
      duration: 0.6,
      onComplete: () => { (attacker.attacking = false, recipent.attacking = false); }
    });
  },
  Fireball: () => {
    const attack = attacker.props.ally ? ATTACK_SPRITES[0] : ATTACK_SPRITES[1];
    const posX = attacker.props.ally ? 55 : -28;
    const posY = attacker.props.ally ? 24 : -40;
    const rotation = attacker.props.ally ? (32 * Math.PI / 180) : (-65 * Math.PI / 180);

    const tookX = attacker.props.ally ? 12 : 20;
    const tookY = attacker.props.ally ? 12 : 20; 

    attack.props.pos.x = attacker.props.pos.x + posX;
    attack.props.pos.y = attacker.props.pos.y - posY;
    attack.props.rotation = rotation;

    BATTLE_MOVABLES.splice(1, 0, attack);
    
    gsap.to(attack.props.pos, {
      x: recipent.props.pos.x + tookX,
      y: recipent.props.pos.y + tookY,
      duration: 1,
      onComplete: () => {
        gsap.to(recipent.props.pos, {
          x: recipent.props.pos.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        BATTLE_MOVABLES.splice(1, 1);
        gsap.to(cssClass, { width: (recipent.props.stats!.health) + '%'});

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

