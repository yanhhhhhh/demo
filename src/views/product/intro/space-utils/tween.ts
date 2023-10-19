import * as TWEEN from '@tweenjs/tween.js';
import { Easing } from '@tweenjs/tween.js';

export type AnimationModeType =
  | 'Linear.None'
  | 'Quadratic.In'
  | 'Quadratic.Out'
  | 'Quadratic.InOut'
  | 'Cubic.In'
  | 'Cubic.Out'
  | 'Cubic.InOut'
  | 'Quartic.In'
  | 'Quartic.Out'
  | 'Quartic.InOut'
  | 'Quintic.In'
  | 'Quintic.Out'
  | 'Quintic.InOut'
  | 'Sinusoidal.In'
  | 'Sinusoidal.Out'
  | 'Sinusoidal.InOut'
  | 'Exponential.In'
  | 'Exponential.Out'
  | 'Exponential.InOut'
  | 'Circular.In'
  | 'Circular.Out'
  | 'Circular.InOut'
  | 'Elastic.In'
  | 'Elastic.Out'
  | 'Elastic.InOut'
  | 'Back.In'
  | 'Back.Out'
  | 'Back.InOut'
  | 'Bounce.In'
  | 'Bounce.Out'
  | 'Bounce.InOut';
export type AnimationModeValueType = (amount: number) => number;
const animationModeEnum: Record<AnimationModeType, AnimationModeValueType> = {
  'Linear.None': Easing.Linear.None,
  'Quadratic.In': Easing.Quadratic.In,
  'Quadratic.Out': Easing.Quadratic.Out,
  'Quadratic.InOut': Easing.Quadratic.InOut,
  'Cubic.In': Easing.Cubic.In,
  'Cubic.Out': Easing.Cubic.Out,
  'Cubic.InOut': Easing.Cubic.InOut,
  'Quartic.In': Easing.Quartic.In,
  'Quartic.Out': Easing.Quartic.Out,
  'Quartic.InOut': Easing.Quartic.InOut,
  'Quintic.In': Easing.Quintic.In,
  'Quintic.Out': Easing.Quintic.Out,
  'Quintic.InOut': Easing.Quintic.InOut,
  'Sinusoidal.In': Easing.Sinusoidal.In,
  'Sinusoidal.Out': Easing.Sinusoidal.Out,
  'Sinusoidal.InOut': Easing.Sinusoidal.InOut,
  'Exponential.In': Easing.Exponential.In,
  'Exponential.Out': Easing.Exponential.Out,
  'Exponential.InOut': Easing.Exponential.InOut,
  'Circular.In': Easing.Circular.In,
  'Circular.Out': Easing.Circular.Out,
  'Circular.InOut': Easing.Circular.InOut,
  'Elastic.In': Easing.Elastic.In,
  'Elastic.Out': Easing.Elastic.Out,
  'Elastic.InOut': Easing.Elastic.InOut,
  'Back.In': Easing.Back.In,
  'Back.Out': Easing.Back.Out,
  'Back.InOut': Easing.Back.InOut,
  'Bounce.In': Easing.Bounce.In,
  'Bounce.Out': Easing.Bounce.Out,
  'Bounce.InOut': Easing.Bounce.InOut,
};
class TweenManager {
  private tweens: TWEEN.Tween<any>[]; // Fixed problem 1, 2, 4, 5, 8

  constructor() {
    this.tweens = [];
  }

  add(tween: TWEEN.Tween<any>) {
    this.tweens.push(tween);
  }

  remove(tween: TWEEN.Tween<any>) {
    const index = this.tweens.indexOf(tween);
    if (index !== -1) {
      this.tweens.splice(index, 1);
    }
  }

  update(time: number) {
    TWEEN.update(time);
  }

  startTween(tween: TWEEN.Tween<any>) {
    tween.start();

    this.add(tween);
  }

  stopTween(tween: TWEEN.Tween<any>) {
    tween.stop();
    this.remove(tween);
  }
}

const tweenManager = new TweenManager();

export function createTween(
  from: object,
  to: object,
  duration: number,
  easing?: AnimationModeType
): TWEEN.Tween<any> {
  const tween = new TWEEN.Tween(from).to(to, duration);
  if (easing) {
    const TweenMode = animationModeEnum[easing];
    tween.easing(TweenMode);
  }
  tween.onComplete(() => {
    tweenManager.remove(tween);
  });
  return tween;
}

export function updateTweens(time: number) {
  tweenManager.update(time);
}
