import { keys } from "./keyboard";

export const GAME_PADS: {[key: number]: Gamepad | null} = {};

export function listenGamePad(): void {
  window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
    GAME_PADS[e.gamepad.index] = e.gamepad;
  });

  window.addEventListener('gamepaddisconnected', (e: GamepadEvent) => {
    delete GAME_PADS[e.gamepad.index];
  });
}

export function scanGamePads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i]!.index in GAME_PADS)) {
      GAME_PADS[gamepads[i]!.index] = gamepads[i];
    }
  }

  const connectedGamePads = Object.keys(GAME_PADS).length > 0;
  const anyButtonPressed = GAME_PADS[0]?.buttons.some((button: GamepadButton) => button.pressed);

  if (connectedGamePads) {
    if (anyButtonPressed) {
      keys.lastKey = '';
    }
    GAME_PADS[0]?.buttons
    .filter((_: GamepadButton, i: number) => i === 0 && keys.lastKey === '')
    .forEach((button: GamepadButton) => {
      keys.running = button.pressed;
    })
  }
}

export const CONTROLLER_KEY_MAP: any = {
  12: 'w',
  13: 's',
  14: 'a',
  15: 'd',
  0: ' '
};