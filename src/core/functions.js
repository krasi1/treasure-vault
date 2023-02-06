
/**
 * function that generates an array of objects that have a degree and side property and logs them for the player to see 
 * @param {*} combinations 
 * 
 */
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

  /**
   * simple function that adjusts the necessary parameters of all the sprites on screen
   * all assets are a bit too large so their scale is set to .35 
   * @param {*} sprite 
   * @param {*} x 
   * @param {*} y 
   * @param {*} zindex 
   */
  export function spriteSetup(sprite, x, y, zindex) {
    sprite.anchor.set(0.5);
    sprite.scale.set(0.35);
    sprite.position.set(x, y);
    sprite.zIndex = zindex;
  }