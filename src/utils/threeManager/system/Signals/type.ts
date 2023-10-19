import { Signal } from '@robotlegsjs/signals';

export interface SignalsState {
  click: Signal;
  dblClick: Signal;
  rightClick: Signal;

  // mouse native event
  mouseDown: Signal;
  mouseMove: Signal;
  mouseUp: Signal;

  //pointer native event
  pointerDown: Signal;
  pointerMove: Signal;
  pointerUp: Signal;

  // touch native event
  touchStart: Signal;
  touchMove: Signal;
  touchEnd: Signal;

  // #TODO
  // window
  // windowResize: Signal;

  // custom event
  // hover: Signal;

  // native event
  // mouseWheel: Signal;

  // key native event
  // keyDown: Signal;
  // keyUp: Signal;

  // selectPosition
  selectPosition: Signal;
  outlineChange: Signal;
  materialChanged: Signal;
  tweenUpdate: Signal;
  [x: string]: Signal;
}
