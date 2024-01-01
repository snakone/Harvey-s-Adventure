import gsap from "gsap";
import Monster from "../classes/monsters.class";
import Sprite from "../classes/sprites.class";
import { animate, character } from ".";
import { AttackFunction, MonsterAttack } from "./interfaces";
import { BATTLE_SPRITES } from "../lib/sprites.lib";
import { context, canvas } from "../classes/canvas";
import { MONSTER_LIBRARY } from "../lib/monsters.lib";
import { BATTLE_LOOP_TIME, CLICK_HERE_BATTLE_DIALOG_IMAGE } from "./constants";
import { createHTMLMonsterBox, createAttacksByMonster } from "./crafter";
import { setKeyBoardCanbeUsed, setCanCloseBattleDialog, canCloseBattleDialog, lastMonsterAttacked } from "./setters";
import { listenerBattlePanel, listenerFightPanel, listenerBattleQueue } from "../listerners/battle_field.listeners";
import { stopBattleAndStartMapAudio, stopMapAndStartBattleAudio, stopVictoryAndStartLevelUpAudio } from "../lib/audio.lib";
import { canMonsterScape, getRandomMonster, pushAttackToQueue, returnToMap } from "./functions";

export let BATTLE_QUEUE: AttackFunction[] = [];
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
  stopMapAndStartBattleAudio();
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
 * Reset the previous Battle Stat values
 * - Creates a new Ally if doesn't exist
 * - Creates a new Enemy
 * - Clears the Battle Queue
 * - Set Battle Sprites
 * @returns {void}
 */
export function resetBattleStats(): void {
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
  const monster = character.selectedMonster;
  if (BATTLE_QUEUE.length > 0) {
      BATTLE_QUEUE[0]();
      BATTLE_QUEUE.shift();
  } else if(canCloseBattleDialog || lastMonsterAttacked?.enemy) {
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
 * @see {@link stopBattleAndStartMapAudio}
 * @see {@link goBackToBattleMenu}
 * @see {@link setKeyBoardCanbeUsed}
 * @returns {void}
 */
export function endBattle(): void {
  if (!battleAnimationLoop) return;
  window.cancelAnimationFrame(battleAnimationLoop);
  stopBattleAndStartMapAudio();
  character.selectedMonster.restartMonsterBattlePosition();
  enemy?.restartMonsterBattlePosition();
  enemy = undefined;
  battleMap.initilized = false;
  goBackToBattleMenu();
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
 * Show the Panel after a Monster Attack
 * - (Monster name) used (Attack Name)
 * @param {MonsterAttack} data - Attack Data
 * @param {string} name - Name who performed the action
 * @template #info-battle-dialog
 * @returns {void}
 */
export function showDialogAfterAttack(data: MonsterAttack, name: string): void {
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
 * Animate the Monster Exp Bar after defeating an Enemy.
 * 
 * - Handles if the Monster has Level Up
 * @param {number} amount - Translates to %
 * @template #exp-bar-blue
 * @see {@link handleLevelUp}
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
        BATTLE_QUEUE.push(() => {
          stopVictoryAndStartLevelUpAudio();
          handleLevelUp(monster.props.stats?.level!);
        });
      }
    }
  });
}

/**
 * Handles the Level Up Process.
 * Display on the Battle Panel - Monster has grew 1 level.
 * 
 * Creates the HTML Monster Boxes again.
 * 
 * Will Close the Battle Dialog
 * @param {number} level - The Level the Monster has reached
 * @template #info-battle-dialog
 * @returns {any}
 */
export function handleLevelUp(level: number): void {
  const dialogRef = document.getElementById('info-battle-dialog');
  const monster = character.selectedMonster;

  if (dialogRef && monster) {
    dialogRef.style.display = 'block';
    dialogRef.innerHTML = `<strong>${monster.props?.name}</strong> grew to level ${level}!
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

    setTimeout(() => setCanCloseBattleDialog(true), BATTLE_LOOP_TIME * 2);
    createHTMLMonsterBox();
  }
}

/**
 * Adds the class 'active' to start the Battle Animation.
 * 
 * Reset the Battle Stats
 * @template '#battle-transition'.
 * @see {@link resetBattleStats}
 * @returns {void}
 */
function activeBattleAnimation(): void {
  const battle = document.getElementById('battle-transition');
  if (battle) { battle.classList.add('active'); }
  resetBattleStats();
}

/**
 * Reset the Battle Queue to an empty array.
 * @returns {void}
 */
export function clearBattleQueue(): void {
  BATTLE_QUEUE = [];
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
    dialogRef.innerHTML = `A wild <strong>${monster?.props?.name}</strong> appeared!
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

    setTimeout(() => {
      setCanCloseBattleDialog(true);
    }, BATTLE_LOOP_TIME);
  }
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
 * Show can Scape Dialog. Calculates if the Monster can Scape.
 * 
 * Can end the Battle.
 * @see {@link canMonsterScape}
 * @see {@link showCannotScapedDialog}
 * @returns {void}
 */
export function showDialogScape(): void {
  const dialogRef = document.getElementById('info-battle-dialog');
  const canScape = canMonsterScape(enemy!);

  if(!canScape) {
    showCannotScapedDialog();
    return;
  }

  if(dialogRef) {
    dialogRef.style.display = 'block';
    dialogRef.innerHTML = `You've escape successfully!
     ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

     BATTLE_QUEUE.push(() => {
      setCanCloseBattleDialog(true);
      endBattle();
      returnToMap();
    });
  }
}

/**
 * Show cannot Scape Dialog and Push an Enemy Attack to the Queue.
 * @see {@link pushAttackToQueue}
 * @template #info-battle-dialog
 * @returns {void}
 */
function showCannotScapedDialog(): void {
  const dialogRef = document.getElementById('info-battle-dialog');
  const monster = character.selectedMonster;

  if(!dialogRef || !monster || !enemy) { return; }

  dialogRef.style.display = 'block';
    dialogRef.innerHTML = `What!? You couldn't scape!
    ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;

  pushAttackToQueue(enemy, monster);
}




