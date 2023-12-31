import { canvas } from "../classes/canvas";
import Sprite from "../classes/sprites.class";
import { SPRITES } from "../lib/sprites.lib";
import { Coords } from "./interfaces";

export const background: Sprite = SPRITES[0];
export const foreground: Sprite = SPRITES[2];

export const HORIZONTAL_TILES = 70;
export const DEFAULT_VELOCITY = 3;
export const RUNNING_VELOCITY = 5;

export const RECT_WIDTH = 48;
export const RECT_HEIGHT = 48;

export const RANDOM_BATTLE_NUMBER = 1;
export const DEFAULT_SPRITE_HOLD = 15;
export const RUNNING_SPRITE_HOLD = 4;

export const DEFAULT_ALLY_SPRITE_X = -48;
export const DEFAULT_ENEMY_SPRITE_X = canvas.width + 48;
export const DEFAULT_ALLY_SPRITE_Y = 325;
export const DEFAULT_ENEMY_SPRITE_Y = 100;

export const DEFAULT_ENEMY_BATTLE_POSITION: Coords = { x: DEFAULT_ENEMY_SPRITE_X, y: DEFAULT_ENEMY_SPRITE_Y };
export const DEFAULT_ALLY_BATTLE_POSITION: Coords = {x: DEFAULT_ALLY_SPRITE_X, y: DEFAULT_ALLY_SPRITE_Y };

export const BATTLE_LOOP_TIME = 1500;

export const CLICK_HERE_BATTLE_DIALOG_IMAGE = '<img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>';