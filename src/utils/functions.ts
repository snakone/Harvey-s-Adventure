import gsap from "gsap";
import Boundary from "../classes/boundary.class";
import Monster from "../classes/monsters.class";
import { MONSTER_LIBRARY } from "../lib/monsters.lib";
import { BATTLE_QUEUE } from "./battle_field";
import { MONSTERS_ENUM } from "./enums";
import { MonsterAttack, MonsterProps } from "./interfaces";
import { character } from ".";

/**
 * Returns the area of the Player against given Battle Zone.
 * @param {Boundary} zone - Boundry to check
 * @returns {number}
 */
export function getOverlappingBattleArea(
  zone: Boundary
): number {
  return (Math.min(
    character.sprite.props.pos!.x + 48,
    zone.props.pos.x + 48
  ) -
    Math.max(character.sprite.props.pos!.x, zone.props.pos.x)) *
  (Math.min(
    character.sprite.props.pos!.y + 48,
    zone.props.pos.y + 48
  ) -
    Math.max(character.sprite.props.pos!.y, zone.props.pos.y));
}

/**
 * Return a Random MonsterProps
 * @see {@link Monster}
 * @returns {MonsterProps}
 */
export function getRandomMonster(): MonsterProps {
  const keys = Object.keys(MONSTER_LIBRARY) as MONSTERS_ENUM[];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return MONSTER_LIBRARY.Butterflop;
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
  const randomAttack = attacker.props.attacks![2];
  BATTLE_QUEUE.push(() => {
    attacker.attack({
      data: randomAttack,
      recipent
    });
  });
}

export function canMonsterScape(enemy: Monster): boolean {
  const monster = character.selectedMonster;
  if(!monster || !enemy) { return false; }

  if(monster.props.stats!.level! > enemy?.props.stats!.level!) {
    return true;
  }

  const monsterLevel = monster.props!.stats?.level || 0;
  const enemyLevel = enemy.props!.stats?.level || 0;
  const levelDifference = Math.abs(monsterLevel - enemyLevel);

  if (monsterLevel > enemyLevel || (monsterLevel === enemyLevel && Math.random() <= 0.95)) {
    return true;
  }

  return Math.random() * 100 <= switchCanEscape(levelDifference);
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
 * Returns if Monster can Scape given the Level Difference
 * @param {number} diff - Level Difference Between Monster and Enemy
 * @default 50
 * @returns {number}
 */
export const switchCanEscape = (diff: number): number => {
  const switchObj: {[key: number]: number} = {
    1: 90,
    2: 85,
    3: 75,
    4: 60
  };

  if(!switchObj[diff]) { return 50; }
  return switchObj[diff];
}