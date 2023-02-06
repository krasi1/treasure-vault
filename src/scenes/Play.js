import Scene from "./Scene";
import Assets from "../core/AssetManager";
import { keyboard } from "../core/keyboard";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";
import {generateCode, spriteSetup } from "../core/functions"
gsap.registerPlugin(PixiPlugin);

export default class Play extends Scene {
 
  async onCreated() {
    this.accessible = true;
    this.sortableChildren = true;
    let bg = PIXI.Sprite.from(Assets._assets.playBg),
      closedDoor = PIXI.Sprite.from(Assets._assets.door),
      handle = PIXI.Sprite.from(Assets._assets.handle),
      handleShadow = PIXI.Sprite.from(Assets._assets.handleShadow),
      openDoor = PIXI.Sprite.from(Assets._assets.doorOpen),
      openDoorShadow = PIXI.Sprite.from(Assets._assets.doorOpenShadow),
       timer = new PIXI.Text( "0", {
        fontSize: 50,
        fontStyle: "oblique",
        fontWeight: 200,
        align:"center",
        fill: "#336152",
      });
      timer.anchor.set(0.5, 8.5);
      timer.scale.set(1);

    spriteSetup(bg, 0, 0, 0);
    spriteSetup(closedDoor, 20, -10, 0);
    spriteSetup(handle, -12, -10, 1);
    spriteSetup(handleShadow, -7, 0, 0);
    spriteSetup(openDoor, 515, -10, 3);
    spriteSetup(openDoorShadow, 530, 10, 2)

    this.addChild(bg, closedDoor, handle, handleShadow);
    
    let combinations = [],
    scene = this,
    timerCounter = 0; 
    generateCode(combinations);
    startTimer();
    
    const left = keyboard("ArrowLeft"),
      right = keyboard("ArrowRight");

    let counter = 0,
      victoryCount = 0,
      timeout,
      timeoutIsActive = false,
      leftPressed = false,
      rightPressed = false;

    left.press = () => {
      rightPressed?()=>{
      reset()}
      :gameLogic("counterclockwise", [-0, -60, -120, -180, -240, -300, -360, -420, -480, -540]);
      leftPressed = true;   
    };

    right.press = () => {
      leftPressed?()=>{
      reset()}
      :gameLogic("clockwise", [0, 60, 120, 180, 240, 300, 360, 420, 480, 540]);
      rightPressed = true;
    };

    function gameLogic(spinSide, deg){

      if (counter < 9) {
        counter++;
      }
      if(timeoutIsActive){
        clearTimeout(timeout)
      }
       timeoutIsActive = true;
       timeout = setTimeout(() => {
          switch (deg[counter] == deg[combinations[victoryCount].rotation] && spinSide == combinations[victoryCount].side) {
            case true:
              rightPressed = false;
              leftPressed = false;
              counter = 0;
              gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
              gsap.to(handleShadow, { pixi: { rotation: 0 }, duration: 1 });
              victoryCount++;
              break;
            case false:
              reset();
          }
          if (victoryCount == 3) {
            win();
          }
        }, 1500);

      
      gsap.to(handle, { pixi: { rotation: deg[counter] }, duration: 0.3 });
      gsap.to(handleShadow, { pixi: { rotation: deg[counter] }, duration: 0.3 });
    }
    
    function reset() {
      clearTimeout(timeout);
      timerCounter = -1; 
      combinations = [];
      victoryCount = 0;
      counter = 0;
      rightPressed = false;
      leftPressed = false;
      gsap.to(handle, { pixi: { rotation: 0 }, duration: 1 });
      gsap.to(handleShadow, { pixi: { rotation: 0 }, duration: 1 });
      generateCode(combinations);  
    }

    function startTimer(){     
      scene.addChild(timer);
  
      setInterval(()=> {
        timerCounter += 1;
        timer.text = timerCounter;   
    }, 1000);

    }

    function win() {
      let blink = PIXI.Sprite.from(Assets._assets.blink);
      spriteSetup(blink, -50, 0, 3)
      
      let tl = gsap.timeline() 
      tl.fromTo(openDoor, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 }, delay: 1 , duration: 5 });
      tl.fromTo(openDoorShadow,{ pixi: { brightness: 0 } },{ pixi: { brightness: 1 },delay:1,  duration: 5 }, 0);
      tl.fromTo(bg,{ pixi: { brightness: 0 } },{ pixi: { brightness: 1 }, delay: 1, duration: 5 }, 0);
      tl.fromTo(blink, {pixi:{brightness: 1}}, {pixi:{brightness: 1.2,alpha: 1 }, duration: 2, yoyo: true, repeat: -1})
      
      setTimeout(() => {
          tl.reverse().then(()=>{
            gsap.to(bg, {pixi:{brightness: 1}, duration: 0.1})
            scene.addChild(closedDoor, handle, handleShadow);
            scene.removeChild(openDoor, openDoorShadow, blink);
            gsap.fromTo(handle, {pixi:{rotation: 720}}, {pixi:{rotation:0}, duration: 1});
            gsap.fromTo(handleShadow, {pixi:{rotation: 720}}, {pixi:{rotation:0}, duration: 1});
            setTimeout(()=>{
              reset();
              scene.addChild(timer);
            }, 1500)
    
          });     
      }, 6000);
      
      scene.addChild(openDoor, openDoorShadow, blink);
      scene.removeChild(closedDoor, handle, handleShadow, timer);
    }
     
  }

}
