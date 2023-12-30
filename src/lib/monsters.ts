import { canvas } from "../classes/canvas";
import { MonsterProps } from "../utils/interfaces";
import { MONSTER_ATTACKS } from "./attacks";

export const DRAGGLE_MONSTER_SPRITE: MonsterProps = {
  pos: {x: canvas.width + 48, y: 100},
  src: 'images/draggleSprite.png',
  frames: 4,
  animated: true,
  hold: 35,
  enemy: true,
  stats: {
    name: 'Draggle',
    level: 3,
    gender: 'female',
    health: 100,
    dead: false
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

export const EMBY_MONSTER_SPRITE: MonsterProps = {
  pos: {x: -48, y: 325},
  src: 'images/embySprite.png',
  frames: 4,
  animated: true,
  hold: 15,
  ally: true,
  stats: {
    name: 'Emby',
    level: 5,
    gender: 'male',
    health: 100,
    dead: false
  },
  attacks: [MONSTER_ATTACKS.Tackle, MONSTER_ATTACKS.Fireball]
};

