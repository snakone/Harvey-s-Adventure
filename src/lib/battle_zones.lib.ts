import Boundary from "../classes/boundary.class";
import { createBattleZonesMap } from "../utils/battle_zones.utils";
import { RECT_WIDTH, RECT_HEIGHT } from "../utils/constants";
import { BOUNDRY_TYPE_ENUM } from "../utils/enums";
import { BoundaryProps } from "../utils/interfaces";
import { OFFSET_X, OFFSET_Y } from "./sprites.lib";

const BATTLE_ZONES: Boundary[] = buildBattleZones();

export function buildBattleZones(): Boundary[] {
  const battleZonesMap: number[][] = createBattleZonesMap();
  const array: Boundary[] = [];

  battleZonesMap.forEach((row: number[], i: number) => {
    row.forEach((symbol: number, j: number) => {
      if (symbol === 1) {
        const boundary: BoundaryProps = {
          pos: {
            x: j * RECT_WIDTH + OFFSET_X,
            y: i * RECT_HEIGHT + OFFSET_Y
          },
          moveable: true,
          type: BOUNDRY_TYPE_ENUM.BATTLE
        }
        array.push(new Boundary(boundary));
      }
    })
  });

  return array;
}

export default BATTLE_ZONES;