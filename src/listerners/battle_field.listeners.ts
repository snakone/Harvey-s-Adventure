import { fromEvent, throttleTime } from "rxjs";
import { SWITCH_ATTACK_NAME } from "../lib/attacks";
import { ATTACK_ENUMS } from "../utils/enums";
import { character } from "../utils";
import { MonsterAttack } from "../utils/interfaces";

import { 
  showFightPanel, 
  enemy, 
  checkQueue, 
  goBackToBattleMenu, 
  showDialogScape
} from "../utils/battle_field";
import { BATTLE_LOOP_TIME } from "../utils/constants";
import { performAttack, pushAttackToQueue } from "../utils/functions";

/**
 * Listen for clicks on Battle Selection
 * 
 * Fight/Scape Selection
 * 
 * Prevents Keyboard to press the Buttons after they were shown.
 * @summary Spacebar key was clicking the button 'Scape' after a battle. FIXED
 * @template .battle-start-selection
 * @returns {void}
 */
export function listenerBattlePanel(): void {
  const battlePanel: HTMLElement | null = document.querySelector('.battle-start-selection');

  battlePanel?.addEventListener('click', (battlePanelEv: any) => {
    if(battlePanelEv.detail === 0) { return; }

    const battleName: string = battlePanelEv.target.tagName;
    const battleValue: string = battlePanelEv.target.value;
  
    if (battleName === 'BUTTON' && battleValue === 'fight') {
      showFightPanel();
    } else if(battleName === 'BUTTON' && battleValue === 'scape') {
      
      showDialogScape();
    }
  });
}

/**
 * Listen for clicks on the Battle Dialog.
 * - Checks the Queue if enemy Faints
 * @template #info-battle-dialog
 * @see {@link checkQueue}
 * @returns {void}
 */
export function listenerBattleQueue(): void {
  const dialogRef = document.getElementById('info-battle-dialog');

  fromEvent(dialogRef!, 'click').pipe(
    throttleTime(BATTLE_LOOP_TIME),
  ).subscribe(_ => {
    const monster = character.selectedMonster;
    if(monster?.attacking || enemy?.attacking) { return; }

    if (enemy && enemy!.props.stats!.health! <= 0) {
      enemy!.attacking = false;
      enemy!.faint();
      return;

    } else if (monster?.props.stats!.health! <= 0) {
      monster!.attacking = false;
      monster!.faint();
      return;
    }

    checkQueue(dialogRef!);
  });
}

/**
 * Listen for clicks on the Battle Fight Panel
 * 
 * - This panel shows the Monster Attacks.
 * - Performs the Monster Attacks.
 * @template .battle-fight-panel
 * @returns {void}
 */
export function listenerFightPanel(): void {
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