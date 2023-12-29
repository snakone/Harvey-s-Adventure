export const MONSTER_ATTACKS: {[key in MONSTER_ATTACK_NAMES]: MonsterAttack} = {
  Tackle: {
    name: 'Tackle',
    power: 10,
    type: 'Normal'
  },
  Fireball: {
    name: 'Fireball',
    power: 15,
    type: 'Fire'
  }
}

type MONSTER_ATTACK_NAMES = 'Tackle' | 'Fireball';

export interface MonsterAttack {
  name: string;
  power: number;
  type: MONSTER_TYPE;
}

export type MONSTER_TYPE = 'Normal' | 'Fire' | 'Water' | 'Electric'