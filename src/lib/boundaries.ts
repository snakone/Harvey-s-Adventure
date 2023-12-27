import Boundary, { RECT_HEIGHT, RECT_WIDTH } from "../classes/boundary";
import { checkCollision } from "../utils/collisions";
import { BoundaryProps } from "../utils/interfaces";
import { OFFSET_X, OFFSET_Y } from "./sprites";

const BOUNDARIES: Boundary[] = buildBoundaries();

export function buildBoundaries(): Boundary[] {
  const collisionMap: number[][] = checkCollision();
  const array: Boundary[] = [];
  
  collisionMap.forEach((row: number[], i: number) => {
    row.forEach((symbol: number, j: number) => {
      if (symbol === 1025) {
        const boundary: BoundaryProps = {
          pos: {
            x: j * RECT_WIDTH,
            y: i * RECT_HEIGHT
          },
          offset: {
            x: OFFSET_X,
            y: OFFSET_Y
          }
        }
        array.push(new Boundary(boundary));
      }
    })
  });

  return array;
}

export default BOUNDARIES;