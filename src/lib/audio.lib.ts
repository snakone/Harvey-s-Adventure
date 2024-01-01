import { Howl } from 'howler';

export const AUDIO_LIBRARY: {[key in AUDIO_EUM]: Howl} = {
  map: new Howl({
    src: '/audio/map.wav',
    html5: true,
    volume: 0.2,
    preload: true,
    loop: true
  }),
  initBattle: new Howl({
    src: 'audio/initBattle.wav',
    html5: true,
    volume: 0.1,
    preload: true,
    onend: (_ => AUDIO_LIBRARY.battle.play())
  }),
  battle: new Howl({
    src: 'audio/battle.mp3',
    html5: true,
    volume: 0.1,
    preload: true,
    loop: true
  }),
  tackleHit: new Howl({
    src: 'audio/tackleHit.wav',
    html5: true,
    volume: .666,
    preload: true,
  }),
  initFireball: new Howl({
    src: 'audio/initFireball.wav',
    html5: true,
    volume: .666,
    preload: true,
  }),
  fireballHit: new Howl({
    src: 'audio/fireballHit.wav',
    html5: true,
    volume: .666,
    preload: true,
  }),
  victory: new Howl({
    src: 'audio/victory.wav',
    html5: true,
    volume: .333,
    preload: true,
    loop: true,
  }),
  levelUp: new Howl({
    src: 'audio/levelUp.wav',
    html5: true,
    volume: .666,
    preload: true,
    loop: true
  }),
};

export function stopMapAndStartBattleAudio(): void {
  AUDIO_LIBRARY.map.stop();
  AUDIO_LIBRARY.initBattle.play();
}

export function stopBattleAndStartMapAudio(): void {
  AUDIO_LIBRARY.battle.stop();
  AUDIO_LIBRARY.victory.stop();
  AUDIO_LIBRARY.levelUp.stop();
  AUDIO_LIBRARY.map.play();
}

export function stopBattleAndStartVictoryAudio(): void {
  AUDIO_LIBRARY.battle.stop();
  AUDIO_LIBRARY.victory.play();
}

export function stopVictoryAndStartLevelUpAudio(): void {
  AUDIO_LIBRARY.victory.stop();
  AUDIO_LIBRARY.levelUp.play();
}

export enum AUDIO_EUM {
  MAP = 'map',
  INIT_BATTLE = 'initBattle',
  BATTLE = 'battle',
  TACKLE_HIT = 'tackleHit',
  FIREBALL_HIT = 'fireballHit',
  INIT_FIREBALL = 'initFireball',
  VICTORY = 'victory',
  LEVEL_UP = 'levelUp'
}