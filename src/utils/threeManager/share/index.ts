import { Material } from 'three';

export function getExtension(url: string): string | undefined {
  const { href } = new URL(url, location.origin);
  if (href.includes('.')) {
    const parsePrev = href.split('.').pop();

    if (!parsePrev) return undefined;

    if (parsePrev.includes('?')) {
      return parsePrev.split('?').shift()?.toLowerCase();
    }

    return parsePrev;
  }

  return undefined;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

//
const hasOwn = (val: object, key: string | symbol): key is keyof typeof val =>
  hasOwnProperty.call(val, key);

//
const isString = (val: unknown): val is string =>
  getValueType(val) === 'String';
const isBoolean = (val: unknown): val is boolean =>
  getValueType(val) === 'Boolean';
const isNumber = (val: unknown): val is number =>
  getValueType(val) === 'Number';
const isNull = (val: unknown): val is null => getValueType(val) === 'Null';
const isUndefined = (val: unknown): val is null =>
  getValueType(val) === 'Undefined';
const isSymbol = (val: unknown): val is symbol =>
  getValueType(val) === 'Symbol';
//
const isDate = (val: unknown): val is Date => getValueType(val) === 'Date';
const isArray = Array.isArray;
const isObject = <T = Record<any, any>>(val: unknown): val is T =>
  getValueType(val) === 'Object';
const isFunction = (val: unknown): val is () => void =>
  getValueType(val) === 'Function';
const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  getValueType(val) === 'Promise';

//
const getValueType = (val: any): string => {
  return Object.prototype.toString.call(val).slice(8, -1);
};

const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
};

const getAsciiString = (buf: ArrayBufferLike, offset: number, len: number) => {
  return String.fromCodePoint(...new Uint8Array(buf, offset, len));
};
export const materialHandle = <T extends Material = Material, R = any>(
  material: T | T[],
  handler: (m: T) => R
) => {
  if (isArray(material)) {
    return material.map(handler);
  } else {
    return handler(material);
  }
};

export const cloneMaterials = <T extends Material = Material>(
  material: T | T[]
) => {
  return materialHandle(material, (m) => m.clone());
};

export const disposeMaterials = <T extends Material = Material>(
  material: T | T[]
) => {
  return materialHandle(material, (m) => m.dispose());
};
const randomString = () =>
  '$$Space$$' + Math.random().toString(36).substring(7).split('').join('_');

export { hasOwn };
export { isString, isBoolean, isNumber, isNull, isUndefined, isSymbol };
export { isDate, isArray, isObject, isFunction, isPromise };
export { getValueType, sleep, getAsciiString, randomString };
