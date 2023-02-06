
import Assets from "../core/AssetManager";
import { keyboard } from "../core/keyboard";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";


export function generateCode(combinations) {
    let sides = ["clockwise", "counterclockwise"];

    function combination(rotation, side) {
      this.rotation = rotation;
      this.side = side;
    }

    for (let i = 0; i <= 2; i++) {
      combinations.push(new combination(Math.floor(Math.random() * (10 - 1) + 1),sides[Math.floor(Math.random() * 2)]));
      console.log(combinations[i].rotation, combinations[i].side);
    }

    return combinations;
  }


  export function spriteSetup(sprite, x, y, zindex) {
    sprite.anchor.set(0.5);
    sprite.scale.set(0.35);
    sprite.position.set(x, y);
    sprite.zIndex = zindex;
  }