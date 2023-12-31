import gsap from "gsap";
import Monster from "../classes/monsters";
import Sprite from "../classes/sprites";
import { animate, character } from "./functions";
import { AttackFunction } from "./interfaces";
import { BATTLE_SPRITES } from "../lib/sprites";
import { context, canvas } from "../classes/canvas";
import { DRAGGLE_MONSTER_SPRITE, EMBY_MONSTER_SPRITE } from "../lib/monsters";
import { MONSTER_ATTACKS, MonsterAttack } from "../lib/attacks";
import { ATTACK_ENUMS, ELEMENTALS, SWITCH_COLOR_TYPE } from "./enums";

export let ATTACK_QUEUE: AttackFunction[] = [];
export const battleMap = { initilized: false };
export let MONSTER_SPRITES: Monster[] = [];
export let BATTLE_MOVABLES: Sprite[] | Monster[] = [];

export let canCloseBattleDialog = false;
export let lastMonsterAttacked: Monster | undefined = undefined;

/**
 * Set if the Battle can be closed given the value.
 * @param {boolean} value - Value to set
 * @returns {void}
 */
export function setCanCloseBattle(value: boolean): void {
  canCloseBattleDialog = value;
}

/**
 * Set the Monster who performed the last Attack.
 * 
 * Usage for closing the Battle Dialog
 * @param {Monster} monster - Monster that performed the last attack
 * @returns {void}
 */
export function setLastMonsterAttacked(monster: Monster): void {
  lastMonsterAttacked = monster;
}

export const SWITCH_ATTACK_NAME = {
  Tackle: MONSTER_ATTACKS.Tackle,
  Fireball: MONSTER_ATTACKS.Fireball
}

export let enemy: Monster | undefined;
export let battleAnimationLoop: number | null;

/**
 * Main Function for the Battle Animation
 * 
 * Uses RAF (Request Animation Frame)
 * @returns {void}
 * @function drawBattleGround
 * @function checkBattleSprites
 */
export function battle(): void {
  battleAnimationLoop = window.requestAnimationFrame(battle);
  // scanGamePads();
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
  let oldMonster = character.selectedMonster!;
  if (!oldMonster) { character.createTeam([new Monster(EMBY_MONSTER_SPRITE)]); }
  enemy = new Monster(DRAGGLE_MONSTER_SPRITE);
  character.selectMonster(0);
  MONSTER_SPRITES = [character.selectedMonster!, enemy];
  BATTLE_MOVABLES = [enemy, character.selectedMonster!];
  clearBattleQueue();
  setCanCloseBattle(false);
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
 * 
 * Returns if no battleAnimationLoop is present
 * @see {@link animate}
 * @returns {void}
 */
export function endBattle(): void {
  if (!battleAnimationLoop) return; 
  enemy = undefined;
  battleMap.initilized = false;
  goBackToBattleMenu();
  window.cancelAnimationFrame(battleAnimationLoop);
  battleAnimationLoop = null;
  animate();
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
  if (!fightPanel || (!character.selectedMonster || !enemy)) { return; }
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
  const randomAttack = attacker.props.attacks![1];
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

      const current = isEnemy ? enemy : character.selectedMonster;
      if (!current) { return; }

      const { name, level, gender, health, totalExp } = current.props.stats || {};
      const genderSrc = `/images/${gender}.png`;
      const el = document.createElement('div');
      el.classList.add('battle-enemy-stats');
      el.innerHTML = `<h2>${name}</h2> <span>Lv.${level}</span> <img src="${genderSrc}"/>`;

      const bar = document.createElement('div');
      bar.classList.add('health-bar');

      const greenBar = document.createElement('div');
      greenBar.classList.add(isEnemy ? 'health-bar-enemy' : 'health-bar-ally', 'green');
      greenBar.style.width = health + '%';

      panel.appendChild(el);
      panel.appendChild(bar);
      panel.appendChild(greenBar);

      if(!isEnemy) {
        const expBar = document.createElement('div');
        expBar.classList.add('exp-bar');
  
        const expBarBlue = document.createElement('div');
        expBarBlue.classList.add('exp-bar-blue');
        expBarBlue.id = 'exp-bar-blue';
        expBarBlue.style.width = totalExp! >= 100 ? '0' : totalExp + '%';

        panel.appendChild(expBar);
        panel.appendChild(expBarBlue);
      }
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
  if(!character.selectedMonster) { return; }

  const el = document.querySelector('.battle-fight-panel');
  el?.replaceChildren();

  if(el) {
    for(const i of [1,2,3,4]) {
      const name = character.selectedMonster.props.attacks![i - 1]?.name;
      const type = character.selectedMonster.props.attacks![i - 1]?.type;
      const button = createAttackButton(name || '-', i.toString(), type);
      el.append(button);
    }

    const back = createAttackButton('Back', 'back');
    el.append(back);
  }
}

/**
 * Show the Panel after a Monster Attack
 * - (Monster name) used (Attack Name)
 * @param {MonsterAttack} data - Attack Data
 * @param {string} name - Name who performed the action
 * @template #info-battle-dialog
 * @returns {void}
 */
export function showBattleDialog(data: MonsterAttack, name: string): void {
  const dialogRef = document.getElementById('info-battle-dialog');

  if (dialogRef) {
    dialogRef.style.display = 'block';
    dialogRef.innerHTML = `<strong>${name}</strong> used ${data.name}
      <img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>`;
  }
}

/**
* Removes Fight Panel with Attacks and Display Battle Panel Menu.
*
* Battle Panel Menu contains Fight/Scape options.
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

/**
 * Return to Map Transition. Removes:
 * 
 * - Both Monster Info Panels
 * - Fade out the Battle Panel
 * - Removes the 'active' class from Battle Transition
 * @returns {void}
 */
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

/**
 * Animate the Monster Exp Bar after defeating an Enemy
 * 
 * - Handles if the Monster has Level Up
 * @param {number} amount - Translates to %
 * @returns {void}
 */
export function animateExpBar(amount: number): void {
  const expBar = document.getElementById('exp-bar-blue');
  const monster = character.selectedMonster;
  if (amount === undefined || !expBar || !monster) { return; }

  let value = amount + monster.props.stats?.totalExp!;

  // LEVEL UP!
  if (value >= 100) { 
    value = 100;
  }

  gsap.to(expBar, {
    width: (value) + '%',
    onComplete() {
      monster.changeStat(amount + monster.props.stats?.totalExp!, 'totalExp');
      if (monster.props.stats?.level !== undefined) {
        monster.changeStat(++monster.props.stats.level, 'level');
      }

      if(value >= 100) {
        ATTACK_QUEUE.push(() => {
          handleLevelUp(monster.props.stats?.level!);
        });

        return;
      }
      setTimeout(() => setCanCloseBattle(true), 1500);
    }
  });
}

/**
 * Handles the Level Up Process.
 * Display on the Battle Panel - Monster has grew 1 level.
 * 
 * Creates the HTML Monster Boxes again.
 * @param {number} level - The Level the Monster has reached
 * @template #info-battle-dialog
 * @returns {any}
 */
export function handleLevelUp(level: number): void {
  const dialogRef = document.getElementById('info-battle-dialog');
  const monster = character.selectedMonster;

  if (dialogRef && monster) {
    dialogRef.style.display = 'block';
    dialogRef.innerHTML = `<strong>${monster.props.stats?.name}</strong> grew to level ${level}!
      <img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>`;

    createHTMLMonsterBox();
    setTimeout(() => setCanCloseBattle(true), 1500);
  }
}

/**
 * Reset the Attack Queue to an empty array.
 * @returns {void}
 */
export function clearBattleQueue(): void {
  ATTACK_QUEUE = [];
}

battleListeners();

/**
 * Listen for clicks on the Battle Fight Panel
 * 
 * - This panel shows the Monster Attacks.
 * - Performs the Monster Attacks.
 * @template .battle-fight-panel
 * @returns {void}
 */
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
  
    if (!name || !attack || !character.selectedMonster || !enemy) { return; }
    performAttack(character.selectedMonster, enemy, attack);
    pushAttackToQueue(enemy, character.selectedMonster);
  });
}

