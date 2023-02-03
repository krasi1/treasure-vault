import Scene from "./Scene";
import Assets from "../core/AssetManager";
import { keyboard } from "../core/keyboard";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";
import {generateCode, win, spriteSetup } from "../core/functions"
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

    this.addChild(bg, closedDoor, handle, handleShadow);
    
    let combinations = [];
    generateCode(combinations);

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
          switch (degrees[counter] == degrees[combinations[victoryCount].rotation] && spinSide == combinations[victoryCount].side) {
            case true:
              counter = 0;
              gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
              victoryCount++;
              break;
            case false:
              reset();
          }
          if (victoryCount == 3) {
            win(this, openDoor, openDoorShadow, bg, closedDoor, handle, handleShadow, ticker);
          }
        }, 7000);
      }
      console.log(counter);
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
              counter = 0;
              gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
              victoryCount++;
              break;
            case false:
              reset();
          }
          if (victoryCount == 3) {
            win(this, openDoor, openDoorShadow, bg, closedDoor, handle, handleShadow, ticker);
          }
        }, 7000);
      }
      console.log(counter);
      gsap.to(handle, { pixi: { rotation: degrees[counter] }, duration: 0.3 });
    };


    function reset() {
      combinations = [];
      counter = 0;
      gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
      generateCode(combinations);
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
