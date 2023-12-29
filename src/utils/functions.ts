import gsap from "gsap";
import Boundary from "../classes/boundary";
import { canvas, context } from "../classes/canvas";
import BATTLE_ZONES from "../lib/battle_zones";
import BOUNDARIES from "../lib/boundaries";
import { SPRITES } from "../lib/sprites";
import { listenGamePad, scanGamePads } from "../listerners/gamepad";
import { listenKeyboard } from "../listerners/keyboard";
import { battle, battleMap, createBattle, createMonsterBox } from "./battle_field";
import { checkCollision } from "./collisions";
import { RANDOM_BATTLE_NUMBER, background, foreground, player } from "./constants";

const MOVABLES = [background, ...BOUNDARIES, ...BATTLE_ZONES, foreground];

export function start(): void {
  animate();
  listenKeyboard();
  listenGamePad();
}

function animate(): void {
  const id = window.requestAnimationFrame(animate);
  scanGamePads();
  if (battleMap.initilized) { return; }
  checkSprites();
  drawBattleZones(id);
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
  SPRITES.forEach(sprite => {
    sprite.updateSprite();
  });
}

function drawBoundaries(): void {
  BOUNDARIES.forEach(boundary => boundary.draw());
  const collapsing = BOUNDARIES.some(boundary => checkCollision(player, boundary));

  MOVABLES.forEach(moveable => {
    moveable.props.moveable = !collapsing;
  });
}

function drawBattleZones(id: number): void {
  BATTLE_ZONES.forEach(zone => zone.draw());

  const onBattle = BATTLE_ZONES.some(zone => {
    const overlap = getOverlappingArea(zone);
    return checkCollision(player, zone) && overlap > (48 * 48) / 2 && Math.random() <= RANDOM_BATTLE_NUMBER;
  });

  if (onBattle) { activeBattle(id); }
}

function activeBattle(id: number): void {
  battleMap.initilized = true;
  activeBattleGround();
  window.cancelAnimationFrame(id);

  setTimeout(() => {
    gsap.to('#battle-panel', {opacity: 1});
    createMonsterBox();
    battle();
  }, 2220); // Wait animation
}

function getOverlappingArea(
  zone: Boundary
): number {
  return (Math.min(
    player.props.pos.x + 48,
    zone.props.pos.x + 48
  ) -
    Math.max(player.props.pos.x, zone.props.pos.x)) *
  (Math.min(
    player.props.pos.y + 48,
    zone.props.pos.y + 48
  ) -
    Math.max(player.props.pos.y, zone.props.pos.y));
}

function activeBattleGround(): void {
  const battle = document.getElementById('battle-transition');
  if (battle) { battle.classList.add('active'); }
  createBattle();
}

// function removeBattleGround(): void {
//   const battle = document.getElementById('battle-transition');

//   if (battle) {
//     battle.classList.remove('active');
//   }
// }

