import Monster from "../classes/monsters.class";
import gsap from "gsap";
import { ATTACK_ENUMS, ELEMENTALS_ENUM } from "../utils/enums";
import { BATTLE_MOVABLES } from "../utils/battle_field";
import { MonsterAttack, SpriteProps } from "../utils/interfaces";
import { AUDIO_LIBRARY } from "./audio.lib";
import Sprite from "../classes/sprites.class";

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
  },
  IceShot: {
    name: ATTACK_ENUMS.ICE_SHOT,
    power: 25,
    type: ELEMENTALS_ENUM.ICE
  }
}

export const FIREBALL_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'images/fireball.png',
  frames: 4,
  animated: true
};

export const FIREBALL_ROTATED_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'images/fireball_rotated.png',
  frames: 4,
  animated: true
};

export const ICE_SHOT_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'images/iceshot.png',
  frames: 4,
  animated: true
};

export const ICE_SHOT_ROTATED_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'images/iceshot_rotated.png',
  frames: 4,
  animated: true
};

export const ATTACK_SPRITES: Sprite[] = [
  new Sprite(FIREBALL_ATTACK_SPRITE),
  new Sprite(FIREBALL_ROTATED_ATTACK_SPRITE),
  new Sprite(ICE_SHOT_ATTACK_SPRITE),
  new Sprite(ICE_SHOT_ROTATED_ATTACK_SPRITE)
];

export const SWITCH_ATTACK_NAME = {
  Tackle: MONSTER_ATTACKS.Tackle,
  Fireball: MONSTER_ATTACKS.Fireball,
  IceShot: MONSTER_ATTACKS.IceShot
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
      duration: 0.4,
      onComplete() {
        gsap.to(recipent.props.pos!, {
          x: recipent.props.pos!.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        AUDIO_LIBRARY.tackleHit.play();
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
      onStart: () => {AUDIO_LIBRARY.initFireball.play()},
      onComplete: () => {
        gsap.to(recipent.props.pos!, {
          x: recipent.props.pos!.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        BATTLE_MOVABLES.splice(1, 1);
        AUDIO_LIBRARY.fireballHit.play();
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
  },
  IceShot: () => {
    const attack = !attacker.enemy ? ATTACK_SPRITES[2] : ATTACK_SPRITES[3];
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
      onStart: () => {AUDIO_LIBRARY.initFireball.play()},
      onComplete: () => {
        gsap.to(recipent.props.pos!, {
          x: recipent.props.pos!.x + recoil,
          yoyo: true,
          repeat: 3,
          duration: 0.15,
        });

        BATTLE_MOVABLES.splice(1, 1);
        AUDIO_LIBRARY.fireballHit.play();
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

