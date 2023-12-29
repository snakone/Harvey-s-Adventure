import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../classes/canvas";
import Sprite from "../classes/sprites";
import { SpriteProps } from "../utils/interfaces";
export const OFFSET_X = -760;
export const OFFSET_Y = -550;

const IMAGE_WIDTH = 192;

const BACKGROUND_SPRITE: SpriteProps = {
  pos: {x: OFFSET_X, y: OFFSET_Y},
  src: 'src/assets/images/Pellet_Town2.png',
  moveable: true,
  frames: 1
};

const PLAYER_SPRITE: SpriteProps = {
  pos: {x: (DEFAULT_WIDTH / 2) - IMAGE_WIDTH / 4, y: (DEFAULT_HEIGHT / 2) + 40},
  src: 'src/assets/images/playerDown.png',
  frames: 4,
  sprites: {
    up: Sprite.createImage('src/assets/images/playerUp.png'),
    down: Sprite.createImage('src/assets/images/playerDown.png'),
    left: Sprite.createImage('src/assets/images/playerLeft.png'),
    right: Sprite.createImage('src/assets/images/playerRight.png')
  }
};

const FOREGROUND_SPRITE: SpriteProps = {
  pos: {x: OFFSET_X, y: OFFSET_Y},
  src: 'src/assets/images/foreground.png',
  moveable: true,
  frames: 1
};

const BATTLE_BACKGROUND_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'src/assets/images/battleBackground.png',
  frames: 1
};

const FIREBALL_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'src/assets/images/fireball.png',
  frames: 4,
  animated: true
};

const FIREBALL_ROTATED_ATTACK_SPRITE: SpriteProps = {
  pos: {x: 0, y: 0},
  src: 'src/assets/images/fireball_rotated.png',
  frames: 4,
  animated: true
};

export const SPRITES: Sprite[] = [
  new Sprite(BACKGROUND_SPRITE),
  new Sprite(PLAYER_SPRITE),
  new Sprite(FOREGROUND_SPRITE)
];

export const BATTLE_SPRITES: Sprite[] = [
  new Sprite(BATTLE_BACKGROUND_SPRITE),
];

export const ATTACK_SPRITES: Sprite[] = [
  new Sprite(FIREBALL_ATTACK_SPRITE),
  new Sprite(FIREBALL_ROTATED_ATTACK_SPRITE)
];


