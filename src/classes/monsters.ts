import Sprite from "../classes/sprites";
import { MonsterProps, MonsterStats } from "../utils/interfaces";
import { canvas } from "./canvas";
import gsap from "gsap";
import { ATTACK_ENUMS } from "../utils/enums";

import { 
  ATTACK_QUEUE,
  animateExpBar,
  canCloseBattleDialog,
  endBattle,
  returnToMap,
  setCanCloseBattle,
  setLastMonsterAttacked,
  showBattleDialog
} from "../utils/battle_field";

import { ATTACK_ANIMATIONS, MonsterAttack } from "../lib/attacks";
import { DEFAULT_ALLY_SPRITE_Y, DEFAULT_ENEMY_SPRITE_Y } from "../utils/constants";

class Monster extends Sprite {
  props: MonsterProps;
  selected = false;

  constructor({
    pos, src, frames = 0, scale = 1, velocity = 3, moveable = false, 
    moving = false, sprites, animated = false, hold = 15, opacity = 1,
    enemy = false, ally = false, attacks = [],
    stats = {
      health: 100,
      level: 1,
      gender: Math.random() <= 0.5 ? 'male' : 'female',
      name: '',
      dead: false,
      givenExp: 10,
      totalExp: 0
    }
  }: MonsterProps) {
    super({
      pos, src, frames, scale, velocity, moveable, 
      moving, sprites, animated, hold, opacity,
    });
    this.props = { 
      pos, src, frames, scale, 
      img: Sprite.createImage(src),
      moveable, velocity, moving, sprites, animated, 
      hold, opacity, enemy, ally, stats, attacks
    };

    this.props.stats!.health = 100;
    this.props.stats!.dead = false;
    this.current = 0;
    this.elapsed = 0;
    this.selected = false;
    this.props.pos.y = this.props.ally ? DEFAULT_ALLY_SPRITE_Y : DEFAULT_ENEMY_SPRITE_Y;
    this.props.stats!.totalExp = this.props.stats!.totalExp !== undefined ? this.props.stats!.totalExp : 0;

    if(Object.keys(this.props.sprites!).length > 0) {
      this.props.ally ? 
        this.props.img = this.props.sprites!.back :
        this.props.img = this.props.sprites!.front;
    }
  }
  
  public attack({
    data,
    recipent
  }: {
    data: MonsterAttack, 
    recipent: Monster
  }): void {
    if (
      this.attacking || 
      recipent.attacking ||
      recipent.props.stats?.dead ||
      this.props.stats?.dead
    ) { return; }

    this.attacking = true;
    recipent.attacking = true;
    recipent.props.stats!.health! -= data.power;
    showBattleDialog(data, this.props.stats!.name);
    setLastMonsterAttacked(this);

    const healthBarClass = recipent.props.enemy ? '.health-bar-enemy.green' : '.health-bar-ally.green';
    const xBounce = recipent.props.enemy ? 95 : -75;
    const yBounce = recipent.props.enemy ? 55 : -35;
    const recoil = recipent.props.enemy ? 25 : -25;
    const tl = gsap.timeline();

    switch(data.name) {
      case ATTACK_ENUMS.TACKLE: {
        ATTACK_ANIMATIONS(this, recipent, tl, xBounce, yBounce, recoil, healthBarClass).Tackle();
        break;
      }

      case ATTACK_ENUMS.FIREBALL: {
        ATTACK_ANIMATIONS(this, recipent, tl, xBounce, yBounce, recoil, healthBarClass).Fireball();
        break;
      }
    }
  }

  public faint(): void {
    const dialogRef = document.getElementById('info-battle-dialog');
    if(this.props.stats?.dead && canCloseBattleDialog) {
      endBattle();
      returnToMap();
      dialogRef!.style.display = 'none';
      return; 
    }

    if(this.props.stats?.dead) { return; }

    if(dialogRef) { 
      dialogRef.innerHTML = `${this.props.stats?.name} fainted!
        <img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>`;
    }

    this.props.stats!.dead = true;
    this.attacking = false;
    
    gsap.to(this.props.pos, { y: this.props.pos.y + 20});
    gsap.to(this.props, { opacity: 0 });

    if(this.props.enemy) {
      // EXP DIALOG
      ATTACK_QUEUE.push(() => {
        dialogRef!.innerHTML = `${this.props.stats?.name} gained ${this!.props.stats?.givenExp} <strong>experience points</strong>!
          <img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>`;
          // setTimeout(() => setCanCloseBattle(true), 1500);
      });

      ATTACK_QUEUE.push(() => {
        animateExpBar(this!.props.stats?.givenExp!);
      });
    } else {
      setTimeout(() => setCanCloseBattle(true), 1500);
    }
  }

  public checkStartBattleAnimation(): void {
    if (this.props.enemy) {
      if (this.props.pos.x > canvas.width - (this.props.img ? (this.props.img.width) + 30 : 0)) {
        this.props.pos.x -= 12;
      }
    } else if (this.props.ally) {
      if (this.props.pos.x < (this.props.img ? (this.props.img.width + 64) : 0)) {
        this.props.pos.x += 15;
      }
    }
  }

  public changeStat(value: any, key: keyof MonsterStats): void {
    if(!value || !key || !this.props.stats) { return; }
    this.props.stats[key] = value as never;
  }

  public changeSprite(value: 'front' | 'back'): void {
    if(this.props.sprites) this.props.img = this.props.sprites[value];
  }
}

export default Monster;