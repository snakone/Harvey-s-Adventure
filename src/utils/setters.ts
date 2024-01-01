import Monster from "../classes/monsters.class";
export let lastMonsterAttacked: Monster | undefined = undefined;
export let keyBoardDisabled = false;
export let canCloseBattleDialog = false;

/**
 * Set if the Battle Dialog can be closed given the value.
 * @param {boolean} value - Value to set
 * @returns {void}
 */
export function setCanCloseBattleDialog(value: boolean): void {
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

/**
 * Set if the Keyboard can be used given the value.
 * 
 * Prevents Random/Multiple Keyboard Events
 * @param {boolean} value:boolean
 * @returns {void}
 */
export function setKeyBoardCanbeUsed(value: boolean): void {
  keyBoardDisabled = !value;
}