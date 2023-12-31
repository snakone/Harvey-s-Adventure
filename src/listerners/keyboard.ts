export const keys: {[key: string]: boolean | string} = {
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
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}