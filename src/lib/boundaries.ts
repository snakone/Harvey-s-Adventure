import Boundary from "../classes/boundary";
import { createCollisionMap } from "../utils/collisions";
import { RECT_WIDTH, RECT_HEIGHT } from "../utils/constants";
import { BoundaryProps } from "../utils/interfaces";
import { OFFSET_X, OFFSET_Y } from "./sprites";

const BOUNDARIES: Boundary[] = buildBoundaries();

export function buildBoundaries(): Boundary[] {
  const collisionMap: number[][] = createCollisionMap();
  const array: Boundary[] = [];

  collisionMap.forEach((row: number[], i: number) => {
    row.forEach((symbol: number, j: number) => {
      if (symbol === 1) {
        const boundary: BoundaryProps = {
          pos: {
            x: j * RECT_WIDTH + OFFSET_X,
            y: i * RECT_HEIGHT + OFFSET_Y
          },
          moveable: true,
          type: 'wall'
        }
        array.push(new Boundary(boundary));
      }
    })
  });

  return array;
}

export default BOUNDARIES;