/**
 * Listen for clicks on the Battle Dialog.
 * - Checks the Queue if enemy Faints
 * @template #info-battle-dialog
 * @see {@link checkQueue}
 * @returns {void}
 */
function listenerBattleQueue(): void {
  const dialogRef = document.getElementById('info-battle-dialog');
  dialogRef?.addEventListener('click', (_) => {
    const monster = character.selectedMonster;
    if(monster?.attacking || enemy?.attacking) { return; }

    if (enemy!.props.stats!.health! <= 0) {
      enemy!.attacking = false;
      enemy!.faint();
    } else if (monster?.props.stats!.health! <= 0) {
      monster!.attacking = false;
      monster!.faint();
      return;
    }

    checkQueue(dialogRef!);
  });
}

/**
 * Check the Battle Queue. If action on Queue, execute it.
 * 
 * If no actions, close the Dialog.
 * @see {@link canCloseBattleDialog}
 * @see {@link lastMonsterAttacked}
 * @param {HTMLElement} dialog - Battle Dialog
 * @returns {void}
 */
function checkQueue(dialog: HTMLElement): void {
  if (ATTACK_QUEUE.length > 0) {
      ATTACK_QUEUE[0]();
      ATTACK_QUEUE.shift();
  } else if (canCloseBattleDialog || lastMonsterAttacked?.props.enemy) {
    dialog.style.display = 'none';
  }
}

/**
 * Listen for clicks on Battle Selection
 * 
 * Fight/Scape Selection
 * @template .battle-start-selection
 * @returns {void}
 */
function listenerBattlePanel(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.battle-start-selection');

  battlePanel?.addEventListener('click', (battlePanelEv: any) => {
    const battleName: string = battlePanelEv.target.tagName;
    const battleValue: string = battlePanelEv.target.value;
  
    if (battleName === 'BUTTON' && battleValue === 'true') {
      showFightPanel(battlePanel);
    } else if(battleName === 'BUTTON' && battleValue === 'false') {
      endBattle();
      returnToMap();
    }
  });
}
