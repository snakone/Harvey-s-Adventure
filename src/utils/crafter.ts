import Monster from "../classes/monsters.class";
import { enemy } from "./battle_field";
import { ELEMENTALS_ENUM, SWITCH_COLOR_TYPE } from "./enums";
import { character } from ".";

/**
* Creates 2 HTML boxes for the Battle. Contains the following:
* - Monster's Name, Health, Level, EXP and Gender
* @template .battle-panel-ally
* @template .battle-panel-enemy
* @see {@link addMonsterStats}
* @see {@link addMonsterHealthBar}
* @see {@link addMonsterExpBar}
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

      const stats = addMonsterStats(current);
      const {bar, greenBar } = addMonsterHealthBar(current, isEnemy);

      panel.appendChild(stats);
      panel.appendChild(bar);
      panel.appendChild(greenBar);

      if(!isEnemy) {
        const { expBar, expBarBlue } = addMonsterExpBar(current);
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
* @template .battle-fight-panel
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
* Generates a Single Attack HTML Button.
* @param {string} text - Text to be displayed
* @param {string} value - Value of the Button
* @param {ELEMENTALS_ENUM} type - Attack Type to display Color
* @see {@link createAttacksByMonster}
* @returns {HTMLButtonElement}
*/
function createAttackButton(text: string, value: string, type?: ELEMENTALS_ENUM): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('animated', 'fadeIn');
  button.textContent = text;
  button.value = value;
  button.disabled = !text || text === '-';
  button.style.color = SWITCH_COLOR_TYPE[type || ELEMENTALS_ENUM.NORMAL];
  return button;
}

/**
 * Create the Monster Stats on the Monster HTML Box.
 * @param {Monster} current - Current Monster
 * @template 'Monster Lv.1 Gender'
 * @returns {HTMLElement}
 */
function addMonsterStats(current: Monster): HTMLElement {
  const { level, gender } = current.props.stats || {};
  const genderSrc = `/images/${gender}.png`;
  const el = document.createElement('div');
  el.classList.add('battle-enemy-stats');
  el.innerHTML = `<h2>${current.props.name}</h2> <span>Lv.${level}</span> <img src="${genderSrc}"/>`;
  return el;
}

/**
 * Create the Monster Health Bar on the Monster HTML Box.
 * @param {Monster} current - Current Monster
 * @param {boolean} isEnemy - Is the Monster enemy?
 * @returns {HTMLElement}
 */
function addMonsterHealthBar(
  current: Monster,
  isEnemy: boolean
): {
  bar: HTMLElement,
  greenBar: HTMLElement
} {
  const bar = document.createElement('div');
  bar.classList.add('health-bar');
  const { health } = current.props.stats || {};

  const greenBar = document.createElement('div');
  greenBar.classList.add(isEnemy ? 'health-bar-enemy' : 'health-bar-ally', 'green');
  greenBar.style.width = health + '%';

  return { bar, greenBar };
}

/**
 * Create the Monster Experience Bar on the Monster HTML Box.
 * 
 * Only for Ally.
 * @param {Monster} current - Current Monster
 * @returns {HTMLElement}
 */
function addMonsterExpBar(current: Monster): {
  expBar: HTMLElement,
  expBarBlue: HTMLElement
} {
  const { totalExp } = current.props.stats || {};
  const expBar = document.createElement('div');
  expBar.classList.add('exp-bar');

  const expBarBlue = document.createElement('div');
  expBarBlue.classList.add('exp-bar-blue');
  expBarBlue.id = 'exp-bar-blue';
  expBarBlue.style.width = totalExp! >= 100 ? '0' : totalExp + '%';

  return { expBar, expBarBlue };
}