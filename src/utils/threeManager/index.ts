import {
  AmbientLight,
  Box3,
  Camera,
  Clock,
  DirectionalLight,
  Object3D,
  Object3DEventMap,
  OrthographicCamera,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  Group,
  Raycaster,
  Vector2,
  Mesh,
} from 'three';
import * as THREE from 'three';
export { THREE };
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import { CameraControls, initCameraControl, ViewHelper } from './components';
import {
  Animation,
  BloomOptions,
  EdgeSelectOptions,
  EffectManager,
  EffectState,
  EmissiveSelectOptions,
  HighlightSelectOptions,
  Loop,
  OpacitySelectOptions,
  Resizer,
  SelectModelOptions,
  Signals,
  SignalsState,
  StrokeSelectOptions,
} from './system';
import {
  CSS3DObject,
  CSS3DRenderer,
  CSS3DSprite,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer, BloomEffect, OutlineEffect } from 'postprocessing';
import type { PoiNodeParams, globalSceneEvent } from './type';

export interface SpaceOptions {
  showStats?: boolean; // 是否显示性能监控
  showViewHelper?: boolean; // 是否展示视图示意图
  enableOutline?: boolean; // 是否可轮廓发光
  events?: globalSceneEvent;
}
const renderer2dDomID = 'space_view_2DPoi';
const renderer3dDomID = 'space_view_3DPoi';
export class Space {
  readonly Three = THREE;
  readonly scene: Scene;
  camera: PerspectiveCamera | OrthographicCamera;
  readonly TWEEN = TWEEN;
  readonly renderer: WebGLRenderer;
  readonly rendererCSS2D: CSS2DRenderer;
  readonly rendererCSS3D: CSS3DRenderer;
  readonly initOptions: Required<SpaceOptions>;
  readonly container: HTMLElement;
  readonly loop: Loop;
  readonly clock: Clock;
  stats: Stats | null = null;
  viewHelper: ViewHelper | null = null;
  gltfLoader: GLTFLoader = new GLTFLoader();

  readonly cameraControls: CameraControls;
  readonly resizer: Resizer;
  // orbitControls: OrbitControls;
  readonly raycaster: Raycaster;
  readonly mouse: Vector2;
  readonly animation = Animation;

  effectManager: EffectManager;
  effectComposer: EffectComposer;
  // 后期处理
  // outlineEffComposer!: EffectComposer;
  // outlinePass!: OutlinePass;
  selectedOutlineMeshSet: Set<string> = new Set();

