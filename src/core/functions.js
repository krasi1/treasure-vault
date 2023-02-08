/* eslint-disable semi */

export class Combination {
  constructor (rotation, side) {
    this.rotation = rotation;
    this.side = side;
  }
}

export function generateCode (combinations) {
  const sides = ['clockwise', 'counterclockwise'];

  for (let i = 0; i <= 2; i++) {
    combinations.push(new Combination(Math.floor(Math.random() * 9 + 1) * 60, sides[Math.floor(Math.random() * 2)]));
    console.log(combinations[i].rotation / 60, combinations[i].side);
  }
  return combinations;
}

export function spriteSetup (sprite, x, y, zindex) {
  sprite.anchor.set(0.5);
  sprite.scale.set(0.35);
  sprite.position.set(x, y);
  sprite.zIndex = zindex;
}
