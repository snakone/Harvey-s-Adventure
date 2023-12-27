import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../classes/canvas";
import Sprite from "../classes/sprites";
import { SpriteProps } from "../utils/interfaces";

export const OFFSET_X = -760;
export const OFFSET_Y = -550;

const IMAGE_WIDTH = 192;

const BACKGROUND_SPRITE: SpriteProps = {
  pos: {x: OFFSET_X, y: OFFSET_Y},
  src: 'src/assets/images/Pellet_Town.png'
};

const PLAYER_SPRITE: SpriteProps = {
  pos: {x: (DEFAULT_WIDTH / 2) - IMAGE_WIDTH / 4, y: (DEFAULT_HEIGHT / 2)},
  src: 'src/assets/images/playerDown.png',
  frames: 4
};

export const SPRITES: Sprite[] = [
  new Sprite(BACKGROUND_SPRITE, true),
  new Sprite(PLAYER_SPRITE)
];

export default SPRITES;

