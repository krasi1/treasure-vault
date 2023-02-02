import Scene from "./Scene";
import Assets from "../core/AssetManager";
import { keyboard } from "../core/keyboard";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";
gsap.registerPlugin(PixiPlugin);

export default class Play extends Scene {
  async onCreated() {
    const ticker = new PIXI.Ticker;
    this.accessible = true;
    this.sortableChildren = true;
    let bg = PIXI.Sprite.from(Assets._assets.playBg),
      closedDoor = PIXI.Sprite.from(Assets._assets.door),
      handle = PIXI.Sprite.from(Assets._assets.handle),
      handleShadow = PIXI.Sprite.from(Assets._assets.handleShadow),
      openDoor = PIXI.Sprite.from(Assets._assets.doorOpen),
      openDoorShadow = PIXI.Sprite.from(Assets._assets.doorOpenShadow);

    spriteSetup(bg, 0, 0, 0);
    spriteSetup(closedDoor, 20, -10, 0);
    spriteSetup(handle, -12, -10, 1);
    spriteSetup(handleShadow, -7, 0, 0);
    spriteSetup(openDoor, 515, -10, 3);
    spriteSetup(openDoorShadow, 530, 10, 2)

    function spriteSetup(sprite, x, y, zindex) {
      sprite.anchor.set(0.5);
      sprite.scale.set(0.35);
      sprite.position.set(x, y);
      sprite.zIndex = zindex;
    }

    this.addChild(bg, closedDoor, handle, handleShadow);
    let combinations = [];

    generateCode();

    const left = keyboard("ArrowLeft"),
      right = keyboard("ArrowRight");
    let counter = 0,
      degrees = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540],
      spinSide,
      victoryCount = 0;

    left.press = () => {
      if (counter < 9) {
        counter++;
        spinSide = "counterclockwise";
      }
      if (counter == 1) {
        setTimeout(() => {
          switch (degrees[counter] == degrees[combinations[victoryCount].rotation] &&spinSide == combinations[victoryCount].side) {
            case true:
              console.log("correct");
              counter = 0;
              gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
              victoryCount++;
              break;
            case false:
              console.log("false");
              reset();
          }
          if (victoryCount == 3) {
            win(this);
          }
        }, 8000);
      }
      gsap.to(handle, { pixi: { rotation: -degrees[counter] }, duration: 0.3 });
    };

    right.press = () => {
      if (counter < 9) {
        counter++;
        spinSide = "clockwise";
      }
      if (counter == 1) {
        setTimeout(() => {
          switch (degrees[counter] == degrees[combinations[victoryCount].rotation] &&spinSide == combinations[victoryCount].side) {
            case true:
              console.log("correct");
              counter = 0;
              gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
              victoryCount++;
              break;
            case false:
              console.log("false");
              reset();
          }
          if (victoryCount == 3) {
            win(this);
          }
        }, 8000);
      }
      gsap.to(handle, { pixi: { rotation: degrees[counter] }, duration: 0.3 });
    };

    function generateCode() {
      let sides = ["clockwise", "counterclockwise"];

      function combination(rotation, side) {
        this.rotation = rotation;
        this.side = side;
      }

      for (let i = 0; i <= 2; i++) {
        combinations.push(
          new combination(
            Math.floor(Math.random() * (9 - 1) + 1),
            sides[Math.floor(Math.random() * 2)]
          )
        );
        console.log(combinations[i].rotation, combinations[i].side);
      }
    }

    function reset() {
      combinations = [];
      counter = 0;
      gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
      generateCode();
    }

    

    function win(scene) {
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
      

      gsap.fromTo(
        openDoor,
        { pixi: { brightness: 0 } },
        { pixi: { brightness: 1 }, delay: 1 , duration: 5 }
      );
      gsap.fromTo(
        openDoorShadow,
        { pixi: { brightness: 0 } },
        { pixi: { brightness: 1 },delay:1,  duration: 5 }
      );
      gsap.fromTo(
        bg,
        { pixi: { brightness: 0 } },
        { pixi: { brightness: 1 }, delay: 1, duration: 5 }
      );
      
      scene.addChild(openDoor, openDoorShadow);
      scene.removeChild(closedDoor, handle, handleShadow);
    }
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) {
    // eslint-disable-line no-unused-vars
  }
}
