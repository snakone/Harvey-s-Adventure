import gsap from "gsap";
import Monster from "../classes/monsters";
import Sprite from "../classes/sprites";
import { animate } from "./functions";
import { AttackFunction } from "./interfaces";
import { BATTLE_SPRITES } from "../lib/sprites";
import { context, canvas } from "../classes/canvas";
import { DRAGGLE_MONSTER_SPRITE, EMBY_MONSTER_SPRITE } from "../lib/monsters";
import { scanGamePads } from "../listerners/gamepad";
import { MONSTER_ATTACKS, MonsterAttack } from "../lib/attacks";
import { ATTACK_ENUMS, ELEMENTALS, SWITCH_COLOR_TYPE } from "./enums";

export let ATTACK_QUEUE: AttackFunction[] = [];
export const battleMap = { initilized: false };
export let MONSTER_SPRITES: Monster[] = [];
export let BATTLE_MOVABLES: Sprite[] | Monster[] = [];

export let canCloseBattleDialog = false;

export function setCanCloseBattle(value: boolean): void {
  canCloseBattleDialog = value;
}

export const SWITCH_ATTACK_NAME = {
  Tackle: MONSTER_ATTACKS.Tackle,
  Fireball: MONSTER_ATTACKS.Fireball
}

export let ally: Monster | undefined;
export let enemy: Monster | undefined;
export let battleAnimationLoop: number;

/**
 * Main Function for the Battle Animation
 * 
 * Uses RAF (Request Animation Frame)
 * @returns {void}
 */
export function battle(): void {
  battleAnimationLoop = window.requestAnimationFrame(battle);
  scanGamePads();
  if (!battleMap.initilized) { return; }
  context?.clearRect(0, 0, canvas.width, canvas.height);
  drawBattleGround();
  checkBattleSprites();
}

/**
 * Draw all the Battle Sprites
 * @returns {void}
 */
function drawBattleGround(): void {
  BATTLE_SPRITES.forEach(sprite => sprite.draw());
}

/**
 * Update Battle Sprites. 
 * 
 * Checks start animation for Monster Sprites.
 * @returns {void}
 */
function checkBattleSprites(): void {
  BATTLE_MOVABLES.forEach((sprite: Sprite | Monster) => {
    if ('stats' in sprite.props && 'attacks' in sprite.props) {
      (sprite as Monster).checkStartBattleAnimation();
    }
    sprite.updateSprite();
  });
}

/**
 * Reset the previous Battles values
 * - Creates a new Ally if doesn't exist
 * - Creates a new Enemy
 * - Clears the Battle Queue
 * - Set Battle Sprites
 * @returns {void}
 */
export function resetBattle(): void {
  let oldAlly = ally!;
  if (!oldAlly) { ally = new Monster(EMBY_MONSTER_SPRITE); }
  enemy = new Monster(DRAGGLE_MONSTER_SPRITE);
  MONSTER_SPRITES = [ally!, enemy];
  BATTLE_MOVABLES = [enemy, ally!];
  clearBattleQueue();
}

/**
 * Main Function for HTML Element Listeners
 * @see {@link listenerBattlePanel}
 * @see {@link listenerFightPanel}
 * @see {@link listenerBattleQueue}
 * @returns {void}
 */
function battleListeners(): void {
  listenerBattlePanel();
  listenerFightPanel();
  listenerBattleQueue();
}

/**
 * Ends the current Battle.
 * - Set the Enemy to undefined
 * - Cancel Battle Animation Frame Loop
 * - Calls animate (RAF)
 * @see {@link animate}
 * @returns {void}
 */
export function endBattle(): void {
  enemy = undefined;
  window.cancelAnimationFrame(battleAnimationLoop);
  battleMap.initilized = false;
  goBackToBattleMenu();
  animate(true);
}

/**
 * Removes the Battle Menu Panel and shows the Fight Panel with the Attacks.
 * 
 * Handles the Attack Buttons:
 * - Pushes Attacks to Queue
 * - Performs the Attack
 * @param {HTMLElement} panel - The HTML element representing the Battle Menu Panel.
 * @returns {void}
 * @see {@link createBattle}
 */
function showFightPanel(panel: HTMLElement): void {
  const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');
  if (!fightPanel || (!ally || !enemy)) { return; }
  panel.style.display = 'none';
  fightPanel.classList.add('fadeIn');
  fightPanel.style.display = 'grid';
}

/**
* Push a new Attack to the Queue
* @param {Monster} attacker - The Monster who perform the Attack
* @param {Monster} recipent - The Monster who recieves the Attack
* 
* The Attack will be Randomized
* @returns {void}
*/
function pushAttackToQueue(
  attacker: Monster,
  recipent: Monster
): void {
  if(!attacker || !recipent) {return; }
  
  const random = Math.floor(Math.random() * attacker.props.attacks!.length || 1);
  const randomAttack = attacker.props.attacks![random];
  ATTACK_QUEUE.push(() => {
    attacker.attack({
      data: randomAttack,
      recipent
    });
  });
}

/**
* Performs an Attack to a Monster
* @param {Monster} attacker
* The Monster who perform the Attack
* @param {Monster} recipent
* The Monster who recieves the Attack
* @param {MonsterAttack} data
* Attack Data
* @returns {void}
*/
function performAttack(
  attacker: Monster,
  recipent: Monster,
  data: MonsterAttack
): void {
  if(!attacker || !recipent) {return; }

  attacker.attack({
    data,
    recipent
  });
}

