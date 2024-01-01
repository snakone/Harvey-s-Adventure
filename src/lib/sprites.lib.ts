import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../classes/canvas";
import Sprite from "../classes/sprites.class";
import { SpriteProps } from "../utils/interfaces";
export const OFFSET_X = -760;
export const OFFSET_Y = -550;

const IMAGE_WIDTH = 192;

const BACKGROUND_SPRITE: SpriteProps = {
  pos: {x: OFFSET_X, y: OFFSET_Y},
  src: 'images/Pellet_Town2.png',
  moveable: true,
  frames: 1
};

const PLAYER_SPRITE: SpriteProps = {
  pos: {x: (DEFAULT_WIDTH / 2) - IMAGE_WIDTH / 4, y: (DEFAULT_HEIGHT / 2) + 40},
  src: 'images/playerDown2.png',
  frames: 4,
  sprites: {
    up: Sprite.createImage('images/playerUp2.png'),
    down: Sprite.createImage('images/playerDown2.png'),
    left: Sprite.createImage('images/playerLeft2.png'),
    right: Sprite.createImage('images/playerRight2.png')
  }
};

const FOREGROUND_SPRITE: SpriteProps = {
  pos: {x: OFFSET_X, y: OFFSET_Y},
  src: 'images/foreground.png',
  moveable: true,
  frames: 1
};

const BATTLE_BACKGROUND_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'images/battleBackground.png',
  frames: 1
};

export const SPRITES: Sprite[] = [
  new Sprite(BACKGROUND_SPRITE),
  new Sprite(PLAYER_SPRITE),
  new Sprite(FOREGROUND_SPRITE)
];

export const BATTLE_SPRITES: Sprite[] = [
  new Sprite(BATTLE_BACKGROUND_SPRITE),
];



