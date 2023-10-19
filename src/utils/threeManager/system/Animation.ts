import { Tween, Easing } from '@tweenjs/tween.js';
import { isBoolean, isNumber } from '../share';

import { Euler } from 'three';
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

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  repeat?: number | boolean;
  mode?: AnimationModeType;
  yoyo?: boolean;
}

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

function Animation<PropType extends Record<string, any>>(
  source: PropType,
  target: PropType,
  options: AnimationOptions = {},
  onUpdate?: (source: PropType, tween: Tween<PropType>) => void,
  onStart?: (tween: Tween<PropType>) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const {
      duration = 1000,
      delay = 0,
      repeat = false,
      mode = 'Linear.None',
      yoyo = false,
    } = options;
    const TweenMode = animationModeEnum[mode];

    const tween: Tween<PropType> = new Tween<PropType>(source)
      .to(target, duration)
      .easing(TweenMode)
      .delay(delay)
      .onUpdate((e: PropType) => {
        // Euler
        if (
          source instanceof Euler &&
          target instanceof Euler &&
          e instanceof Euler
        )
          e.order = target.order;
        onUpdate?.(e, tween);
      })
      .onComplete(() => {
        resolve();
      })
      .onStop(() => {
        reject('animation stop');
      })
      .onStart(() => {
        onStart?.(tween);
      });

    if (isNumber(repeat)) tween.repeat(repeat);
    else if (isBoolean(repeat) && repeat) tween.repeat(Infinity);

    tween.yoyo(yoyo);
    tween.start();
  });
}
export { Animation };
export default Animation;
