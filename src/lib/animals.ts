import Sprite from "../classes/sprites.class";
import { SpriteProps } from "../utils/interfaces";
import { OFFSET_X, OFFSET_Y } from "./sprites.lib";

const CHICKEN_SPRITE: SpriteProps = {
  pos: {x: 400, y: 400},
  src: 'images/chicken.png',
  moveable: true,
  frames: 2,
  animated: true,
  scale: .2
};

export const ANIMAL_SPRITES: Sprite[] = [
  new Sprite(CHICKEN_SPRITE)
];