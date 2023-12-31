import Boundary from "../classes/boundary";
import Sprite from "../classes/sprites";
import { SpriteProps } from "./interfaces";
import { keys } from "../listerners/keyboard";
import { PALLET_TOWN_COLLISION } from "../lib/pallet_town";

import { 
  HORIZONTAL_TILES, 
  RUNNING_VELOCITY, 
  DEFAULT_VELOCITY, 
  DEFAULT_SPRITE_HOLD, 
  RUNNING_SPRITE_HOLD 
} from "./constants";

export function createCollisionMap(): number[][] {
  const subTile = [];
  for (let i = 0; i < PALLET_TOWN_COLLISION.length; i += HORIZONTAL_TILES) {
    subTile.push(PALLET_TOWN_COLLISION.slice(i, HORIZONTAL_TILES + i));
  }
  return subTile;
}

export function checkCollision(
  player: Sprite,
  boundary: Boundary,
  ratio = 15
): boolean {

  let playerX = player.props.pos.x;
  let playerY = player.props.pos.y;
  const playerWidth = player.props.img?.width || 0;
  const playerHeight = player.props.img?.height || 0;

  const boundX = boundary.props.pos.x;
  const boundY = boundary.props.pos.y;

  const halfPlayerHeight = playerHeight / 4;

  const isOverlapX = (x1: number, x2: number, width: number) => x1 + playerWidth >= x2 && x1 <= x2 + width;
  const isOverlapY = (y1: number, y2: number, height: number) => y1 <= y2 + height && y1 + halfPlayerHeight >= y2;

  if (keys.running) {
    playerX += RUNNING_VELOCITY - DEFAULT_VELOCITY;
    playerY += RUNNING_VELOCITY - DEFAULT_VELOCITY;
    player.props.hold = RUNNING_SPRITE_HOLD;
  } else {
    player.props.hold = DEFAULT_SPRITE_HOLD;
  }

  switch (keys.lastKey) {
    case 'w':
      return isOverlapX(playerX, boundX, 48) &&
             isOverlapY(playerY, boundY + ratio, 48 + ratio);

    case 'a':
      return isOverlapX(playerX, boundX + ratio, 48 + ratio) &&
             isOverlapY(playerY, boundY, 48);

    case 's':
      return isOverlapX(playerX, boundX, 48) &&
             isOverlapY(playerY, boundY - ratio, 48 - ratio);

    case 'd':
      return isOverlapX(playerX, boundX - ratio, 48 - ratio) &&
             isOverlapY(playerY, boundY, 48);
  }

  return false;
}

export function checkMove(sprite: Boundary | Sprite): void {
  const props = sprite.props;
  props.velocity = keys.running ? RUNNING_VELOCITY : DEFAULT_VELOCITY;
  
  if ('moving' in props) {
    props.moving = false;
  }

  // KEYBOARD
  if (props.moveable) {
    if (keys.w) props.pos.y += props.velocity || DEFAULT_VELOCITY;
    if (keys.a) props.pos.x += props.velocity || DEFAULT_VELOCITY;
    if (keys.d) props.pos.x -= props.velocity || DEFAULT_VELOCITY;
    if (keys.s) props.pos.y -= props.velocity || DEFAULT_VELOCITY;
  }

  // SPRITE CHANGE
  if (keys.w && 'img' in props && props.sprites) props.img = props.sprites.up;
  if (keys.a && 'img' in props && props.sprites) props.img = props.sprites.left;
  if (keys.d && 'img' in props && props.sprites) props.img = props.sprites.right;
  if (keys.s && 'img' in props && props.sprites) props.img = props.sprites.down;

  if ((keys.w || keys.a || keys.d || keys.s || (props as SpriteProps).animated) && 'moving' in props) props.moving = true;
}