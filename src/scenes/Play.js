import Scene from "./Scene";
import Assets from "../core/AssetManager";
import { keyboard } from "../core/keyboard";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";
gsap.registerPlugin(PixiPlugin);

export default class Play extends Scene {
  async onCreated() {
    this.sortableChildren = true;

    let bg = PIXI.Sprite.from(Assets._assets.playBg);
    bg.anchor.set(0.5);
    bg.scale.set(0.35);

    let closedDoor = PIXI.Sprite.from(Assets._assets.door);
    closedDoor.anchor.set(0.5);
    closedDoor.scale.set(0.35);
    closedDoor.position.set(20, -10);

    let handle = PIXI.Sprite.from(Assets._assets.handle);
    handle.anchor.set(0.5);
    handle.scale.set(0.35);
    handle.position.set(-12, -10);
    handle.zIndex = 1;

    let handleShadow = PIXI.Sprite.from(Assets._assets.handleShadow);
    handleShadow.anchor.set(0.5);
    handleShadow.scale.set(0.35);
    handleShadow.position.set(-7, 0);

    this.addChild(bg, closedDoor, handle, handleShadow);

    function generateCode() {
      let sides = ["clockwise", "counterclockwise"];

      let combinations = [];

      function combination(rotation, side) {
        this.rotation = rotation;
        this.side = side;
      }

      for(let i = 0; i <= 2; i++){
        let comb = new combination(Math.floor(Math.random() * (9 - 1) + 1), sides[Math.floor(Math.random() * 2)]);
        combinations.push(comb);
        console.log(combinations[i].rotation, combinations[i].side);
      } 

      return combinations;
    
    }

    generateCode();

    const left = keyboard("ArrowLeft"),
    right = keyboard("ArrowRight");


    
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
