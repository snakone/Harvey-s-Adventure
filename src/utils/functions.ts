import gsap from "gsap";
import Boundary from "../classes/boundary";
import { canvas, context } from "../classes/canvas";
import BATTLE_ZONES from "../lib/battle_zones";
import BOUNDARIES from "../lib/boundaries";
import { BATTLE_SPRITES, SPRITES } from "../lib/sprites";
import { listenGamePad, scanGamePads } from "../listerners/gamepad";
import { listenKeyboard } from "../listerners/keyboard";
import { createBattle } from "./battle_field";
import { checkCollision } from "./collisions";
import { RANDOM_BATTLE_NUMBER, background, foreground, player } from "./constants";
import { MONSTER_SPRITES } from "../lib/monsters";
import Monster from "../classes/monsters";
import Sprite from "../classes/sprites";

const MOVABLES = [background, ...BOUNDARIES, ...BATTLE_ZONES, foreground];
export const BATTLE_MOVABLES = [...BATTLE_SPRITES, ...MONSTER_SPRITES];
const ally = MONSTER_SPRITES.find(monster => monster.props.ally);
const enemy = MONSTER_SPRITES.find(monster => monster.props.enemy);

const battleMap = {
  initilized: false
}

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

function battle(): void {
  window.requestAnimationFrame(battle);
  scanGamePads();
  if (!battleMap.initilized) { return; }
  context?.clearRect(0, 0, canvas.width, canvas.height);
  checkBattleSprites();
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

function checkBattleSprites(): void {
  BATTLE_MOVABLES.forEach((sprite: Sprite | Monster) => {
    if ('stats' in sprite.props) {
      (sprite as Monster).checkStartBattleAnimation();
    }

    sprite.updateSprite();
  })
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

  const isBattle = BATTLE_ZONES.some(zone => {
    const overlap = getOverlappingArea(zone);
    return checkCollision(player, zone) && overlap > (48 * 48) / 2 && Math.random() <= RANDOM_BATTLE_NUMBER;
  });

  // ACTIVATE BATTLE
  if (isBattle) {
    battleMap.initilized = true;
    activeBattleGround();
    window.cancelAnimationFrame(id);

    setTimeout(() => {
      gsap.to('#battle-panel', {opacity: 1});
      createMonsterBox();
      battle();
    }, 2220); // Wait animation
  }
}

function createMonsterBox(): void {
  const statsPanelEnemy: HTMLElement | null = document.querySelector('.battle-panel-enemy');
  const statsPanelAlly: HTMLElement | null = document.querySelector('.battle-panel-ally');

  if(statsPanelEnemy) {
    statsPanelEnemy.classList.add('fadeIn');
    statsPanelEnemy.style.display = 'block';

    const el = document.createElement('div');
    el.classList.add('battle-enemy-stats');
    const genderSrc = enemy!.props.stats?.gender === 'male' ? 'src/assets/images/male.png' : 'src/assets/images/female.png';
    el.innerHTML = `
      <h2>${enemy!.props.stats?.name}</h2> <span>Lv.${enemy!.props.stats?.level}</span> <img src="${genderSrc}"/>
    `;

    const bar = document.createElement('div');
    bar.classList.add('health-bar');

    const barGreen = document.createElement('div');
    barGreen.classList.add('health-bar-enemy', 'green');

    statsPanelEnemy.appendChild(el);
    statsPanelEnemy.appendChild(bar);
    statsPanelEnemy.appendChild(barGreen);
  }

  if(statsPanelAlly) {
    statsPanelAlly.classList.add('fadeIn');
    statsPanelAlly.style.display = 'block';

    const el = document.createElement('div');
    el.classList.add('battle-enemy-stats');
    const genderSrc = ally!.props.stats?.gender === 'male' ? 'src/assets/images/male.png' : 'src/assets/images/female.png';
    el.innerHTML = `
      <h2>${ally!.props.stats?.name}</h2> <span>Lv.${ally!.props.stats?.level}</span> <img src="${genderSrc}"/>
    `;

    const bar = document.createElement('div');
    bar.classList.add('health-bar');

    const barGreen = document.createElement('div');
    barGreen.classList.add('health-bar-ally', 'green');

    statsPanelAlly.appendChild(el);
    statsPanelAlly.appendChild(bar);
    statsPanelAlly.appendChild(barGreen);
  }
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

  if (battle) {
    battle.classList.add('active');
  }

  createBattle();
}

// function removeBattleGround(): void {
//   const battle = document.getElementById('battle-transition');

//   if (battle) {
//     battle.classList.remove('active');
//   }
// }

