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
  offset?: Coords, // Sprite Offset,
  moveable?: boolean // Can Sprite Move?
}

export interface BoundaryProps {
  pos: Coords, // Position
  width?: number,
  height?: number,
  offset?: Coords, // Sprite Offset,
}