import { BATTLE_SPRITES } from "../lib/sprites";

export function createBattle(): void {
  const panel: HTMLElement | null = document.querySelector('.batte-start-selection');
  const ally = BATTLE_SPRITES.find(sprite => sprite.props.ally);
  const enemy = BATTLE_SPRITES.find(sprite => sprite.props.enemy);
  
  if (panel) {
    panel.addEventListener('click', (e: any) => {
      if (e.target.tagName === 'BUTTON' && e.target.value === 'true') {
        panel.style.display = 'none';

        const fightPanel: HTMLElement | null = document.querySelector('.battle-fight-panel');

        if (fightPanel) {
          fightPanel.classList.add('fadeIn');
          fightPanel.style.display = 'grid';

          fightPanel.addEventListener('click', (e: any) => {
            if (e.target.tagName === 'BUTTON' && e.target.value === '1' && ally) {
              ally.attack({
                data: {
                  name: 'Tackle',
                  power: 10,
                  type: 'Normal'
                },
                recipent: enemy
              })
            } else if (e.target.tagName === 'BUTTON' && e.target.value === 'back') {
              fightPanel.classList.remove('fadeIn');
              fightPanel.style.display = 'none';
              panel.classList.add('fadeIn');
              panel.style.display = 'grid';
            }
          });
        }
      }
    })
  }
}