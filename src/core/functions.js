
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
      combinations.push(new combination(Math.floor(Math.random() * (9 - 1) + 1),sides[Math.floor(Math.random() * 2)]));
      console.log(combinations[i].rotation, combinations[i].side);
    }

    return combinations;
  }

  export    function win(scene, openDoor,openDoorShadow, bg, closedDoor, handle, handleShadow,  ticker ) {
    let blink = PIXI.Sprite.from(Assets._assets.blink);
    blink.alpha = 0;
    spriteSetup(blink, -50, 0, 3)

    setTimeout(()=>{
      gsap.fromTo(blink, {pixi:{brightness: 0.8, opacity:0 }}, {pixi:{brightness: 1.1,opacity: 1 }, duration: 2, yoyo: true, repeat: -1});
      scene.addChild(blink);
      ticker.start();
      ticker.add(()=> {
        blink.alpha += 0.005;
      })
    }, 2000);
    
    gsap.fromTo(openDoor, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 }, delay: 1 , duration: 5 });
    gsap.fromTo(openDoorShadow,{ pixi: { brightness: 0 } },{ pixi: { brightness: 1 },delay:1,  duration: 5 });
    gsap.fromTo(bg,{ pixi: { brightness: 0 } },{ pixi: { brightness: 1 }, delay: 1, duration: 5 });
    
    scene.addChild(openDoor, openDoorShadow);
    scene.removeChild(closedDoor, handle, handleShadow);
  }

  export function spriteSetup(sprite, x, y, zindex) {
    sprite.anchor.set(0.5);
    sprite.scale.set(0.35);
    sprite.position.set(x, y);
    sprite.zIndex = zindex;
  }