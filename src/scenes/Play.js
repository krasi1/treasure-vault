/* global PIXI */
import Scene from './Scene';
import Assets from '../core/AssetManager';
import { keyboard } from '../core/keyboard';
import gsap from 'gsap';
import { PixiPlugin } from 'gsap/all';
import { generateCode, spriteSetup, Combination } from '../core/functions';
gsap.registerPlugin(PixiPlugin);

export default class Play extends Scene {
  async onCreated () {
    this.accessible = true;
    this.sortableChildren = true;
    const bg = PIXI.Sprite.from(Assets._assets.playBg);
    const closedDoor = PIXI.Sprite.from(Assets._assets.door);
    const handle = PIXI.Sprite.from(Assets._assets.handle);
    const handleShadow = PIXI.Sprite.from(Assets._assets.handleShadow);
    const openDoor = PIXI.Sprite.from(Assets._assets.doorOpen);
    const openDoorShadow = PIXI.Sprite.from(Assets._assets.doorOpenShadow);
    const timer = new PIXI.Text('0', {
      fontSize: 25,
      fontWeight: 50,
      align: 'center',
      fill: '#dbdfb9'
    });
    timer.anchor.set(0.5);
    timer.position.set(closedDoor.x - 410, closedDoor.y - 51);

    spriteSetup(bg, 0, 0, 0);
    spriteSetup(closedDoor, 20, -10, 0);
    spriteSetup(handle, -12, -10, 1);
    spriteSetup(handleShadow, -7, 0, 0);
    spriteSetup(openDoor, 515, -10, 3);
    spriteSetup(openDoorShadow, 530, 10, 2);

    this.addChild(bg, closedDoor, handle, handleShadow);

    let gameCombinations = [];
    let playerCombinations = [];
    const scene = this;
    let timerCounter = 0;
    generateCode(gameCombinations);
    startTimer();

    const left = keyboard('ArrowLeft');
    const right = keyboard('ArrowRight');

    let counter = 0;
    let timeout;
    let timeoutIsActive = false;
    let leftPressed = false;
    let rightPressed = false;

    /**
     * the input handlers now just take 60 and -60 as args that get calculated within the gameLogic function
     * Math.abs is used to convert the negative values and the counter variable is used to multiply the degree
     */
    left.press = () => {
      if (!rightPressed) {
        gameLogic('counterclockwise', -60);
        leftPressed = true;
      }
    };

    right.press = () => {
      if (!leftPressed) {
        gameLogic('clockwise', 60);
        rightPressed = true;
      }
    };
    /**
     * setTimeout is a game design choice here. The point is that the timeout gets cleared and set again after every input.
     * this is so that you can fail the game by not inputting the code fast enough and so that you cannot win the game by just rotating until it lands on the correct spot, you can actually overshoot
     * there was an attempt to use the sleep function here, but I could not clear the timeout so the promises just stacked on top of each other
     * also now the game waits for you to input all three codes and pushes them to an array before evaluating and logs a message when you fail. Also the console clears after resetting for more clarity
     */

    async function gameLogic (spinSide, deg) {
      if (counter < 9) {
        counter++;
      }
      if (timeoutIsActive) {
        clearTimeout(timeout);
      }
      timeoutIsActive = true;
      timeout = setTimeout(() => {
        playerCombinations.push(
          new Combination(Math.abs(deg) * counter, spinSide)
        );
        rightPressed = false;
        leftPressed = false;
        counter = 0;
        resetHandle();
        if (playerCombinations.length === 3 && JSON.stringify(gameCombinations) === JSON.stringify(playerCombinations)) {
          win();
          console.log('Congratulations!');
        } else if (playerCombinations.length === 3) {
          reset();
          console.log('Wrong! Try again.');
        }
      }, 1000);

      gsap.timeline().to(handle, { pixi: { rotation: deg * counter }, duration: 0.3 })
        .to(handleShadow, { pixi: { rotation: deg * counter }, duration: 0.3 }, '<');
    }

    function reset () {
      console.clear();
      clearTimeout(timeout);
      counter = 0;
      timerCounter = -1;
      gameCombinations = [];
      playerCombinations = [];
      rightPressed = false;
      leftPressed = false;

      gsap.timeline()
        .fromTo(handle, { pixi: { rotation: 720 } }, { pixi: { rotation: 0 }, duration: 1 })
        .fromTo(handleShadow, { pixi: { rotation: 720 } }, { pixi: { rotation: 0 }, duration: 1 }, '<');
      generateCode(gameCombinations);
    }

    function startTimer () {
      scene.addChild(timer);
      setInterval(() => {
        timerCounter += 1;
        timer.text = timerCounter;
      }, 1000);
    }
    /**
     * the win function now works asynchronously by awaiting the timelines before adding and removing the children and resetting the scene
     * the blink now also does not linger on screen and has an animation where it shines brighter
     */

    async function win () {
      const blink = PIXI.Sprite.from(Assets._assets.blink);
      spriteSetup(blink, -50, 0, 4);
      scene.addChild(openDoor, openDoorShadow, blink);
      scene.removeChild(closedDoor, handle, handleShadow, timer);

      const tl = gsap
        .timeline()
        .fromTo(bg, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 }, duration: 2.5 }, 1)
        .fromTo(openDoor, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 }, duration: 2.5 }, '<')
        .fromTo(openDoorShadow, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 }, duration: 2.5 }, '<')
        .fromTo(blink, { pixi: { alpha: 0 } }, { pixi: { brightness: 1.5, alpha: 1 }, duration: 2.5, yoyo: true }, 2);

      await tl;

      await tl.reverse();

      scene.addChild(closedDoor, handle, handleShadow, timer);
      scene.removeChild(openDoor, openDoorShadow, blink);
      await gsap
        .timeline({ duration: 0.1 })
        .to(bg, { pixi: { brightness: 1 } }, 0)
        .fromTo(closedDoor, { pixi: { brightness: 0 } }, { pixi: { brightness: 1 } }, 0)
        .fromTo(handle, { pixi: { alpha: 0, brightness: 0 } }, { pixi: { alpha: 1, brightness: 1 } }, '<')
        .fromTo(handleShadow, { pixi: { alpha: 0, brightness: 0 } }, { pixi: { alpha: 1, brightness: 1 } }, '<')
        .fromTo(timer, { pixi: { brightness: 0 } }, { pixi: { brightness: 1, alpha: 1 } }, '<');

      reset();
    }
    function resetHandle () {
      gsap.timeline()
        .to(handle, { pixi: { rotation: 0 }, duration: 0.5 })
        .to(handleShadow, { pixi: { rotation: 0 }, duration: 0.5 }, '<');
    }
  }
}
