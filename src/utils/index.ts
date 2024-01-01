import { canvas, context } from "../classes/canvas";
import BATTLE_ZONES from "../lib/battle_zones.lib";
import BOUNDARIES from "../lib/boundaries.lib";
import { checkCollision } from "./collisions";
import { SPRITES } from "../lib/sprites.lib";
import { gameKeys, listenKeyboard } from "../listerners/keyboard";
import { RANDOM_BATTLE_NUMBER, background, foreground } from "./constants";
import Monster from "../classes/monsters.class";
import Player from "../classes/player";
import { MONSTER_LIBRARY } from "../lib/monsters.lib";

import { 
  battleMap, 
  activeBattle
} from "./battle_field";
import { getOverlappingBattleArea } from "./functions";
import { ANIMAL_SPRITES } from "../lib/animals";

export let returnFromBattle = false;
export let animationLoop: number;
export const character = new Player(SPRITES[1]);
const MOVABLES = [background, ...BOUNDARIES, foreground, ...BATTLE_ZONES, ...ANIMAL_SPRITES];

/**
 * Singleton function that starts the Game.
 * @returns {void}
 */
export function start(): void {
  animate();
  listenKeyboard();
  character.createTeam(new Monster(MONSTER_LIBRARY.Butterflop, false));
  // listenGamePad();
}

/**
 * Main Function for the Game Map
 * 
 * Uses RAF (Request Animation Frame)
 * @returns {void}
 * @function drawSprites
 * @function drawBattleZones
 * @function drawBoundaries
 */
export function animate(): void {
  animationLoop = window.requestAnimationFrame(() => animate());
  if (battleMap.initilized) { return; }
  // scanGamePads();
  drawSprites();
  drawBattleZones();
  drawBoundaries();
  fill(context);
}

/**
 * Fill the Current Canvas with white color.
 * @param {CanvasRenderingContext2D | null} context - Current Canvas
 * @returns {void}
 */
export function fill(
  context: CanvasRenderingContext2D | null
): void {
  if (context) {
    context.fillStyle = 'rgba(255,255,255, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}

/**
 * Draw and animate all the Sprites
 * @returns {void}
 */
function drawSprites(): void {
  [...SPRITES, ...ANIMAL_SPRITES].forEach(sprite => sprite.updateSprite());
}

/**
 * Draw all Map Boundaries.
 * 
 * If Player is collapsing, don't move.
 * @returns {void}
 */
function drawBoundaries(): void {
  BOUNDARIES.forEach(boundary => boundary.draw());
  const collapsing = BOUNDARIES.some(boundary => checkCollision(character.sprite, boundary));

  MOVABLES.forEach(moveable => {
    moveable.props.moveable = !collapsing;
  });
}

/**
 * Draw the Battle Zones. Check for Battle Collisions.
 * - Depends on {RANDOM_BATTLE_NUMBER}
 * - More probability of Collision if Running
 * @see {@link getOverlappingBattleArea}
 * @returns {void}
 */
function drawBattleZones(): void {
  BATTLE_ZONES.forEach(zone => zone.draw());

  if(!character.sprite.props.moving) { return; }

  const onBattle = BATTLE_ZONES.some(zone => {
    const overlap = getOverlappingBattleArea(zone);
    return checkCollision(character.sprite, zone) && 
           (overlap > (48 * 48) / 2) && 
           Math.random() <= RANDOM_BATTLE_NUMBER * (gameKeys.running ? 2 : 1);
  });

  if (onBattle) { activeBattle(animationLoop); }
}

