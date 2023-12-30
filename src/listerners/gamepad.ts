import { keys } from "./keyboard.js";

export const GAME_PADS: {[key: number]: Gamepad | null} = {};

export function listenGamePad(): void {
  window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
    GAME_PADS[e.gamepad.index] = e.gamepad;
  });

  window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
    delete GAME_PADS[e.gamepad.index];
  });
}
export const CONTROLLER_KEY_MAP: any = {
  12: 'w',
  13: 's',
  14: 'a',
  15: 'd',
  0: ' '
};

const validKeys = Object.keys(CONTROLLER_KEY_MAP).map(Number);

export function scanGamePads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i]!.index in GAME_PADS)) {
      GAME_PADS[gamepads[i]!.index] = gamepads[i];
    }
  }

  GAME_PADS[0]?.buttons.forEach((button, i) => {
    if (!validKeys.includes(i)) return;
    if(button.pressed) {
      keys[CONTROLLER_KEY_MAP[i]] = true;
      keys.lastKey = CONTROLLER_KEY_MAP[i];
    } else {
      keys[CONTROLLER_KEY_MAP[i]] = false;
    }
  });

  GAME_PADS[0]?.buttons
  .filter((_: GamepadButton, i: number) => i === 0 && keys.lastKey === ' ')
  .forEach((button: GamepadButton) => {
    keys.running = button.pressed;
  });
}

