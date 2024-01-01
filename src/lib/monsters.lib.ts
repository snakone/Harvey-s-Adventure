import Sprite from "../classes/sprites.class";
import { DEFAULT_MONSTER_SCALE } from "../utils/constants";
import { MONSTERS_ENUM, MONSTER_GENDER_ENUM } from "../utils/enums";
import { MonsterProps } from "../utils/interfaces";
import { MONSTER_ATTACKS } from "./attacks";

export const DRAGGLE_MONSTER_SPRITE: MonsterProps = {
  src: 'images/draggleSpriteFront.png',
  frames: 4,
  animated: true,
  hold: 35,
  scale: DEFAULT_MONSTER_SCALE,
  name: 'Draggle',
  sprites:{ 
    front: Sprite.createImage('images/draggleSpriteFront.png'),
    back: Sprite.createImage('images/draggleSpriteBack.png')
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const BUTTERFLOP_MONSTER_SPRITE: MonsterProps = {
  src: 'images/butterflopSpriteFront.png',
  frames: 4,
  animated: true,
  hold: 35,
  scale: DEFAULT_MONSTER_SCALE,
  name: 'Butterflop',
  sprites:{ 
    front: Sprite.createImage('images/butterflopSpriteFront.png'),
    back: Sprite.createImage('images/butterflopSpriteBack.png')
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball, MONSTER_ATTACKS.IceShot]
};

export const EMBY_MONSTER_SPRITE: MonsterProps = {
  src: 'images/embySpriteBack.png',
  frames: 4,
  animated: true,
  hold: 15,
  scale: DEFAULT_MONSTER_SCALE,
  name: 'Emby',
  sprites:{ 
    front: Sprite.createImage('images/embySpriteFront.png'),
    back: Sprite.createImage('images/embySpriteBack.png')
  },
  stats: {
    level: 5,
    gender: MONSTER_GENDER_ENUM.MALE,
    givenExp: 100,
    totalExp: 10
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const MONSTER_LIBRARY:{[key in MONSTERS_ENUM]: MonsterProps} = {
  Emby: EMBY_MONSTER_SPRITE,
  Draggle: DRAGGLE_MONSTER_SPRITE,
  Butterflop: BUTTERFLOP_MONSTER_SPRITE
};

Object.values(MONSTER_LIBRARY).forEach(monster => Object.freeze(monster));

