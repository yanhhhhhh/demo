import { Camera, Clock, Scene, WebGLRenderer } from 'three';
import Space from '..';
import TWEEN from '@tweenjs/tween.js';

class Loop {
  protected camera: Camera;
  protected scene: Scene;
  protected renderer: WebGLRenderer;
  protected clock: Clock;
  protected state: { isRunning: boolean };
  updatables: Array<(delta: number) => any>;
  constructor(readonly space: Space) {
    const { camera, scene, renderer, clock } = space;
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.clock = clock;
    this.state = { isRunning: false };
    this.updatables = [];
  }

  start() {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.renderer.setAnimationLoop((time: number) => {
      if (TWEEN.update(time)) {
        this.space.signals.tweenUpdate.dispatch();
      }
      // tell every animated object to tick forward one frame
      this.tick();
    });
  }
  // 停止动画
  stop() {
    if (!this.state.isRunning) return;
    this.state.isRunning = false;
    this.renderer.setAnimationLoop(null);
  }
  // 渲染一帧
  tick() {
    // only call the getDelta function once per frame!
    const delta = this.clock.getDelta();

    //composer
    this.space.effectManager.updateEffectPass();
    if (this.space.effectManager.state.enabled) {
      this.space.effectComposer.render(delta);
    } else {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }

    for (const object of this.updatables) {
      object(delta);
    }
    const hasControlsUpdated = this.space.cameraControls.update(delta);
    if (!hasControlsUpdated) return;
    // console.log(`The last frame rendered in ${delta * 1000} milliseconds`);
    if (!this.space.effectManager.state.enabled) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
    this.space.rendererCSS2D.render(this.scene, this.camera);
    this.space.rendererCSS3D.render(this.scene, this.camera);
    // this.renderer.render(this.scene, this.camera);
  }
}

export { Loop };
