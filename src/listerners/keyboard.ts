export const keys: any = {
  a: false,
  d: false,
  w: false,
  s: false,
  lastKey: ''
};

export function listenKeyboard(): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    keys[e.key] = true;
    keys.lastKey = e.key;
  });

  window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.key] = false;
  });
}