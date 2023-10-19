import { en } from '@/assets/jsons/locales/en-us.json';
import {
  Camera,
  Scene,
  WebGLRenderer,
  HalfFloatType,
  Object3D,
  Group,
  LineSegments,
  LineBasicMaterial,
  BufferGeometry,
  EdgesGeometry,
  Mesh,
  Float32BufferAttribute,
  BufferAttribute,
  Material,
  MeshStandardMaterial,
  Color,
  ColorRepresentation,
} from 'three';
import {
  EffectComposer,
  Pass,
  RenderPass,
  EffectPass,
  Effect,
  BlendFunction,
  OutlineEffect,
  BloomEffect,
  SMAAEffect,
  SMAAPreset,
  EdgeDetectionMode,
} from 'postprocessing';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import localforage from 'localforage';
import * as TWEEN from '@tweenjs/tween.js';

import {
  isArray,
  cloneMaterials,
  disposeMaterials,
  isObject,
  materialHandle,
} from '../share';

import Space from '..';
import { Tween } from '@tweenjs/tween.js';
export interface BaseSelectOptions {
  color?: ColorRepresentation;
  opacity?: number;
}
export interface EffectState<T = Effect> {
  enabled: boolean;
  effect: T;
}
export interface EdgeSelectOptions {
  color?: ColorRepresentation;
  hideColor?: ColorRepresentation;
  edgeThickness?: number;
  edgeStrength?: number;
}

export interface StrokeSelectOptions extends BaseSelectOptions {
  isOpacityShow?: boolean;
  edgeColor?: ColorRepresentation;
  edgeOpacity?: number;
  modelCache?: boolean;
  firstChild?: boolean;
}
export interface SelectModelOptions<TOptions> {
  objects: Object3D[];
  options?: TOptions;
}
export type OpacitySelectOptions = BaseSelectOptions;
export type HighlightSelectOptions = BaseSelectOptions;
export interface EmissiveSelectOptions
  extends Omit<BaseSelectOptions, 'opacity'> {
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
}
export interface BloomOptions {
  enabled?: boolean;
  mipmapBlur?: boolean;
  radius?: number;
  intensity?: number;
  threshold?: number;
  smoothing?: number;
  scalar?: number;
  opacity?: number;
  selection?: Object3D[];
}
const EFFECT_PASS = 'EffectPass';
export class EffectManager {
  static CONSTANTS = {
    renderPass: 'renderPass',
    ssaoPass: 'ssaoPass',
    effectPass: 'effectPass',
    smaaEffect: 'smaaEffect',
    ssgiEffect: 'ssgiEffect',
    outlineEffect: 'outlineEffect',
    ssrEffect: 'ssrEffect',
    bloomEffect: 'bloomEffect',
  };

  effectComposer: EffectComposer;

  passesMap: Map<string, Pass> = new Map();

  effectsMap: Map<string, EffectState> = new Map();
  state: {
    enabled: boolean;
  } = {
    enabled: true,
  };

  effectsNeedsUpdate = true;
  selectedObjects: {
    edge: Object3D[];
    stroke: Object3D[];
    opacity: Object3D[];
    highlight: Object3D[];
    emissive: Object3D[];
  };
  /**
   * 线框
   */
  strokeStore: typeof localforage = localforage.createInstance({
    name: '$$space$$',
    storeName: 'modelStrokeCache',
  });
  constructor(
    readonly space: Space,
    readonly renderer: WebGLRenderer,
    readonly scene: Scene,
    readonly camera: Camera
  ) {
    this.selectedObjects = {
      edge: [],
      stroke: [],
      opacity: [],
      highlight: [],
      emissive: [],
    };

    this.effectComposer = this._initEffectComposer();

    this._initPasses();

    this._initEffects();
  }

  /**
   * 更新 Effect pass
   */
  public updateEffectPass() {
    if (!this.effectsNeedsUpdate) {
      return;
    }

    this.effectsNeedsUpdate = false;

    const { effectComposer } = this;

    // remove prev effect pass
    effectComposer.passes.forEach((pass) => {
      if (pass.name === EFFECT_PASS) {
        effectComposer.removePass(pass);

        pass.dispose();
      }
    });

    // add enabled effect pass
    const effects = Array.from(this.effectsMap)
      .filter(([, { enabled }]) => enabled)
      .map(([, { effect }]) => effect);

    const effectPass = new EffectPass(this.camera, ...effects);

    effectPass.name = EFFECT_PASS;
    effectPass.enabled = !!effects.length;

    this.passesMap.set(EffectManager.CONSTANTS.effectPass, effectPass);

    effectComposer.addPass(effectPass);
  }

