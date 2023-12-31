import { canvas } from "../classes/canvas";
import Sprite from "../classes/sprites";
import { DEFAULT_ALLY_SPRITE_Y, DEFAULT_ENEMY_SPRITE_Y } from "../utils/constants";
import { MonsterProps } from "../utils/interfaces";
import { MONSTER_ATTACKS } from "./attacks";

export const DRAGGLE_MONSTER_SPRITE: MonsterProps = {
  pos: {x: canvas.width + 48, y: DEFAULT_ENEMY_SPRITE_Y},
  src: 'images/draggleSpriteFront.png',
  frames: 4,
  animated: true,
  hold: 35,
  enemy: true,
  scale: .5,
  sprites:{ 
    front: Sprite.createImage('images/draggleSpriteFront.png'),
    back: Sprite.createImage('images/draggleSpriteBack.png')
  },
  stats: {
    name: 'Draggle',
    level: 3,
    gender: 'female',
    givenExp: 100
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const EMBY_MONSTER_SPRITE: MonsterProps = {
  pos: {x: -48, y: DEFAULT_ALLY_SPRITE_Y},
  src: 'images/embySpriteBack.png',
  frames: 4,
  animated: true,
  hold: 15,
  ally: true,
  scale: .5,
  sprites:{ 
    front: Sprite.createImage('images/embySpriteFront.png'),
    back: Sprite.createImage('images/embySpriteBack.png')
  },
  stats: {
    name: 'Emby',
    level: 5,
    gender: 'male',
    givenExp: 30,
    totalExp: 10
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