  //
  readonly signals: SignalsState = Signals;
  constructor(el: HTMLElement, options?: SpaceOptions) {
    const defaultOptions: Required<SpaceOptions> = {
      showStats: false,
      showViewHelper: false,
      enableOutline: false,
      events: {},
    };

    this.container = el;
    this.container.style.position = 'relative';
    this.initOptions = Object.assign(defaultOptions, options);
    const { events } = this.initOptions;
    this.scene = this.initScene();
    this.camera = this.initCamera();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}/model/draco/`);
    this.gltfLoader.setDRACOLoader(dracoLoader);
    this.renderer = this.initRenderer();
    this.rendererCSS2D = this._initRenderCSS2D();
    this.rendererCSS3D = this._initRenderCSS3D();
    this.effectManager = new EffectManager(
      this,
      this.renderer,
      this.scene,
      this.camera
    );
    this.effectComposer = this.effectManager.effectComposer;
    // this.orbitControls = this.initOrbitControls(this.camera, this.renderer);
    this.cameraControls = initCameraControl(this.camera, this.container);
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.clock = new Clock();
    //resize
    this.resizer = new Resizer(this);
    //loop
    this.loop = new Loop(this);

    this.init();
    this.initEvent(events);
    this._signalsEventListenr();
  }
  private initScene() {
    const scene = new Scene();
    return scene;
  }
  private init() {
    this.initLight();

    // if (this.initOptions.enableOutline) {
    //   this.initOutlineComposers();
    // }

    if (this.initOptions.showStats) {
      this.stats = this.initStats();
    }
    if (this.initOptions.showViewHelper) {
      this.initViewHelper();
    }
    this.initAnimate();
  }

  private initCamera() {
    const { width, height } = this.container.getBoundingClientRect();
    const aspect = width / height;
    const camera = new PerspectiveCamera(75, aspect, 0.001, 10000);
    camera.position.set(0, 0, 1000);
    camera.lookAt(this.scene.position);
    this.scene.add(camera);
    return camera;
  }

  initOrbitControls(camera: Camera, renderer: WebGLRenderer) {
    const controller = new OrbitControls(camera, renderer.domElement);
    controller.enableDamping = true;
    // controller.dampingFactor = 0.05;
    // controller.minDistance = 1;
    // controller.maxDistance = 100;
    // controller.minPolarAngle = Math.PI / 4;
    // controller.maxPolarAngle = (3 * Math.PI) / 4;
    // controller.maxPolarAngle = (4 * Math.PI)

    return controller;
  }
  private initRenderer() {
    const renderer = new WebGLRenderer({
      antialias: true, // 抗锯齿
      alpha: true, // 允许背景透明
      powerPreference: 'high-performance', // 高性能模式
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.sortObjects = true; // 对象排序
    renderer.outputColorSpace = SRGBColorSpace; // 颜色空间
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    this.container.appendChild(renderer.domElement);
    return renderer;
  }
  private _initRenderCSS2D(): CSS2DRenderer {
    const renderer = new CSS2DRenderer();

    renderer.domElement.id = renderer2dDomID;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    renderer.domElement.style.pointerEvents = 'none';
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(renderer.domElement);

    return renderer;
  }

  private _initRenderCSS3D(): CSS3DRenderer {
    const renderer = new CSS3DRenderer();

    renderer.domElement.id = renderer3dDomID;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    renderer.domElement.style.pointerEvents = 'none';
    renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(renderer.domElement);

    return renderer;
  }

  initStats() {
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.left = '0px';
    stats.dom.style.top = '0px';
    this.container.appendChild(stats.dom);
    return stats;
  }

  initLight() {
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    ambientLight.name = '$$space-ambientLight$$';
    this.scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1000, 1000, 1000);
    directionalLight.name = '$$space-directionalLight$$';
    this.scene.add(directionalLight);
  }
  getAmbientLight() {
    return this.scene.getObjectByName('$$space-ambientLight$$') as AmbientLight;
  }

  private initEvent(events: globalSceneEvent) {
    const {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      click,
      dblClick,
      rightClick,
      selectPosition,
    } = events || {};
    if (onPointerDown) {
      this.signals.pointerDown.add(onPointerDown);
    }
    if (onPointerMove) {
      this.signals.pointerMove.add(onPointerMove);
    }
    if (onPointerUp) {
      this.signals.pointerUp.add(onPointerUp);
    }
    if (click) {
      this.signals.click.add(click);
    }
    if (dblClick) {
      this.signals.dblClick.add(dblClick);
    }
    if (rightClick) {
      this.signals.rightClick.add(rightClick);
    }
    if (selectPosition) {
      this.signals.selectPosition.add(selectPosition);
    }
    this.container.addEventListener(
      'pointermove',
      this.onPointerMove.bind(this),
      false
    );
    this.container.addEventListener(
      'pointerdown',
      this.onPointerDown.bind(this),
      false
    );
    this.container.addEventListener(
      'pointerup',
      this.onPointerUp.bind(this),
      false
    );
  }
  protected onPointerMove(event: PointerEvent) {
    // console.log('onPointerMove', event);
    const intersects = this.getIntersects(event);
    if (intersects.length > 0) {
      if (event.pointerType === 'mouse') {
        this.signals.mouseMove.dispatch(intersects);
      }
      if (event.pointerType === 'touch') {
        this.signals.touchMove.dispatch(intersects);
      }

      this.signals.pointerDown.dispatch(intersects);
    }
  }
  protected onPointerDown(event: PointerEvent) {
    // console.log('onPointerDown', event);
    const intersects = this.getIntersects(event);
    if (intersects.length > 0) {
      const points = intersects.map((v) => v.point);
      if (event.pointerType === 'mouse') {
        //鼠标事件
        this.signals.mouseDown.dispatch(intersects);
        if (event.button === 0) {
          this.signals.click.dispatch(intersects);
        }
        if (event.button === 1) {
          this.signals.dblClick.dispatch(intersects);
        }
        if (event.button === 2) {
          this.signals.rightClick.dispatch(intersects);
        }
      }
      if (event.pointerType === 'touch') {
        this.signals.touchStart.dispatch(intersects);
      }
      this.signals.pointerDown.dispatch(intersects);
      this.signals.selectPosition.dispatch(points);
    }
  }
  protected onPointerUp(event: PointerEvent) {
    // console.log('onPointerUp', event);
    const intersects = this.getIntersects(event);
    if (intersects.length > 0) {
      if (event.pointerType === 'mouse') {
        this.signals.mouseUp.dispatch(intersects);
      }
      if (event.pointerType === 'touch') {
        this.signals.touchEnd.dispatch(intersects);
      }

      this.signals.pointerUp.dispatch(intersects);
    }
  }
  createPoiNode(space: Space, poiNodeParams: PoiNodeParams) {
    const { type, element, position, rotation, scale } = poiNodeParams;
    let poiNode: CSS2DObject | CSS3DObject | CSS3DSprite;

    switch (type) {
      case '3d': {
        poiNode = new CSS3DObject(element);
        break;
      }
      case '2.5d': {
        poiNode = new CSS3DSprite(element);
        break;
      }
      case '2d':
      default: {
        poiNode = new CSS2DObject(element);
        break;
      }
    }

    if (position) {
      poiNode.position.copy(position);
    }
    if (rotation) {
      poiNode.rotation.copy(rotation);
    }
    if (scale) {
      poiNode.scale.copy(scale);
    }

    space.scene.add(poiNode);
    return poiNode;
  }
  getIntersects(event: PointerEvent) {
    const { clientX, clientY } = event;
    const { left, top, width, height } = this.container.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = -((clientY - top) / height) * 2 + 1;
    this.mouse.set(x, y);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    // console.log('intersects', intersects);
    return intersects;
  }
  triggerRender() {
    this.renderer.render(this.scene, this.camera);
    if (this.rendererCSS2D) {
      this.rendererCSS2D.render(this.scene, this.camera);
    }
    if (this.rendererCSS3D) {
      this.rendererCSS3D.render(this.scene, this.camera);
    }
  }
  _signalsEventListenr() {
    // tween
    this.signals.tweenUpdate.add(() => {
      this.triggerRender();
    });
    this.signals.materialChanged.add(() => this.render());
    const outlineChange = (param: SelectModelOptions<EdgeSelectOptions>) => {
      const defaultOption = {
        color: 0xffffff,
        hideColor: 0x999999,
        edgeThickness: 3,
        edgeStrength: 10,
      };

      const { objects, options } = param;
      const { color, hideColor, edgeThickness, edgeStrength } = {
        ...defaultOption,
        ...options,
      };

      const { effectManager } = this;

      const outlineEffectState = effectManager.effectsMap.get(
        EffectManager.CONSTANTS.outlineEffect
      ) as EffectState<OutlineEffect>;

      const enabled = objects.length > 0;

      if (outlineEffectState.enabled !== enabled) {
        outlineEffectState.enabled = enabled;
        effectManager.effectsNeedsUpdate = true;
      }

      const { effect } = outlineEffectState;
      const { uniforms } = effect;

      const meshes: Mesh[] = [];

      objects.forEach((object) => {
        object.traverse((child) => {
          if (child instanceof Mesh) meshes.push(child);
        });
      });

      effect.selection.set(meshes);

      // blurriness
      effect.blur = edgeThickness > 0;
      effect.blurPass.kernelSize = edgeThickness;

      // uniforms
      const visibleEdgeColorUniform = uniforms.get('visibleEdgeColor');
      const hiddenEdgeColorUniform = uniforms.get('hiddenEdgeColor');
      const edgeStrengthUniform = uniforms.get('edgeStrength');

      if (visibleEdgeColorUniform) visibleEdgeColorUniform.value.set(color);
      if (hiddenEdgeColorUniform) hiddenEdgeColorUniform.value.set(hideColor);
      if (edgeStrengthUniform) edgeStrengthUniform.value = edgeStrength;

      this.render();
    };

    // outline
    this.signals.outlineChange.add(outlineChange);
  }
  /**
   ***************************** post-processing ***************************
   */
  // TODO 待调试，有问题
  // setBloom(options: BloomOptions = {}) {
  //   const {
  //     enabled = true,
  //     mipmapBlur = true,
  //     radius = 0.85,
  //     intensity = 3,
  //     threshold = 1,
  //     smoothing = 0.01,
  //     scalar = 2,
  //     opacity = 1,
  //     selection = [],
  //   } = options;

  //   const { effectManager } = this;

  //   const bloomEffect = effectManager.effectsMap.get(
  //     EffectManager.CONSTANTS.bloomEffect
  //   ) as EffectState<BloomEffect>;

  //   if (bloomEffect.enabled !== enabled) {
  //     bloomEffect.enabled = enabled;
  //     effectManager.effectsNeedsUpdate = true;
  //   }

  //   const { effect } = bloomEffect;

  //   effect.intensity = intensity;

  //   const { mipmapBlurPass, renderTarget } = effect as any;

  //   // mipmap
  //   mipmapBlurPass.enabled = mipmapBlur;
  //   mipmapBlurPass.radius = radius;

  //   const mapUniform = effect.uniforms.get('map');

  //   if (mapUniform) {
  //     mapUniform.value = mipmapBlur
  //       ? mipmapBlurPass.texture
  //       : renderTarget.texture;
  //   }

  //   // luminance
  //   effect.luminanceMaterial.threshold = threshold;
  //   effect.luminanceMaterial.smoothing = smoothing;

  //   effect.blendMode.opacity.value = opacity;

  //   /**
  //    * selection
  //    */
  //   effect.luminanceMaterial.userData.bloomSelection?.forEach(
  //     (child: Mesh<any, any>) => {
  //       child.material.toneMapped = true;
  //       child.material.color.multiplyScalar(
  //         1 / child.material.userData.prevScalar
  //       );
  //       Reflect.deleteProperty(child.material.userData, 'prevScalar');
  //     }
  //   );

  //   effect.luminanceMaterial.userData.bloomSelection = [];

  //   if (enabled) {
  //     selection.forEach((object) => {
  //       object.traverse((child) => {
  //         if (child instanceof Mesh && child.material.color) {
  //           child.material.toneMapped = false;
  //           child.material.color.multiplyScalar(scalar);
  //           child.material.userData.prevScalar = scalar;

  //           effect.luminanceMaterial.userData.bloomSelection.push(child);
  //         }
  //       });
  //     });
  //   }

  //   this.renderer.render(this.scene, this.camera);
  // }
  /**
   * 轮廓显示模型
   * @param object
   * @param options
   */
  edgeShow(
    object: Object3D | Object3D[],
    options?: EdgeSelectOptions
  ): Promise<void> {
    return this.effectManager.edgeShow(object, options);
  }
  /**
   * 取消轮廓显示模型
   * @param objects
   */
  unEdgeShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    return this.effectManager.unEdgeShow(objects);
  }
  /**
   * 描边显示模型
   * @param object
   * @param options
   */
  strokeShow(
    object: Object3D | Object3D[],
    options?: StrokeSelectOptions
  ): Promise<void | void[]> {
    return this.effectManager.strokeShow(object, options);
  }
  /**
   * 取消描边显示模型
   * @param objects
   */
  unStrokeShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    return this.effectManager.unStrokeShow(objects);
  }
  /**
   * 透明显示模型
   * @param object
   * @param options
   */
  opacityShow(
    object: Object3D | Object3D[],
    options?: OpacitySelectOptions
  ): Promise<void | void[]> {
    return this.effectManager.opacityShow(object, options);
  }
  /**
   * 取消透明显示模型
   * @param objects
   */
  unOpacityShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    return this.effectManager.unOpacityShow(objects);
  }
  /**
   * 高亮显示模型
   * @param object
   * @param options
   */
  highlightShow(
    object: Object3D | Object3D[],
    options?: HighlightSelectOptions
  ): Promise<void | void[]> {
    return this.effectManager.highlightShow(object, options);
  }
  /**
   * 取消高亮显示模型
   * @param objects
   */
  unHighlightShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    return this.effectManager.unHighlightShow(objects);
  }
  /**
   * 自发光显示模型
   * @param object
   * @param options
   */
  emissiveShow(
    object: Object3D | Object3D[],
    options?: EmissiveSelectOptions
  ): Promise<void | void[]> {
    return this.effectManager.emissiveShow(object, options);
  }
  /**
   * 取消自发光显示模型
   * @param objects
   */
  unEmissiveShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    return this.effectManager.unEmissiveShow(objects);
  }

  initAnimate() {
    this.renderer.render(this.scene, this.camera);

    // if (this.initOptions.enableOutline) {
    //   this.loop.updatables.push(this.outlineEffRender.bind(this));
    // }

    if (this.viewHelper) {
      this.loop.updatables.push(() => {
        this.viewHelper && this.viewHelper.render(this.renderer);
      });
    }
    if (this.stats) {
      this.loop.updatables.push(this.stats.update.bind(this.stats));
    }
  }

  initViewHelper() {
    this.viewHelper = new ViewHelper(
      this.camera,
      this.container,
      this.cameraControls
    );
  }

  render() {
    // draw a single frame
    this.loop.tick();
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
  clearSignals(): void {
    for (const i in this.signals) this.signals[i].removeAll();
  }
  destroy() {
    this.resizer.dispose();
    this.signals;
    this.loop.stop();
    this.clearSignals();
    if (this.stats) {
      this.container.removeChild(this.stats.dom);
    }
    if (this.viewHelper) {
      this.viewHelper.dispose();
    }
    // composer
    this.effectComposer.dispose();

    if (this.rendererCSS2D) {
      this.container.removeChild(this.rendererCSS2D.domElement);
    }
    if (this.rendererCSS3D) {
      this.container.removeChild(this.rendererCSS3D.domElement);
    }
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }

  loadModel(modelPath: string, isFixToBox: boolean = false) {
    return new Promise<Group<Object3DEventMap>>((resolve) => {
      this.gltfLoader?.load(
        modelPath,
        async (gltf) => {
          const obj = gltf.scene;
          this.scene.add(obj);
          if (isFixToBox) {
            await this.cameraControls.fitToBox(obj, true, {
              cover: false,
              paddingLeft: 0.2,
              paddingRight: 0.2,
              paddingBottom: 0.2,
              paddingTop: 0.2,
            });
          }

          // this.orbitControls.update();
          resolve(obj);
        },
        (process) => {
          // console.log((process.loaded / process.total) * 100 + '% loaded');
        },
        (err) => {
          console.error('load failed:', err);
        }
      );
    });
  }

  center(mesh: Object3D): Vector3 {
    const box3 = new Box3();
    box3.expandByObject(mesh);
    const center = new Vector3();
    box3.getCenter(center);
    return center;
  }
  getCenterPointAndSize(object: Object3D) {
    object.updateMatrixWorld(true);
    // object.updateWorldMatrix(true, true);
    // object.updateMatrix();
    // if (object instanceof Mesh) {
    //   object.geometry.computeBoundingBox();
    //   object.geometry.center();
    // }
    const box = new Box3().setFromObject(object);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);
    return {
      center,
      size,
    };
  }
  /**
   * 渲染outline，可用于射线拾取的交互/外部界面的交互
   * @param isBloom
   * @param mesh
   */
  // toggleBloomMesh(isBloom: boolean, mesh: string | THREE.Mesh) {
  //   const meshName = typeof mesh === 'string' ? mesh : mesh.name;
  //   const isExitFlag = this.selectedOutlineMeshSet.has(meshName);

  //   const selectedObjects = this.outlinePass.selectedObjects;
  //   if (isBloom) {
  //     if (!isExitFlag) {
  //       this.selectedOutlineMeshSet.add(meshName);
  //       if (typeof mesh === 'string') {
  //         this.scene.traverse((v) => {
  //           if ((v as THREE.Mesh).isMesh && v.name === mesh) {
  //             selectedObjects.push(v);
  //           }
  //         });
  //       } else {
  //         selectedObjects.push(mesh);
  //       }
  //     }
  //   } else {
  //     if (isExitFlag) {
  //       const idx = this.outlinePass.selectedObjects.findIndex(
  //         (v) => v.name !== meshName
  //       );
  //       this.outlinePass.selectedObjects.splice(idx, 1);
  //       this.selectedOutlineMeshSet.delete(meshName);
  //     }
  //   }
  // }

  /**
   * 初始化outline轮廓发光
   */
  // initOutlineComposers(): void {
  //   const { width, height } = this.container.getBoundingClientRect();
  //   const composer = new EffectComposer(this.renderer);
  //   const renderPass = new RenderPass(this.scene, this.camera);
  //   composer.addPass(renderPass);

  //   const outlinePass = new OutlinePass(
  //     new THREE.Vector2(width, height),
  //     this.scene,
  //     this.camera
  //   );
  //   outlinePass.visibleEdgeColor.set(0xffff00); //包围线颜色
  //   composer.addPass(outlinePass);

  //   const outputPass = new OutputPass();
  //   composer.addPass(outputPass);

  //   const effectFXAA = new ShaderPass(FXAAShader);
  //   effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
  //   composer.addPass(effectFXAA);
  //   this.outlinePass = outlinePass;
  //   this.outlineEffComposer = composer;
  // }

  // destroyOutlineComposer() {
  //   this.outlinePass.dispose();
  //   this.outlineEffComposer.dispose();
  // }

  // outlineEffRender() {
  //   this.outlineEffComposer.render();
  // }

  /**
   * 定制轮廓的样式
   * @param opt
   */
  // changeOutlinePassConfig(opt: Partial<OutlinePassOptions>) {
  //   const attrs = Object.keys(opt);
  //   attrs.forEach((k) => {
  //     if (['visibleEdgeColor', 'hiddenEdgeColor'].includes(k)) {
  //       // @ts-ignore
  //       this.outlinePass[k].set(opt[k]);
  //     } else {
  //       // @ts-ignore
  //       this.outlinePass[k] = opt[k];
  //     }
  //   });
  // }
}
export default Space;

export * from './type';