  /**
   * 更新 camera
   * @param camera
   */
  public updateCamera(camera: Camera) {
    const { passesMap, effectsMap } = this;
    const { CONSTANTS } = EffectManager;

    const renderPass = passesMap.get(CONSTANTS.renderPass) as RenderPass,
      effectPass = passesMap.get(CONSTANTS.effectPass) as EffectPass;

    renderPass.mainCamera = camera;
    effectPass.mainCamera = camera;

    const outlineEffect = effectsMap.get(
      CONSTANTS.outlineEffect
    ) as EffectState<OutlineEffect>;

    outlineEffect.effect.mainCamera = camera;
  }

  private _initEffectComposer(): EffectComposer {
    const effectComposer = new EffectComposer(this.renderer, {
      multisampling: 8,
      frameBufferType: HalfFloatType,
    });

    return effectComposer;
  }

  private _initPasses() {
    const { effectComposer } = this;

    const renderPass = this._initRenderPass();

    const effectPass = this._initEffectPass();

    this.passesMap.set(EffectManager.CONSTANTS.renderPass, renderPass);

    this.passesMap.set(EffectManager.CONSTANTS.effectPass, effectPass);

    effectComposer.addPass(renderPass);

    effectComposer.addPass(effectPass);
  }

  private _initRenderPass(): RenderPass {
    const renderPass = new RenderPass(this.scene, this.camera);

    return renderPass;
  }

  private _initEffectPass() {
    const effectPass = new EffectPass(this.camera);

    effectPass.name = EFFECT_PASS;

    return effectPass;
  }

  private _initEffects() {
    const { CONSTANTS } = EffectManager;

    const smaaEffect = this._initSMAAEffect();
    const outlineEffect = this._initOutlineEffect();
    const bloomEffect = this._initBloomEffect();

    this.effectsMap.set(CONSTANTS.smaaEffect, {
      enabled: true,
      effect: smaaEffect,
    });
    this.effectsMap.set(CONSTANTS.outlineEffect, {
      enabled: false,
      effect: outlineEffect,
    });

    this.effectsMap.set(CONSTANTS.bloomEffect, {
      enabled: false,
      effect: bloomEffect,
    });
  }

  private _initSMAAEffect() {
    const smaaEffect = new SMAAEffect({
      preset: SMAAPreset.HIGH,
      edgeDetectionMode: EdgeDetectionMode.COLOR,
    });

    return smaaEffect;
  }

