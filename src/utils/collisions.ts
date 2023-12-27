import { PALLET_TOWN_COLLISION } from "../lib/pallet_town";

const HORIZONTAL_TILES = 70;

export function checkCollision(): number[][] {
  const subTile = [];
  for (let i = 0; i < PALLET_TOWN_COLLISION.length; i += HORIZONTAL_TILES) {
    subTile.push(PALLET_TOWN_COLLISION.slice(i, HORIZONTAL_TILES + i));
  }

  return subTile;
}