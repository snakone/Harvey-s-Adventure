import { ATTACK_ENUMS, ELEMENTALS } from "../utils/enums";

export const MONSTER_ATTACKS: {[key in ATTACK_ENUMS]: MonsterAttack} = {
  Tackle: {
    name: ATTACK_ENUMS.TACKLE,
    power: 10,
    type: ELEMENTALS.NORMAL
  },
  Fireball: {
    name: ATTACK_ENUMS.FIREBALL,
    power: 15,
    type: ELEMENTALS.FIRE
  }
}

export interface MonsterAttack {
  name: ATTACK_ENUMS;
  power: number;
  type: ELEMENTALS;
}

