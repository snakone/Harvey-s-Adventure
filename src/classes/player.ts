import Monster from "./monsters.class";
import Sprite from "./sprites.class";

class Player {
  team: Monster[] = [];

  constructor(public sprite: Sprite) {}

  public createTeam(...monsters: Monster[]): void {
    this.team = [...monsters];

    if(this.team.length > 0) {
      this.team[0].selected = true;
    }
  }

  public selectMonster(i: number): void {
    this.team.forEach(monster => monster.selected = false);
    this.team[i].selected = true;
  }

  public get selectedMonster() : Monster {
    return this.team.find(monster => monster.selected) || this.team[0];
  }
  
}

export default Player;