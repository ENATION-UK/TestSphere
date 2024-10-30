const toString = Object.prototype.toString

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 是否为函数
 * @param val
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function')
}

/**
 * 是否已定义
 * @param val
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

/**
 * 是否未定义
 * @param val
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val)
}

/**
 * 是否为对象
 * @param val
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object')
}

/**
 * 是否为时间
 * @param val
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/**
 * 是否为数值
 * @param val
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * 是否为AsyncFunction
 * @param val
 */
export function isAsyncFunction<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'AsyncFunction')
}

/**
 * 是否为Promise
 * @param val
 */
export function isPromiseLike<T>(val: unknown): val is Promise<T> {
  return val instanceof Promise || typeof (val as any)?.then === 'function'
}

/**
 * 是否为字符串
 * @param val
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * 是否为boolean类型
 * @param val
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * 是否为数组
 * @param val
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/**
 * 是否客户端
 */
export const isClient = () => {
  return typeof window !== 'undefined'
}

/**
 * 是否为浏览器
 * @param val
 */
export const isBrowser = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * 是否为DOMElement
 * @param val
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName
}

/**
 * 是否为图片节点
 * @param o
 */
export function isImageElement(o: Element) {
  return o && ['IMAGE', 'IMG'].includes(o.tagName)
}

/**
 * 是否为Null
 * @param val
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * 是否为Null并且未定义
 * @param val
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/**
 * 是否为Null或者未定义
 * @param val
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}
