import { battleMap } from "../utils/battle_field";
import { keyBoardDisabled } from "../utils/setters";
import { playFirstAudio } from "./audio.listeners";

export const gameKeys: {[key: string]: boolean | string} = {
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
    if(battleMap.initilized || keyBoardDisabled) { return; }
    if(e.key === ' ') gameKeys.running = true;
    gameKeys[e.key] = true;
    gameKeys.lastKey = e.key;
    playFirstAudio();
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    if(battleMap.initilized) { return; }
    if(e.key === ' ') gameKeys.running = false;
    if(!validKeys.includes(e.key)) return;
    gameKeys[e.key] = false;
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}