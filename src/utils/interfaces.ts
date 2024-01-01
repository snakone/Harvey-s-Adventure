import { ATTACK_ENUMS, BATTLE_SPRITE_POSITION_ENUM, BOUNDRY_TYPE_ENUM, ELEMENTALS_ENUM, MONSTER_GENDER_ENUM } from "./enums";

export interface Coords {
  x: number;
  y: number;
}

export interface SpriteProps {
  pos?: Coords, // Position
  src: string | undefined,
  img?: HTMLImageElement | undefined,
  scale?: number,
  frames?: number, // Total Frames
  moveable?: boolean, // Can Sprite Move?
  velocity?: number, // Move Velocity
  moving?: boolean, // Actually Moving
  sprites?: Partial<{[key in BATTLE_SPRITE_POSITION_ENUM]: HTMLImageElement}>;
  animated?: boolean, // Monster Animation Default,
  hold?: number,
  opacity?: number // Battle Opacity
  rotation?: number;
}

export interface MonsterProps extends SpriteProps {
  stats?: MonsterStats,
  name: string;
  attacks?: MonsterAttack[],
}

export interface BoundaryProps {
  pos: Coords, // Position
  width?: number,
  height?: number,
  velocity?: number, // Move Velocity
  moveable?: boolean, // Can Sprite Move?
  type: BOUNDRY_TYPE_ENUM
}

export interface MonsterStats {
  health?: number;
  level?: number;
  gender: MONSTER_GENDER_ENUM,
  dead?: boolean;
  givenExp?: number; // EXP given upon defeat
  totalExp?: number; // Total Monster EXP
}

export interface AttackFunction {
  (): void;
}

export interface MonsterAttack {
  name: ATTACK_ENUMS;
  power: number;
  type: ELEMENTALS_ENUM;
}