import { PALLET_TOWN_BATTLE_ZONES } from "../lib/pallet_town";
import { HORIZONTAL_TILES } from "./constants";

export function createBattleZonesMap(): number[][] {
  const subTile = [];
  for (let i = 0; i < PALLET_TOWN_BATTLE_ZONES.length; i += HORIZONTAL_TILES) {
    subTile.push(PALLET_TOWN_BATTLE_ZONES.slice(i, HORIZONTAL_TILES + i));
  }

  return subTile;
}