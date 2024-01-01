import Sprite from "./sprites.class";
import { MonsterAttack, MonsterProps, MonsterStats } from "../utils/interfaces";
import { canvas } from "./canvas";
import gsap from "gsap";
import { ATTACK_ANIMATIONS } from "../lib/attacks";
import { ATTACK_ENUMS, BATTLE_SPRITE_POSITION_ENUM, MONSTER_GENDER_ENUM } from "../utils/enums";
import { setLastMonsterAttacked, canCloseBattleDialog, setCanCloseBattleDialog } from "../utils/setters";
import { stopBattleAndStartVictoryAudio } from "../lib/audio.lib";
import { returnToMap } from "../utils/functions";

import { 
  BATTLE_QUEUE as BATTLE_QUEUE,
  animateExpBar,
  endBattle,
  showDialogAfterAttack
} from "../utils/battle_field";

import { 
  BATTLE_LOOP_TIME,
  CLICK_HERE_BATTLE_DIALOG_IMAGE,
  DEFAULT_ALLY_BATTLE_POSITION, 
  DEFAULT_ALLY_SPRITE_X, 
  DEFAULT_ENEMY_BATTLE_POSITION,
  DEFAULT_ENEMY_SPRITE_X,
  DEFAULT_MONSTER_SCALE, 
} from "../utils/constants";

class Monster extends Sprite {
  props: MonsterProps;
  selected = false;
  enemy = false;

  constructor({
    pos, src, frames = 0, scale = DEFAULT_MONSTER_SCALE, velocity = 3, moveable = false, name = '', 
    moving = false, sprites, animated = false, hold = 15, opacity = 1, attacks = [],
    stats = {
      health: 100,
      level: Math.floor(Math.random() * (5 - 3 + 1) + 3),
      gender: Math.random() <= 0.5 ? MONSTER_GENDER_ENUM.MALE : MONSTER_GENDER_ENUM.FEMALE,
      dead: false,
      givenExp: 100,
      totalExp: 0
    }
  }: MonsterProps, enemy: boolean) {
    super({
      pos, src, frames, scale, velocity, moveable, 
      moving, sprites, animated, hold, opacity,
    });
    this.props = { 
      pos, src, frames, scale, 
      img: Sprite.createImage(src),
      moveable, velocity, moving, sprites, animated, 
      hold, opacity, attacks, name,
      stats: {
        ...stats,
        health: 100,
        level: Math.floor(Math.random() * (6 - 3 + 1) + 3),
        gender: Math.random() <= 0.5 ? MONSTER_GENDER_ENUM.MALE : MONSTER_GENDER_ENUM.FEMALE,
        dead: false,
      }
    };

    // ASSIGN STATS RESET ON AFTER EVERY BATTLE
    this.enemy = enemy;
    this.props.name = name;
    this.current = 0;
    this.elapsed = 0;
    this.selected = false;

    // CHECK IF ENEMY AND EXP
    this.props.pos = this.enemy ? DEFAULT_ENEMY_BATTLE_POSITION : DEFAULT_ALLY_BATTLE_POSITION;
    this.props.stats!.totalExp = this.props.stats!.totalExp !== undefined ? this.props.stats!.totalExp : 0;

    if(Object.keys(this.props.sprites!).length > 0) {
      !this.enemy ? 
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

    if (recipent.props.stats!.health! <= 0) {
      recipent.faint();
      return;
    }

    if(this.props.stats!.health! <= 0) {
      this.faint();
      return;
    }

    this.attacking = true;
    recipent.attacking = true;
    recipent.props.stats!.health! -= data.power;
    showDialogAfterAttack(data, this.props!.name);
    setLastMonsterAttacked(this);

    const healthBarClass = recipent.enemy ? '.health-bar-enemy.green' : '.health-bar-ally.green';
    const xBounce = recipent.enemy ? 95 : -75;
    const yBounce = recipent.enemy ? 55 : -35;
    const recoil = recipent.enemy ? 25 : -25;
    const tl = gsap.timeline();

    switch(data.name) {
      case ATTACK_ENUMS.TACKLE: {
        ATTACK_ANIMATIONS(this, recipent, tl, xBounce, yBounce, recoil, healthBarClass)
         .Tackle();
        break;
      }

      case ATTACK_ENUMS.FIREBALL: {
        ATTACK_ANIMATIONS(this, recipent, tl, xBounce, yBounce, recoil, healthBarClass)
         .Fireball();
        break;
      }

      case ATTACK_ENUMS.ICE_SHOT: {
        ATTACK_ANIMATIONS(this, recipent, tl, xBounce, yBounce, recoil, healthBarClass)
         .IceShot();
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
      setCanCloseBattleDialog(false);
      return; 
    }

    if(this.props.stats?.dead) { return; }

    if(dialogRef) { 
      dialogRef.innerHTML = `<strong>${this.props?.name}</strong> fainted!
      ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;
    }

    this.props.stats!.dead = true;
    this.attacking = false;

    const tl = gsap.timeline();
    
    gsap.to(this.props.pos!, { y: this.props.pos!.y + 20, duration: 0.8 });
    tl.to(this.props, { opacity: 0, duration: 0.7 })
      .to(this.props.pos!, { y: this.props.pos!.y})
      .then(_ => {
        if(this.enemy) {
          // EXP DIALOG
          BATTLE_QUEUE.push(() => {
            dialogRef!.innerHTML = `<strong>${this.props?.name}</strong> gained 
            <strong>${this!.props.stats?.givenExp}</strong> experience points!
              ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;
          });

          setTimeout(() => stopBattleAndStartVictoryAudio(), 500);

          BATTLE_QUEUE.push(() => {
            animateExpBar(this!.props.stats?.givenExp!);
          });

          setTimeout(() => {
            setCanCloseBattleDialog(true);
          }, BATTLE_LOOP_TIME);
        } else {
            dialogRef!.innerHTML = `<strong>${this.props?.name}</strong> fainted!
            ${CLICK_HERE_BATTLE_DIALOG_IMAGE}`;
            setTimeout(() => {
              setCanCloseBattleDialog(true);
            }, BATTLE_LOOP_TIME);
        }
    });
  }

  public checkStartBattleAnimation(): void {
    if (this.enemy) {
      if (this.props.pos!.x > canvas.width - (this.props.img ? (this.props.img.width) + 30 : 0)) {
        this.props.pos!.x -= 12;
      }
    } else {
      if (this.props.pos!.x < (this.props.img ? (this.props.img.width + 64) : 0)) {
        this.props.pos!.x += 15;
      }
    }
  }

  public restartMonsterBattlePosition(): void {
     this.props.pos!.x = this.enemy ? DEFAULT_ENEMY_SPRITE_X : DEFAULT_ALLY_SPRITE_X;
  }

  /**
   * Description
   * @param {any} value:any
   * @param {any} key:keyofMonsterStats
   * @returns {any}
   */
  public changeStat(value: string | number, key: keyof MonsterStats): void {
    if(!value || !key || !this.props.stats) { return; }
    this.props.stats[key] = value as never;
  }

  /**
   * Flip Monster Sprite given the value
   * @param {BATTLE_SPRITE_POSITION_ENUM} value - Battle Sprite Position Enum Value: 'front' | ' back'
   * @returns {void}
   */
  public flipSprite(value: BATTLE_SPRITE_POSITION_ENUM): void {
    if(this.props.sprites) this.props.img = this.props.sprites[value];
  }
}

export default Monster;
