import Sprite from "../classes/sprites.class";
import { MONSTERS_ENUM, MONSTER_GENDER_ENUM } from "../utils/enums";
import { MonsterProps } from "../utils/interfaces";
import { MONSTER_ATTACKS } from "./attacks";

export const DRAGGLE_MONSTER_SPRITE: MonsterProps = {
  src: 'images/draggleSpriteFront.png',
  frames: 4,
  animated: true,
  hold: 35,
  scale: .5,
  sprites:{ 
    front: Sprite.createImage('images/draggleSpriteFront.png'),
    back: Sprite.createImage('images/draggleSpriteBack.png')
  },
  stats: {
    name: 'Draggle',
    level: 3,
    gender: MONSTER_GENDER_ENUM.FEMALE,
    givenExp: 100
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const EMBY_MONSTER_SPRITE: MonsterProps = {
  src: 'images/embySpriteBack.png',
  frames: 4,
  animated: true,
  hold: 15,
  scale: .5,
  sprites:{ 
    front: Sprite.createImage('images/embySpriteFront.png'),
    back: Sprite.createImage('images/embySpriteBack.png')
  },
  stats: {
    name: 'Emby',
    level: 5,
    gender: MONSTER_GENDER_ENUM.MALE,
    givenExp: 30,
    totalExp: 10
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const MONSTER_LIBRARY:{[key in MONSTERS_ENUM]: MonsterProps} = {
  Emby: EMBY_MONSTER_SPRITE,
  Draggle: DRAGGLE_MONSTER_SPRITE
};

Object.values(MONSTER_LIBRARY).forEach(monster => Object.freeze(monster));