  private _initBloomEffect(): BloomEffect {
    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
    });

    return bloomEffect;
  }

  private _initOutlineEffect(): OutlineEffect {
    const outlineEffect = new OutlineEffect(this.scene, this.camera, {
      blendFunction: BlendFunction.SCREEN,
    });

    return outlineEffect;
  }

  edgeShow(
    object: Object3D | Object3D[],
    options?: EdgeSelectOptions
  ): Promise<void> {
    const objects: Object3D[] = [];

    const selectItem = (object: Object3D) => {
      if (
        this.selectedObjects.edge.findIndex(
          (item) => item.uuid === object.uuid
        ) !== -1
      )
        return;
      objects.push(object);
    };

    if (isArray(object)) object.forEach((item) => selectItem(item));
    else if (isObject(object)) selectItem(object);

    this.selectedObjects.edge = [...this.selectedObjects.edge, ...objects];

    this.space.signals.outlineChange.dispatch({
      objects: this.selectedObjects.edge,
      options,
    });

    return Promise.resolve();
  }

  unEdgeShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    if (!objects) objects = [...this.selectedObjects.edge];

    const unSelectItem = (object: Object3D): Promise<void> => {
      const index = this.selectedObjects.edge.findIndex(
        (findItem) => findItem.uuid === object.uuid
      );

      if (index === -1) return Promise.resolve();

      this.selectedObjects.edge.splice(index, 1);

      this.space.signals.outlineChange.dispatch({
        objects: this.selectedObjects.edge,
      });

      return Promise.resolve();
    };

    if (isArray(objects))
      return Promise.all(objects.map((object) => unSelectItem(object)));
    else if (isObject(objects)) return unSelectItem(objects);
    else return Promise.resolve();
  }

  strokeShow(
    object: Object3D | Object3D[],
    options: StrokeSelectOptions = {}
  ): Promise<void | void[]> {
    const {
      isOpacityShow = true,
      color = new Color(0x46ebf7),
      opacity = 0.2,
      edgeColor = new Color(0x00eeff),
      edgeOpacity = 1,
      modelCache = true,
      firstChild = false,
    } = options;

    const selectItem = async (object: Object3D): Promise<void> => {
      if (
        this.selectedObjects.stroke.findIndex(
          (item) => item.uuid === object.uuid
        ) !== -1
      )
        return Promise.resolve();

      if (object.userData.strokeGroup) return Promise.resolve();

      const group = new Group();

      group.name = `${(object as Object3D).id}_${object.name}_stroke`;
      const line = new LineSegments();
      const material = new LineBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: edgeOpacity,
      });

      line.material = material;
      group.add(line);

      let geometry: BufferGeometry | null = null;

      /**
       * compute
       */
      const computeEdgesGeometries = () => {
        /**
         * compute
         */

        const edgesGeometries: EdgesGeometry[] = [];

        (firstChild ? object.children[0] : object).traverse((child) => {
          if (child.type === 'Mesh' && child instanceof Mesh) {
            const edgesGeometry = new EdgesGeometry<BufferGeometry>(
              child.geometry,
              89
            );

            child.updateWorldMatrix(true, false);
            const localMatrix = child.matrixWorld
              .clone()
              .premultiply(object.matrixWorld.clone().invert());

            edgesGeometry.applyMatrix4(localMatrix);

            edgesGeometries.push(edgesGeometry);
          }
        });

        /**
         * skip empty
         */
        if (edgesGeometries.length === 0) {
          return;
        }

        /**
         * merge
         */
        return mergeGeometries(edgesGeometries);
      };

      if (modelCache && object instanceof Object3D && object.uuid) {
        /**
         * 读取本地缓存
         */

        const { uuid } = object;

        await this.strokeStore.ready();

        const strokeBuffer = await this.strokeStore.getItem<ArrayBuffer>(uuid);

        if (strokeBuffer) {
          geometry = new BufferGeometry();

          geometry.setAttribute(
            'position',
            new Float32BufferAttribute(strokeBuffer, 3)
          );
        } else {
          const computedGeometry = computeEdgesGeometries();

          if (computedGeometry) {
            /**
             * 设置缓存
             */

            geometry = computedGeometry;

            const position = computedGeometry.getAttribute(
              'position'
            ) as BufferAttribute;

            if (position.array instanceof Float32Array) {
              this.strokeStore.setItem<ArrayBuffer>(
                uuid,
                position.array.buffer
              );
            }
          }
        }
      } else {
        /**
         * 直接计算
         */

        const computedGeometry = computeEdgesGeometries();

        if (computedGeometry) {
          geometry = computedGeometry;
        }
      }

      if (geometry === null) {
        return;
      }

      line.geometry = geometry;

      object.userData.strokeGroup = group;
      object.userData.strokeOptions = options;

      this.space.scene.add(group, object);

      this.selectedObjects.stroke.push(object);

      if (isOpacityShow)
        this.opacityShow(firstChild ? object.children[0] : object, {
          color,
          opacity,
        });

      return Promise.resolve();
    };

    if (isArray(object))
      return Promise.all(object.map((item) => selectItem(item)));
    else if (isObject(object)) return selectItem(object);
    else return Promise.resolve();
  }

  unStrokeShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    if (!objects) objects = [...this.selectedObjects.stroke];

    const unSelectItem = (object: Object3D): Promise<void> => {
      if (!object.userData.strokeGroup) return Promise.resolve();

      this.space.scene.remove(object.userData.strokeGroup);
      Reflect.deleteProperty(object.userData, 'strokeGroup');

      const index = this.selectedObjects.stroke.findIndex(
        (findItem) => findItem.uuid === object.uuid
      );

      if (index === -1) return Promise.resolve();

      this.selectedObjects.stroke.splice(index, 1);

      const { firstChild } = object.userData.strokeOptions;

      this.unOpacityShow(firstChild ? object.children[0] : object);
      Reflect.deleteProperty(object.userData, 'strokeOptions');

      return Promise.resolve();
    };

    if (isArray(objects))
      return Promise.all(objects.map((item) => unSelectItem(item)));
    else if (isObject(objects)) return unSelectItem(objects);
    else return Promise.resolve();
  }

  opacityShow(
    object: Object3D | Object3D[],
    options: OpacitySelectOptions = {}
  ): Promise<void | void[]> {
    const { color = '#fff', opacity = 0.8 } = options;

    function changeMaterialProp(material: Material): Material {
      const opacityMaterial = cloneMaterials(material) as MeshStandardMaterial;

      opacityMaterial.map = null;
      opacityMaterial.transparent = opacity < 1;
      opacityMaterial.depthWrite = !opacityMaterial.transparent;
      opacityMaterial.color.set(color);
      opacityMaterial.opacity = opacity;

      return opacityMaterial;
    }

    const selectItem = (object: Object3D): Promise<void> => {
      if (
        this.selectedObjects.opacity.findIndex(
          (item) => item.uuid === object.uuid
        ) !== -1
      )
        return Promise.resolve();

      object.traverse((object) => {
        if (object instanceof Mesh) {
          if (object.userData.material) return;

          // 保存原来的材质
          object.userData.material = object.material;

          object.material = materialHandle(object.material, changeMaterialProp);
        }
      });

      this.space.signals.materialChanged.dispatch();

      this.selectedObjects.opacity.push(object);

      return Promise.resolve();
    };

    if (isArray(object))
      return Promise.all(object.map((item) => selectItem(item)));
    else if (isObject(object)) return selectItem(object);
    else return Promise.resolve();
  }

  unOpacityShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    if (!objects) objects = [...this.selectedObjects.opacity];

    const unSelectItem = (object: Object3D): Promise<void> => {
      return new Promise((resolve) => {
        const index = this.selectedObjects.opacity.findIndex(
          (findItem) => findItem.uuid === object.uuid
        );

        if (index === -1) resolve();

        this.selectedObjects.opacity.splice(index, 1);

        object.traverse((object) => {
          if (object instanceof Mesh) {
            if (!object.userData.material) return;

            disposeMaterials(object.material);

            object.material = object.userData.material;

            Reflect.deleteProperty(object.userData, 'material');
          }
        });

        this.space.signals.materialChanged.dispatch();

        resolve();
      });
    };

    if (isArray(objects))
      return Promise.all(objects.map((object) => unSelectItem(object)));
    else if (isObject(objects)) return unSelectItem(objects);
    else return Promise.resolve();
  }

  highlightShow(
    object: Object3D | Object3D[],
    options: HighlightSelectOptions = {}
  ): Promise<void | void[]> {
    const { color = 'red', opacity = 1 } = options;

    function changeMaterialProp(material: Material): void {
      if (material instanceof MeshStandardMaterial) {
        material.color = new Color(color);
        material.opacity = opacity;
        material.transparent = opacity < 1;
        material.depthWrite = !material.transparent;
      }
    }

    const selectItem = (object: Object3D): Promise<void> => {
      if (
        this.selectedObjects.highlight.findIndex(
          (item) => item.uuid === object.uuid
        ) !== -1
      )
        return Promise.resolve();

      object.traverse((object) => {
        if (object instanceof Mesh) {
          if (object.userData.material) return;

          // 保存原来的材质
          object.userData.material = object.material;

          // 克隆材质
          object.material = cloneMaterials(object.material);

          materialHandle(object.material, changeMaterialProp);
        }
      });

      this.space.signals.materialChanged.dispatch();

      this.selectedObjects.highlight.push(object);

      return Promise.resolve();
    };

    if (isArray(object))
      return Promise.all(object.map((item) => selectItem(item)));
    else if (isObject(object)) return selectItem(object);
    else return Promise.resolve();
  }

  unHighlightShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    if (!objects) objects = [...this.selectedObjects.highlight];

    const unSelectItem = (object: Object3D): Promise<void> => {
      return new Promise((resolve) => {
        const index = this.selectedObjects.highlight.findIndex(
          (findItem) => findItem.uuid === object.uuid
        );

        if (index === -1) resolve();

        this.selectedObjects.highlight.splice(index, 1);

        object.traverse((object) => {
          if (object instanceof Mesh) {
            if (!object.userData.material) return;

            disposeMaterials(object.material);

            object.material = object.userData.material;

            Reflect.deleteProperty(object.userData, 'material');
          }
        });

        this.space.signals.materialChanged.dispatch();
        resolve();
      });
    };

    if (isArray(objects))
      return Promise.all(objects.map((object) => unSelectItem(object)));
    else if (isObject(objects)) return unSelectItem(objects);
    else return Promise.resolve();
  }

  emissiveShow(
    object: Object3D | Object3D[],
    options: EmissiveSelectOptions = {}
  ): Promise<void | void[]> {
    const {
      color = 'red',
      maxOpacity = 1,
      minOpacity = 0,
      duration = 1000,
    } = options;

    function changeMaterialProp(material: Material): void {
      if (material instanceof MeshStandardMaterial) {
        material.emissive.set(color);
        material.emissiveIntensity = maxOpacity;

        if (duration !== 0) {
          // Animation(
          //   { emissiveIntensity: maxOpacity },
          //   { emissiveIntensity: minOpacity },
          //   {
          //     duration,
          //     repeat: true,
          //   },
          //   (e) => (material.emissiveIntensity = e.emissiveIntensity),
          //   (animation) => (material.userData.animation = animation)
          // );
          const tween = new Tween({ emissiveIntensity: maxOpacity })
            .to({ emissiveIntensity: minOpacity }, duration)
            .easing(TWEEN.Easing.Linear.None)
            .delay(0)
            .repeat(Infinity)
            .onUpdate((e) => {
              material.emissiveIntensity = e.emissiveIntensity;
            })
            .onStart(() => {
              material.userData.animation = tween;
            });
          tween.yoyo(false);

          tween.start();
        }
      }
    }

    const selectItem = (object: Object3D): Promise<void> => {
      if (
        this.selectedObjects.emissive.findIndex(
          (item) => item.uuid === object.uuid
        ) !== -1
      )
        return Promise.resolve();

      object.traverse((object) => {
        if (object instanceof Mesh) {
          if (object.userData.material) return;

          // 保存原来的材质
          object.userData.material = object.material;

          // 克隆材质
          object.material = cloneMaterials(object.material);

          materialHandle(object.material, changeMaterialProp);
        }
      });

      this.selectedObjects.emissive.push(object);

      this.space.signals.materialChanged.dispatch();

      return Promise.resolve();
    };

    if (isArray(object))
      return Promise.all(object.map((item) => selectItem(item)));
    else if (isObject(object)) return selectItem(object);
    else return Promise.resolve();
  }

  unEmissiveShow(objects?: Object3D | Object3D[]): Promise<void | void[]> {
    if (!objects) objects = [...this.selectedObjects.emissive];

    function changeMaterialProp(material: Material) {
      if (material.userData.animation)
        TWEEN.remove(material.userData.animation);
    }

    const unSelectItem = (object: Object3D): Promise<void> => {
      return new Promise((resolve) => {
        const index = this.selectedObjects.emissive.findIndex(
          (findItem) => findItem.uuid === object.uuid
        );

        if (index === -1) resolve();

        this.selectedObjects.emissive.splice(index, 1);

        object.traverse((object) => {
          if (object instanceof Mesh) {
            if (!object.userData.material) return;

            materialHandle(object.material, changeMaterialProp);

            disposeMaterials(object.material);

            object.material = object.userData.material;

            Reflect.deleteProperty(object.userData, 'material');
          }
        });

        this.space.signals.materialChanged.dispatch();
        resolve();
      });
    };

    if (isArray(objects))
      return Promise.all(objects.map((object) => unSelectItem(object)));
    else if (isObject(objects)) return unSelectItem(objects);
    else return Promise.resolve();
  }
}

export default EffectManager;
