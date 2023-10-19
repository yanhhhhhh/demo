import { Euler, Intersection, Vector3 } from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

export type OutlinePassOptions = Pick<
  OutlinePass,
  | 'edgeStrength'
  | 'edgeGlow'
  | 'edgeThickness'
  | 'pulsePeriod'
  | 'usePatternTexture'
  | 'visibleEdgeColor'
  | 'hiddenEdgeColor'
>;
interface PointEventParams {
  event: PointerEvent;
  intersects: Intersection[];
}

export interface globalSceneEvent {
  click?: (params: PointEventParams) => void;
  dblClick?: (params: PointEventParams) => void;
  rightClick?: (params: PointEventParams) => void;
  onPointerDown?: (params: PointEventParams) => void;
  onPointerMove?: (params: PointEventParams) => void;
  onPointerUp?: (params: PointEventParams) => void;
  selectPosition?: (points: Vector3[]) => void;
}
export interface PoiNodeParams {
  type: '2d' | '3d' | '2.5d';
  element: HTMLElement; // poi node dom
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
}
