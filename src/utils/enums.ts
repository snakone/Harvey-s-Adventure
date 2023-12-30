export enum ATTACK_ENUMS {
  TACKLE = 'Tackle',
  FIREBALL = 'Fireball'
}

export enum ELEMENTALS {
  NORMAL = 'Normal',
  FIRE = 'Fire',
  ELECTRIC = 'Electric',
  WATER = 'Water'
}

export const SWITCH_COLOR_TYPE: {[key in ELEMENTALS]: string} = {
  Normal: 'black',
  Fire: 'firebrick',
  Electric: 'yellow',
  Water: 'darkcyan'
}