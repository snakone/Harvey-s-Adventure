import { MonsterAttack } from "../lib/attacks";

export interface Coords {
  x: number;
  y: number;
}

export interface SpriteProps {
  pos: Coords, // Position
  src: string | undefined,
  img?: HTMLImageElement | undefined,
  scale?: number,
  frames?: number, // Total Frames
  moveable?: boolean, // Can Sprite Move?
  velocity?: number, // Move Velocity
  moving?: boolean, // Actually Moving
  sprites?: {[key: string]: HTMLImageElement};
  animated?: boolean, // Monster Animation Default,
  hold?: number,
  opacity?: number // Battle Opacity
  rotation?: number;
}

export interface MonsterProps extends SpriteProps {
  enemy?: boolean, // Sprite is Enemy
  ally?: boolean, // Sprite is Ally
  stats?: MonsterStats,
  attacks?: MonsterAttack[],
}

export interface BoundaryProps {
  pos: Coords, // Position
  width?: number,
  height?: number,
  velocity?: number, // Move Velocity
  moveable?: boolean, // Can Sprite Move?
  type: 'wall' | 'battle'
}

export interface MonsterStats {
  health?: number;
  level?: number;
  gender: 'male' | 'female',
  name: string;
  dead?: boolean;
}

export interface AttackFunction {
  (): void;
}