import { canvas, context } from "../classes/canvas";
import BATTLE_ZONES from "../lib/battle_zones";
import BOUNDARIES from "../lib/boundaries";
import { checkCollision } from "./collisions";
import { SPRITES } from "../lib/sprites";
import { listenKeyboard } from "../listerners/keyboard";
import { RANDOM_BATTLE_NUMBER, background, foreground } from "./constants";
import Monster from "../classes/monsters";
import Boundary from "../classes/boundary";
import Player from "../classes/player";
import gsap from "gsap";
import { EMBY_MONSTER_SPRITE } from "../lib/monsters";

import { 
  battle, 
  battleMap, 
  clearBattleQueue, 
  createAttacksByMonster, 
  resetBattle, 
  createHTMLMonsterBox 
} from "./battle_field";

export let returnFromBattle = false;
export let animationLoop: number;
export const character = new Player(SPRITES[1]);
const MOVABLES = [background, ...BOUNDARIES, foreground, ...BATTLE_ZONES];

export function start(): void {
  animate();
  listenKeyboard();
  character.createTeam([new Monster(EMBY_MONSTER_SPRITE)]);
  // listenGamePad();
}

export function animate(): void {
  animationLoop = window.requestAnimationFrame(() => animate());
  if (battleMap.initilized) { return; }
  // scanGamePads();
  checkSprites();
  drawBattleZones();
  drawBoundaries();
  fill(context);
}

export function fill(
  context: CanvasRenderingContext2D | null
): void {
  if (context) {
    context.fillStyle = 'rgba(255,255,255, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}

function checkSprites(): void {
  SPRITES.forEach(sprite => sprite.updateSprite());
}

function drawBoundaries(): void {
  BOUNDARIES.forEach(boundary => boundary.draw());
  const collapsing = BOUNDARIES.some(boundary => checkCollision(character.sprite, boundary));

  MOVABLES.forEach(moveable => {
    moveable.props.moveable = !collapsing;
  });
}

function drawBattleZones(): void {
  BATTLE_ZONES.forEach(zone => zone.draw());

  if(!character.sprite.props.moving) { return; }

  const onBattle = BATTLE_ZONES.some(zone => {
    const overlap = getOverlappingArea(zone);
    return checkCollision(character.sprite, zone) && 
           overlap > (48 * 48) / 2 && Math.random() <= RANDOM_BATTLE_NUMBER;
  });

  if (onBattle) { activeBattle(animationLoop); }
}

function activeBattle(id: number): void {
  console.log
  window.cancelAnimationFrame(id);


  activeBattleAnimation();
  clearBattleQueue();

  setTimeout(() => {
    gsap.to('#battle-panel', {opacity: 1, duration: .2, delay: .2});
    createHTMLMonsterBox();
    createAttacksByMonster();
    battleMap.initilized = true;
    battle();
  }, 2220); // Wait animation
}

function getOverlappingArea(
  zone: Boundary
): number {
  return (Math.min(
    character.sprite.props.pos.x + 48,
    zone.props.pos.x + 48
  ) -
    Math.max(character.sprite.props.pos.x, zone.props.pos.x)) *
  (Math.min(
    character.sprite.props.pos.y + 48,
    zone.props.pos.y + 48
  ) -
    Math.max(character.sprite.props.pos.y, zone.props.pos.y));
}

/**
 * Adds the class 'active' to start the Battle Animation
 * @template '#battle-transition'.
 * @function resetBattle
 * @returns {void}
 */
function activeBattleAnimation(): void {
  const battle = document.getElementById('battle-transition');
  if (battle) { battle.classList.add('active'); }
  resetBattle();
}

