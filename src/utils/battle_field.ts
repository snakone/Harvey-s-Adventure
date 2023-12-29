import { MONSTER_ATTACKS } from "../lib/attacks";
import { MONSTER_SPRITES } from "../lib/monsters";
import gsap from "gsap";

export const ATTACK_QUEQUE: any[] = []

export function createBattle(): void {
  const panel: HTMLElement | null = document.querySelector('.batte-start-selection');
  const ally = MONSTER_SPRITES.find(monster => monster.props.ally);
  const enemy = MONSTER_SPRITES.find(monster => monster.props.enemy);
  
  if (panel) {
    panel.addEventListener('click', (e: any) => {
      if (e.target.tagName === 'BUTTON' && e.target.value === 'true') {
        panel.style.display = 'none';

        const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');

        if (fightPanel) {
          fightPanel.classList.add('fadeIn');
          fightPanel.style.display = 'grid';

          fightPanel.addEventListener('click', (e: any) => {
            if (e.target.tagName === 'BUTTON' && e.target.value === '1' && ally && enemy) {
              ally.attack({
                data: MONSTER_ATTACKS.Tackle,
                recipent: enemy
              });
              ATTACK_QUEQUE.push(() => {
                enemy.attack({
                  data: MONSTER_ATTACKS.Tackle,
                  recipent: ally
                });
              });
            } else if (e.target.tagName === 'BUTTON' && e.target.value === '2' && ally && enemy) {
              ally.attack({
                data: MONSTER_ATTACKS.Fireball,
                recipent: enemy
              });

              ATTACK_QUEQUE.push(() => {
                enemy.attack({
                  data: MONSTER_ATTACKS.Tackle,
                  recipent: ally
                });
              });

              ATTACK_QUEQUE.push(() => {
                enemy.attack({
                  data: MONSTER_ATTACKS.Fireball,
                  recipent: ally
                });
              });
            } else if (e.target.tagName === 'BUTTON' && e.target.value === 'back') {
              fightPanel.classList.remove('fadeIn');
              fightPanel.style.display = 'none';
              panel.classList.add('fadeIn');
              panel.style.display = 'grid';
            } else if (e.target.tagName === 'BUTTON' && e.target.value === '3' && ally && enemy) {
              enemy.attack({
                data: MONSTER_ATTACKS.Fireball,
                recipent: ally
              });
            }
          });
        }
      } else if(e.target.tagName === 'BUTTON' && e.target.value === 'false') {
        gsap.to('.battle-panel-enemy', { display: 'none' });
        gsap.to('.battle-panel-ally', { display: 'none' });
        gsap.to('#battle-panel', { opacity: 0 });
      }
    })
  }
}