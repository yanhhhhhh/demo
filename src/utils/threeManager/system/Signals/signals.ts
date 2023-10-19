import { Signal } from '@robotlegsjs/signals';
import { SignalsState } from '.';
export const Signals: SignalsState = {
  click: new Signal(),

  dblClick: new Signal(),

  rightClick: new Signal(),

  // mouse native event
  mouseDown: new Signal(),
  mouseMove: new Signal(),
  mouseUp: new Signal(),

  //pointer native event
  pointerDown: new Signal(),
  pointerMove: new Signal(),
  pointerUp: new Signal(),

  // touch native event
  touchStart: new Signal(),
  touchMove: new Signal(),
  touchEnd: new Signal(),

  // #TODO
  // window
  // windowResize: Signal,
  selectPosition: new Signal(),
  outlineChange: new Signal(),
  materialChanged: new Signal(),
  tweenUpdate: new Signal(),
};