/**
* Creates 2 HTML boxes for the Battle. Contains the following:
* - Monster's Name, Health, Level and Gender
* @returns {void}
*/
export function createHTMLMonsterBox(): void {
  const createStatsPanel = (panel: HTMLElement | null, isEnemy: boolean): void => {
    if (panel) {
      panel.classList.add('fadeIn');
      panel.style.display = 'block';
      panel.replaceChildren();

      const current = isEnemy ? enemy : ally;
      const { name, level, gender } = current!.props.stats || {};
      const genderSrc = `/images/${gender}.png`;
      const el = document.createElement('div');
      el.classList.add('battle-enemy-stats');
      el.innerHTML = `<h2>${name}</h2> <span>Lv.${level}</span> <img src="${genderSrc}"/>`;

      const bar = document.createElement('div');
      bar.classList.add('health-bar');

      const barGreen = document.createElement('div');
      barGreen.classList.add(isEnemy ? 'health-bar-enemy' : 'health-bar-ally', 'green');

      panel.appendChild(el);
      panel.appendChild(bar);
      panel.appendChild(barGreen); 
    }
  };

  createStatsPanel(document.querySelector('.battle-panel-enemy'), true);
  createStatsPanel(document.querySelector('.battle-panel-ally'), false);
}

/**
* Creates the Attack HTML Buttons needed for the Battle.
* 
* Uses the Ally to create the Attacks
* @returns {void}
*/
export function createAttacksByMonster(): void {
  const el = document.querySelector('.battle-fight-panel');
  el?.replaceChildren();

  if(el) {
    for(const i of [1,2,3,4]) {
      const name = ally!.props.attacks![i - 1]?.name;
      const type = ally!.props.attacks![i - 1]?.type;
      const button = createAttackButton(name || '-', i.toString(), type);
      el.append(button);
    }

    const back = createAttackButton('Back', 'back');
    el.append(back);
  }
}

/**
* Removes Fight Panel with Attacks and Display Battle Panel
* @param {HTMLElement} fightPanel
* @param {HTMLElement} battlePanel
* @returns {void}
*/
function goBackToBattleMenu(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.battle-start-selection');
  const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');

  fightPanel!.classList.remove('fadeIn');
  fightPanel!.style.display = 'none';
  battlePanel!.classList.add('fadeIn');
  battlePanel!.style.display = 'grid';
}

export function returnToMap(): void {
  gsap.to('.battle-panel-enemy', { display: 'none', duration: 0 });
  gsap.to('.battle-panel-ally', { display: 'none', duration: 0 });
  gsap.to('#battle-panel', { opacity: 0, duration: 0 });

  const battle = document.getElementById('battle-transition');
  if (battle) { battle.classList.remove('active'); }
}

/**
* Generates a Single Attack HTML Button.
* @param {string} text - Text to be displayed
* @param {string} value - Value of the Button
* @param {ELEMENTALS} type - Attack Type to display Color
* @see {@link createAttacksByMonster}
* @returns {HTMLButtonElement}
*/
function createAttackButton(text: string, value: string, type?: ELEMENTALS): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('animated', 'fadeIn');
  button.textContent = text;
  button.value = value;
  button.disabled = !text || text === '-';
  button.style.color = SWITCH_COLOR_TYPE[type || ELEMENTALS.NORMAL];
  return button;
}

export function clearBattleQueue(): void {
  ATTACK_QUEUE = [];
}

battleListeners();

function listenerFightPanel(): void {
  const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');

  fightPanel?.addEventListener('click', (fightPanelEv: any) => {
    const tag = fightPanelEv.target.tagName;
    const value = fightPanelEv.target.value;
  
    if (tag === 'BUTTON' && value === 'back') {
      goBackToBattleMenu();
      return;
    }
  
    const name: ATTACK_ENUMS = fightPanelEv.target.textContent;
    const attack: MonsterAttack = SWITCH_ATTACK_NAME[name];
  
    if (!name || !attack) { return; }
    performAttack(ally!, enemy!, attack);
    pushAttackToQueue(enemy!, ally!);
  });
}

function listenerBattleQueue(): void {
  const dialogRef = document.getElementById('info-battle-dialog');

  // QUEUE
  dialogRef?.addEventListener('click', (_) => {
    console.log({ally, enemy})
    if(ally?.attacking || enemy?.attacking) { return; }
    if (enemy!.props.stats!.health! <= 0) {
      enemy!.attacking = false;
      enemy!.faint();
      return;
    } else if (ally!.props.stats!.health! <= 0) {
      ally!.attacking = false;
      ally!.faint();
      return;
    }
  
    if (ATTACK_QUEUE.length > 0) {
        ATTACK_QUEUE[0]();
        ATTACK_QUEUE.shift();
    } else if (canCloseBattleDialog || enemy?.props.enemy) {
      dialogRef.style.display = 'none';
    }
  });
}

function listenerBattlePanel(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.battle-start-selection');

  battlePanel?.addEventListener('click', (battlePanelEv: any) => {
    const battleName: string = battlePanelEv.target.tagName;
    const battleValue: string = battlePanelEv.target.value;
  
    if (battleName === 'BUTTON' && battleValue === 'true') {
      showFightPanel(battlePanel);
    } else if(battleName === 'BUTTON' && battleValue === 'false') {
      console.log('scape')
      endBattle();
      returnToMap();
    }
  });
}
