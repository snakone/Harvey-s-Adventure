import gsap from "gsap";
import Monster from "../classes/monsters.class";
import Sprite from "../classes/sprites.class";
import { animate, character } from "./functions";
import { AttackFunction, MonsterAttack, MonsterProps } from "./interfaces";
import { BATTLE_SPRITES } from "../lib/sprites.lib";
import { context, canvas } from "../classes/canvas";
import { MONSTER_LIBRARY } from "../lib/monsters.lib";
import { MONSTERS_ENUM } from "./enums";
import { BATTLE_LOOP_TIME, CLICK_HERE_BATTLE_DIALOG_IMAGE } from "./constants";
import { createHTMLMonsterBox, createAttacksByMonster } from "./crafter";
import { setKeyBoardCanbeUsed, setCanCloseBattleDialog, canCloseBattleDialog, lastMonsterAttacked } from "./setters";
import { listenerBattlePanel, listenerFightPanel, listenerBattleQueue } from "../listerners/battle_field_listeners";

export let ATTACK_QUEUE: AttackFunction[] = [];
export let BATTLE_MOVABLES: Sprite[] | Monster[] = [];

export let enemy: Monster | undefined;
export let battleAnimationLoop: number | null;
export const battleMap = { initilized: false };

battleListeners();

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
 * Activates a new Battle
 * - Cancel Current Animation Frame
 * - Sets Keyboard cannot be used
 * - Creates the HTML Monster Boxes
 * - Show new Monster appeared Dialog
 * @param {number} animationLoop - Animation Loop ID to cancel
 * @template #battle-panel
 * @returns {void}
 */
export function activeBattle(animationLoop: number): void {
  setKeyBoardCanbeUsed(false);
  window.cancelAnimationFrame(animationLoop);
  activeBattleAnimation();
  clearBattleQueue();

  setTimeout(() => {
    gsap.to('#battle-panel', {opacity: 1, duration: .2, delay: .2});
    createHTMLMonsterBox();
    createAttacksByMonster();
    battleMap.initilized = true;
    showNewMonsterAppeared(enemy!);
    battle();
  }, 2220); // Wait animation
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
  let oldMonsterDead = character.selectedMonster.props.stats?.dead;
  if (oldMonsterDead) { character.createTeam(new Monster(MONSTER_LIBRARY.Emby, false)); }
  enemy = new Monster(getRandomMonster(), true);
  BATTLE_MOVABLES = [enemy, character.selectedMonster!];
  clearBattleQueue();
  setCanCloseBattleDialog(false);
}

/**
 * Check the Battle Queue. If action on Queue, execute it.
 * 
 * If no actions, close the Dialog.
 * @see {@link lastMonsterAttacked}
 * @param {HTMLElement} dialog - Battle Dialog
 * @template #info-battle-dialog
 * @returns {void}
 */
export function checkQueue(dialog: HTMLElement): void {
  if (ATTACK_QUEUE.length > 0) {
      ATTACK_QUEUE[0]();
      ATTACK_QUEUE.shift();
  } else if(canCloseBattleDialog) {
    dialog.style.display = 'none';
    setCanCloseBattleDialog(false);
  }
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
  character.selectedMonster.restartMonsterBattlePosition();
  enemy?.restartMonsterBattlePosition();
  enemy = undefined;
  battleMap.initilized = false;
  goBackToBattleMenu();
  window.cancelAnimationFrame(battleAnimationLoop);
  battleAnimationLoop = null;
  setKeyBoardCanbeUsed(true);
  animate();
}

/**
 * Removes the Battle Menu Panel and shows the Fight Panel with the Attacks.
 * 
 * Handles the Attack Buttons:
 * - Pushes Attacks to Queue
 * - Performs the Attack
 * @returns {void}
 * @template .battle-start-selection
 * @template .battle-fight-panel
 * @see {@link createBattle}
 */
export function showFightPanel(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.battle-start-selection');
  const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');

  if (!fightPanel || !battlePanel || (!character.selectedMonster || !enemy)) { return; }
  battlePanel.style.display = 'none';
  
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
export function pushAttackToQueue(
  attacker: Monster,
  recipent: Monster
): void {
  if(!attacker || !recipent) {return; }
  
  const random = Math.floor(Math.random() * attacker.props.attacks!.length || 1);
  const randomAttack = attacker.props.attacks![0];
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
export function performAttack(
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
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;
  }
}

/**
* Removes Fight Panel with Attacks and Display Battle Panel Menu.
*
* Battle Panel Menu contains Fight/Scape options.
* @template .battle-start-selection
* @template .battle-fight-panel
* @returns {void}
*/
export function goBackToBattleMenu(): void {
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
 * @template #battle-transition
 */
export function returnToMap(): void {
  gsap.to('.battle-panel-enemy', { display: 'none', duration: 0 });
  gsap.to('.battle-panel-ally', { display: 'none', duration: 0 });
  gsap.to('#battle-panel', { opacity: 0, duration: 0 });

  const battle = document.getElementById('battle-transition');
  if (battle) { battle.classList.remove('active'); }
}

/**
 * Animate the Monster Exp Bar after defeating an Enemy
 * 
 * - Handles if the Monster has Level Up
 * @param {number} amount - Translates to %
 * @template #exp-bar-blue
 * @returns {void}
 */
export function animateExpBar(amount: number): void {
  const expBar = document.getElementById('exp-bar-blue');
  const monster = character.selectedMonster;
  if (amount === undefined || !expBar || !monster) { return; }

  let value = amount + monster.props.stats?.totalExp!;

  // LEVEL UP!
  if (value >= 100) { value = 100; }

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
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

      setTimeout(() => {
        setCanCloseBattleDialog(true);
      }, BATTLE_LOOP_TIME * 2);

    createHTMLMonsterBox();
  }
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

/**
 * Reset the Battle Queue to an empty array.
 * @returns {void}
 */
export function clearBattleQueue(): void {
  ATTACK_QUEUE = [];
}

/**
 * Open the Battle Dialog and display the message:
 * 
 * A wild Monster appeared!
 * @param {Monster} monster - Monster to show the name
 * @template #info-battle-dialog
 * @returns {void}
 */
export function showNewMonsterAppeared(monster: Monster): void {
  const dialogRef = document.getElementById('info-battle-dialog');

  if(dialogRef) {
    dialogRef.style.display = 'block';
    dialogRef.innerHTML = `A wild <strong>${monster?.props.stats?.name}</strong> appeared!
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

    setTimeout(() => {
      setCanCloseBattleDialog(true);
    }, BATTLE_LOOP_TIME);
  }
}

/**
 * Return a Random MonsterProps
 * @see {@link Monster}
 * @returns {MonsterProps}
 */
export function getRandomMonster(): MonsterProps {
  const keys = Object.keys(MONSTER_LIBRARY) as MONSTERS_ENUM[];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return MONSTER_LIBRARY.Draggle;
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


