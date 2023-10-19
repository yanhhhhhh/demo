import { uuid } from '@/utils';
import { Space } from '@/utils';

/**
 * 使用方法
 *
 * 1. 调用 pushStep 将 step 推进 flows 当中, 可以选择是否立即运行
 * 2. 使用 prevStep 或者 nextStep 或者 setStep 会调用 上一次 step 返回的 reset 方法，之后找到下一个 step 执行 start
 * 3. 使用 delStep，如果该 step 为当前执行的 step，会先调用 nextStep，之后在对该 step 进行移除
 * 4. clear 可以清除所有 step 并终止
 *
 * 高级
 *
 * peerEffect
 * 1. 可以在多个 step 中共享执行和重置
 *    (即在指定的 keys 中的步骤，effect 只会执行一次 start，只有在 step 切换到非指定的 keys 中时，才会执行 reset)
 * 2. 可以存在多个 effect
 *
 *
 */

type MaybePromise<T> = T | Promise<T>;

type MaybeArray<T> = T | T[];

type SSPCallback = (ssp?: Space) => MaybePromise<void>;

export interface PeerEffect {
  peerKeys: unknown[];
  start: SSPCallback;
  reset: SSPCallback;
  meta?: Record<PropertyKey, any>;
}

export interface FlowStep {
  key?: unknown;
  start: SSPCallback;
  reset: SSPCallback;
  meta?: Record<PropertyKey, any>;
}
export class SpaceFlows {
  id: string;
  flows: FlowStep[] = [];
  peerEffects: PeerEffect[] = [];

  currentStep: FlowStep | null = null;
  stepMap: Map<unknown, FlowStep> = new Map();
  isStepUnfinishedSet = new Set<unknown>();

  resetCallbacks: (() => void)[] = [];

  get info() {
    return {
      step: this.currentStep,
      flows: this.flows,
      map: this.stepMap,
      ssp: this.ssp,
    };
  }

  get currentFlowIndex() {
    if (!this.currentStep) return -1;
    return this.flows.findIndex((step) => step.key === this.currentStep?.key);
  }

  get currentEffects() {
    if (!this.currentStep) return [];
    return this.getStepEffects(this.currentStep);
  }

  constructor(public ssp?: Space, id?: string) {
    this.id = id || uuid();
  }

  private async execStep(step: FlowStep) {
    this.execEffects(step);
    this.isStepUnfinishedSet.add(step.key);
    this.currentStep = step;
    await step.start(this.ssp);
    this.isStepUnfinishedSet.delete(step.key);
    if (this.resetCallbacks.length) {
      this.resetCallbacks.forEach((cb) => cb());
    }
  }

  private async destroyCurrentStep() {
    const step = this.currentStep;
    if (step) {
      const run = async () => {
        await step.reset(this.ssp);
      };
      if (this.isStepUnfinishedSet.has(step.key)) {
        this.resetCallbacks.push(run);
      } else {
        run();
      }
    }
  }

  private autoKeyMap(steps: FlowStep[]) {
    steps.forEach((step) => {
      if (!step.key) step.key = uuid();
      this.stepMap.set(step.key, step);
    });
  }

  async setStepByKey(key: unknown) {
    const step = this.stepMap.get(key);
    if (step === undefined)
      throw 'failed to find step. key: ' + String(key) + '.';

    await this.destroyCurrentStep();

    await this.execStep(step);

    return this.info;
  }

  async setStepByIndex(index: number) {
    const step = this.flows[index];
    if (step === undefined) throw 'failed to find step. index: ' + index + '.';

    await this.destroyCurrentStep();

    await this.execStep(step);

    return this.info;
  }

  async next() {
    const index = this.currentFlowIndex;
    const nextStep = this.flows[index + 1];
    if (!nextStep) {
      return await this.end();
    }
    await this.destroyCurrentStep();
    await this.execStep(nextStep);
    return this.info;
  }

  async prev() {
    const index = this.currentFlowIndex;
    const prevStep = this.flows[index - 1];
    if (!prevStep) return;
    await this.destroyCurrentStep();
    await this.execStep(prevStep);
    return this.info;
  }

  async end() {
    if (this.currentEffects) {
      this.currentEffects.forEach((effect) => {
        effect.reset(this.ssp);
      });
    }
    if (this.currentStep) {
      await this.destroyCurrentStep();
    }
  }

  async pushStep(steps: MaybeArray<FlowStep>, imediately?: boolean) {
    const flows = Array.isArray(steps) ? steps : [steps];

    this.autoKeyMap(flows);

    this.flows.push(...flows);
    if (imediately) {
      await this.setStepByKey(flows[0].key);
    }
  }

  async delStep(key: unknown) {
    const step = this.stepMap.get(key);
    if (step === undefined)
      throw 'failed to find step. key: ' + String(key) + '.';

    if (this.currentStep && this.currentStep.key === key) {
      await this.destroyCurrentStep();
      await this.next();
    }

    this.stepMap.delete(key);

    this.flows = this.flows.filter((flow) => flow.key !== key);

    return this.info;
  }

  stepEffect(effects: MaybeArray<PeerEffect>) {
    const peers = Array.isArray(effects) ? effects : [effects];
    this.peerEffects.push(...peers);
  }

  getStepEffects(step: FlowStep) {
    return this.peerEffects.filter((effect) => {
      return effect.peerKeys.includes(step.key);
    });
  }

  private execEffects(nextStep: FlowStep) {
    const nextEffects = this.getStepEffects(nextStep);
    const currentEffects = this.currentEffects;

    nextEffects.forEach((effect) => {
      if (currentEffects.includes(effect)) return;
      window.queueMicrotask(() => {
        effect.start(this.ssp);
      });
    });

    currentEffects.forEach((effect) => {
      if (nextEffects.includes(effect)) return;
      window.queueMicrotask(() => {
        effect.reset(this.ssp);
      });
    });
  }

  async clear() {
    try {
      await this.end();
    } finally {
      this.stepMap.clear();
      this.flows.length = 0;
      this.flows = [];
      this.peerEffects.length = 0;
      this.peerEffects = [];
      this.currentStep = null;
    }
  }
}
