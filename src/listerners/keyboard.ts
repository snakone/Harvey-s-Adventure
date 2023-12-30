import Sprite from "../classes/sprites";
import { SPRITES } from "../lib/sprites";
import { changeReturnFromBattle } from "../utils/functions";

const player: Sprite = SPRITES[1];

export const keys: any = {
  a: false,
  d: false,
  w: false,
  s: false,
  lastKey: '',
  running: false
};

export function listenKeyboard(): void {
  const validKeys = ['a', 'd', 'w', 's'];

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === ' ') keys.running = true;
    if (!validKeys.includes(e.key)) return;
    keys[e.key] = true;
    keys.lastKey = e.key;
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === ' ') keys.running = false;
    if (!validKeys.includes(e.key)) return;
    keys[e.key] = false;
    player.current = 0;
    changeReturnFromBattle(false);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}