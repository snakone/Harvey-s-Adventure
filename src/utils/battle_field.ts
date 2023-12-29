import { context, canvas } from "../classes/canvas";
import Monster from "../classes/monsters";
import Sprite from "../classes/sprites";
import { MONSTER_ATTACKS, MonsterAttack } from "../lib/attacks";
import { MONSTER_SPRITES } from "../lib/monsters";
import gsap from "gsap";
import { BATTLE_SPRITES } from "../lib/sprites";
import { scanGamePads } from "../listerners/gamepad";

export const ATTACK_QUEUE: any[] = [];
const ally = MONSTER_SPRITES.find(monster => monster.props.ally);
const enemy = MONSTER_SPRITES.find(monster => monster.props.enemy);

export const battleMap = {
  initilized: false
}

export const BATTLE_MOVABLES: Sprite[] | Monster[] = [...MONSTER_SPRITES];

export function battle(): void {
  window.requestAnimationFrame(battle);
  scanGamePads();
  if (!battleMap.initilized) { return; }
  context?.clearRect(0, 0, canvas.width, canvas.height);
  drawBattleGround();
  checkBattleSprites();
}

function drawBattleGround(): void {
  BATTLE_SPRITES.forEach(sprite => sprite.draw());
}

function checkBattleSprites(): void {
  BATTLE_MOVABLES.forEach((sprite: Sprite | Monster) => {
    if ('stats' in sprite.props && 'attacks' in sprite.props) {
      (sprite as Monster).checkStartBattleAnimation();
    }
    sprite.updateSprite();
  });
}

export function createBattle(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.batte-start-selection');
  if (!battlePanel) { return; }

  battlePanel.addEventListener('click', (battlePanelEv: any) => {
    const battleName = battlePanelEv.target.tagName;
    const battleValue = battlePanelEv.target.value;

    if (battleName === 'BUTTON' && battleValue === 'true') {
      showFightPanel(battlePanel);
    } else if(battleName === 'BUTTON' && battleValue === 'false') {
      returnToMap();
    }
  });
}

function showFightPanel(panel: HTMLElement): void {
  panel.style.display = 'none';
  const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');
  if (!fightPanel || (!ally || !enemy)) { return; }
  fightPanel.classList.add('fadeIn');
  fightPanel.style.display = 'grid';

  fightPanel.addEventListener('click', (fightPanelEv: any) => {
    const name = fightPanelEv.target.tagName;
    const value = fightPanelEv.target.value;
    const isButtonAndNotAttacking = (monster: Monster) => name === 'BUTTON' && !monster.attacking;

    const firstAttack = isButtonAndNotAttacking(ally) && value === '1';
    const secondAttack = isButtonAndNotAttacking(ally) && value === '2';
    const thridAttack = isButtonAndNotAttacking(enemy) && value === '3';

    if (firstAttack) {
      pushAttackToQueue(enemy, ally, MONSTER_ATTACKS.Tackle);
      performAttack(ally, enemy, MONSTER_ATTACKS.Tackle);
    } 
    else if (secondAttack) {
      pushAttackToQueue(enemy, ally, MONSTER_ATTACKS.Fireball);
      performAttack(ally, enemy, MONSTER_ATTACKS.Fireball);
    } 
    else if (thridAttack) {
      pushAttackToQueue(ally, enemy, MONSTER_ATTACKS.Fireball);
      performAttack(enemy, ally, MONSTER_ATTACKS.Fireball);
    } 
    else if (name === 'BUTTON' && value === 'back') {
      goBackToBattleMenu(fightPanel, panel);
    }
  }); 
}

function pushAttackToQueue(
  attacker: Monster,
  recipent: Monster,
  data: MonsterAttack
): void {
  ATTACK_QUEUE.push(() => {
    attacker.attack({
      data,
      recipent
    });
  });
}

function performAttack(
  attacker: Monster,
  recipent: Monster,
  data: MonsterAttack
): void {
  attacker.attack({
    data,
    recipent
  });
}

export function createMonsterBox(): void {
  const createStatsPanel = (panel: HTMLElement | null, isAlly: boolean): void => {
    if (panel) {
      panel.classList.add('fadeIn');
      panel.style.display = 'block';

      const allyOrEnemy = isAlly ? ally : enemy;

      if (allyOrEnemy) {
        const { name, level, gender } = allyOrEnemy.props.stats || {};
        const genderSrc = `src/assets/images/${gender}.png`;
        const el = document.createElement('div');
        el.classList.add('battle-enemy-stats');
        el.innerHTML = `<h2>${name}</h2> <span>Lv.${level}</span> <img src="${genderSrc}"/>`;

        const bar = document.createElement('div');
        bar.classList.add('health-bar');

        const barGreen = document.createElement('div');
        barGreen.classList.add(isAlly ? 'health-bar-ally' : 'health-bar-enemy', 'green');

        panel.appendChild(el);
        panel.appendChild(bar);
        panel.appendChild(barGreen);
      }
    }
  };

  createStatsPanel(document.querySelector('.battle-panel-enemy'), false);
  createStatsPanel(document.querySelector('.battle-panel-ally'), true);
}

function goBackToBattleMenu(
  fightPanel: HTMLElement,
  battlePanel: HTMLElement
): void {
  fightPanel.classList.remove('fadeIn');
  fightPanel.style.display = 'none';
  battlePanel.classList.add('fadeIn');
  battlePanel.style.display = 'grid';
}

function returnToMap(): void {
  gsap.to('.battle-panel-enemy', { display: 'none' });
  gsap.to('.battle-panel-ally', { display: 'none' });
  gsap.to('#battle-panel', { opacity: 0 });
}