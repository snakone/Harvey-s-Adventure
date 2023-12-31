export enum ATTACK_ENUMS {
  TACKLE = 'Tackle',
  FIREBALL = 'Fireball',
  ICE_SHOT = 'IceShot'
}

export enum ELEMENTALS_ENUM {
  NORMAL = 'Normal',
  FIRE = 'Fire',
  ELECTRIC = 'Electric',
  WATER = 'Water',
  ICE = 'Ice'
}

export const SWITCH_COLOR_TYPE: {[key in ELEMENTALS_ENUM]: string} = {
  Normal: 'black',
  Fire: 'firebrick',
  Electric: 'yellow',
  Water: 'darkcyan',
  Ice: '#0da591'
}

export enum MONSTERS_ENUM {
  EMBY = 'Emby',
  DRAGGLE = 'Draggle',
  BUTTERFLOP = 'Butterflop'
}

export enum BATTLE_SPRITE_POSITION_ENUM {
  FRONT = 'front',
  BACK = 'back',
  UP = 'up',
  LEFT = 'left',
  DOWN = 'down',
  RIGHT = 'right'
}

export enum MONSTER_GENDER_ENUM {
  MALE = 'male',
  FEMALE = 'female'
}

export enum BOUNDRY_TYPE_ENUM {
  WALL = 'wall',
  BATTLE = 'battle'
}