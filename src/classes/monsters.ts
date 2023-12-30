import Sprite from "../classes/sprites";
import { ATTACK_ANIMATIONS, MonsterAttack } from "../lib/attacks";
import { MonsterProps } from "../utils/interfaces";
import { canvas } from "./canvas";
import gsap from "gsap";
import { ATTACK_ENUMS } from "../utils/enums";
import { canCloseBattleDialog, endBattle, returnToMap, setCanCloseBattle } from "../utils/battle_field";

class Monster extends Sprite {
  props: MonsterProps;

  constructor({
    pos, src, frames = 0, scale = 1, velocity = 3, moveable = false, 
    moving = false, sprites, animated = false, hold = 15, opacity = 1,
    enemy = false, ally = false, attacks = [],
    stats = {
      health: 100,
      level: 1,
      gender: Math.random() <= 0.5 ? 'male' : 'female',
      name: '',
      dead: false
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
    this.showBattleDialog(data);

    if (recipent.props.stats!.health! <= 0) {
      recipent.faint();
      return;
    }

    if(this.props.stats!.health! <= 0) {
      this.faint();
      return;
    }

    recipent.props.stats!.health! -= data.power;

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

    gsap.to(this.props.pos, {
      y: this.props.pos.y + 20
    })
    gsap.to(this.props, {
      opacity: 0,
      onComplete: () => {setTimeout(() => setCanCloseBattle(true), 1500)}
    });
  }

  private showBattleDialog(data: MonsterAttack): void {
    const dialogRef = document.getElementById('info-battle-dialog');

    if (dialogRef) {
      dialogRef.style.display = 'block';
      dialogRef.innerHTML = `<strong>${this.props.stats?.name}</strong> used ${data.name}
        <img class="animated bounce" src="/images/chevron-down.svg" alt="Click Here"/>`;
    }
  }
  
  public checkStartBattleAnimation(): void {
    if (this.props.enemy) {
      if (this.props.pos.x > canvas.width - (this.props.img ? (this.props.img.width / 2) + 48 : 0)) {
        this.props.pos.x -= 12;
      }
    } else if (this.props.ally) {
      if (this.props.pos.x < (this.props.img ? (this.props.img.width - 48) : 0)) {
        this.props.pos.x += 15;
      }
    }
  }
}

export default Monster;